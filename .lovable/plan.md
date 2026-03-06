#   
---  
  
## Overview  
  
A professional, multi-page website for **Clearway Car Hire**, an independent car rental consultancy based in Ireland. The site drives inquiries via email/phone, builds trust, and showcases service packages. Built in **React + Tailwind CSS + React Router**, deployed to **Cloudflare Pages**, with **Supabase** as the backend for contact form submissions, inquiry storage, and optional email notifications.  
  
> **Architecture:** React SPA → Cloudflare Pages (CDN + edge) → Supabase (PostgreSQL + Auth + Edge Functions)  
  
---  
  
## Infrastructure & Deployment Architecture  
  
```  
┌─────────────────────────────────────────────────────────────┐  
│                      ARCHITECTURE DIAGRAM                    │  
├─────────────────────────────────────────────────────────────┤  
│                                                             │  
│   [User Browser]                                            │  
│        │                                                    │  
│        ▼                                                    │  
│   [Cloudflare CDN / Pages]                                  │  
│   ┌─────────────────────────────────────┐                   │  
│   │  React SPA (Static Build)           │                   │  
│   │  - HTML/CSS/JS bundles              │                   │  
│   │  - _headers (security headers)      │                   │  
│   │  - _redirects (SPA routing)         │                   │  
│   │  - Cloudflare Web Analytics         │                   │  
│   └──────────────┬──────────────────────┘                   │  
│                  │                                           │  
│                  │ HTTPS (Supabase JS Client)                │  
│                  ▼                                           │  
│   [Supabase Backend]                                        │  
│   ┌─────────────────────────────────────┐                   │  
│   │  PostgreSQL Database                │                   │  
│   │  ├── inquiries table                │                   │  
│   │  ├── Row Level Security (RLS)       │                   │  
│   │  └── Indexes                        │                   │  
│   │                                     │                   │  
│   │  Edge Functions (Deno)              │                   │  
│   │  ├── send-notification (email)      │                   │  
│   │  └── form-validation               │                   │  
│   │                                     │                   │  
│   │  Auth (anon key only — public)      │                   │  
│   └─────────────────────────────────────┘                   │  
│                                                             │  
└─────────────────────────────────────────────────────────────┘  
```  
  
---  
  
## Supabase Setup (Complete Schema & Configuration)  
  
### 1. Project Creation  
```  
Project Name:     clearway-car-hire  
Region:           EU West (London) — closest to Ireland  
Database Password: [secure, store in password manager]  
```  
  
### 2. Database Tables  
  
#### Table: `inquiries`  
  
```sql  
-- ============================================================  
-- SUPABASE TABLE: inquiries  
-- Stores all contact form submissions  
-- ============================================================  
  
CREATE TABLE public.inquiries (  
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,  
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,  
    
  -- Contact Information  
  name            TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),  
  email           TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),  
  phone           TEXT DEFAULT NULL CHECK (phone IS NULL OR char_length(phone) <= 20),  
    
  -- Booking Details  
  travel_dates    TEXT DEFAULT NULL CHECK (travel_dates IS NULL OR char_length(travel_dates) <= 200),  
  pickup_location TEXT DEFAULT NULL CHECK (pickup_location IS NULL OR char_length(pickup_location) <= 200),  
  message         TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),  
    
  -- Meta  
  source_page     TEXT DEFAULT 'contact' CHECK (source_page IN ('contact', 'home', 'services', 'how-it-works', 'about')),  
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),  
  ip_address      INET DEFAULT NULL,  
  user_agent      TEXT DEFAULT NULL,  
    
  -- Anti-spam  
  honeypot        TEXT DEFAULT NULL, -- should always be NULL/empty for real submissions  
  submitted_at_ms BIGINT DEFAULT NULL -- client-side timestamp for bot detection  
);  
  
-- Index for admin queries  
CREATE INDEX idx_inquiries_created_at ON public.inquiries (created_at DESC);  
CREATE INDEX idx_inquiries_status ON public.inquiries (status);  
CREATE INDEX idx_inquiries_email ON public.inquiries (email);  
  
-- Enable Row Level Security  
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;  
```  
  
#### Row Level Security (RLS) Policies  
  
```sql  
-- ============================================================  
-- RLS POLICIES  
-- ============================================================  
  
-- Policy 1: Allow anonymous INSERT (public form submissions)  
CREATE POLICY "Allow public form submissions"  
  ON public.inquiries  
  FOR INSERT  
  TO anon  
  WITH CHECK (  
    -- Honeypot must be empty (anti-spam)  
    (honeypot IS NULL OR honeypot = '')  
    -- Status must be 'new' (prevent status manipulation)  
    AND status = 'new'  
  );  
  
-- Policy 2: DENY all SELECT/UPDATE/DELETE for anon users  
-- (No policy = denied by default with RLS enabled)  
  
-- Policy 3: Allow authenticated (admin) full access  
CREATE POLICY "Allow admin full access"  
  ON public.inquiries  
  FOR ALL  
  TO authenticated  
  USING (true)  
  WITH CHECK (true);  
```  
  
#### Table: `rate_limits` (Anti-Spam)  
  
```sql  
-- ============================================================  
-- RATE LIMITING TABLE  
-- Prevents form submission abuse  
-- ============================================================  
  
CREATE TABLE public.rate_limits (  
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,  
  ip_hash     TEXT NOT NULL,  
  endpoint    TEXT NOT NULL DEFAULT 'contact_form',  
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL  
);  
  
CREATE INDEX idx_rate_limits_lookup   
  ON public.rate_limits (ip_hash, endpoint, created_at DESC);  
  
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;  
  
-- Allow anon insert for tracking  
CREATE POLICY "Allow rate limit tracking"  
  ON public.rate_limits  
  FOR INSERT  
  TO anon  
  WITH CHECK (true);  
  
-- Cleanup function: delete entries older than 1 hour  
CREATE OR REPLACE FUNCTION cleanup_rate_limits()  
RETURNS void AS $$  
BEGIN  
  DELETE FROM public.rate_limits WHERE created_at < now() - INTERVAL '1 hour';  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER;  
```  
  
### 3. Supabase Edge Function: Email Notification  
  
```  
supabase/functions/send-inquiry-notification/index.ts  
```  
  
```typescript  
// ============================================================  
// EDGE FUNCTION: send-inquiry-notification  
// Triggered via Database Webhook on INSERT to inquiries table  
// Sends email notification to [alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)  
// ============================================================  
  
import { serve } from "[https://deno.land/std@0.168.0/http/server.ts](https://deno.land/std@0.168.0/http/server.ts)";  
  
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");  
const NOTIFICATION_EMAIL = "[alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)";  
  
interface InquiryPayload {  
  type: "INSERT";  
  table: "inquiries";  
  record: {  
    id: string;  
    name: string;  
    email: string;  
    phone: string | null;  
    travel_dates: string | null;  
    pickup_location: string | null;  
    message: string;  
    source_page: string;  
    created_at: string;  
  };  
}  
  
serve(async (req) => {  
  try {  
    const payload: InquiryPayload = await req.json();  
    const { record } = payload;  
  
    const emailHtml =   
      `<h2>New Inquiry from Clearway Car Hire Website</h2>`  
      `<table style="border-collapse:collapse;width:100%;max-width:600px;">`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.name}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.email}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.phone || "Not provided"}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Travel Dates</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.travel_dates || "Not provided"}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Pickup Location</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.pickup_location || "Not provided"}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.message}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Page</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${record.source_page}</td></tr>`  
        `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Time</td>`  
            `<td style="padding:8px;border:1px solid #ddd;">${new Date(record.created_at).toLocaleString("en-IE")}</td></tr>`  
      `</table>`  
      `<p style="margin-top:16px;">`  
        `<a href="mailto:${record.email}?subject=Re: Your Clearway Car Hire Inquiry">`  
          `Reply to ${record.name}`  
        `</a>`  
      `</p>`  
``    ;  
  
    const res = await fetch("[https://api.resend.com/emails](https://api.resend.com/emails)", {  
      method: "POST",  
      headers: {  
        "Content-Type": "application/json",  
        Authorization: `Bearer ${RESEND_API_KEY}`,  
      },  
      body: JSON.stringify({  
        from: "Clearway Car Hire <[notifications@clearwaycarhire.ie](mailto:notifications@clearwaycarhire.ie)>",  
        to: [NOTIFICATION_EMAIL],  
        subject: `New Inquiry from ${record.name}`,  
        html: emailHtml,  
      }),  
    });  
  
    const data = await res.json();  
    return new Response(JSON.stringify(data), {  
      headers: { "Content-Type": "application/json" },  
      status: res.ok ? 200 : 500,  
    });  
  } catch (error) {  
    return new Response(JSON.stringify({ error: error.message }), {  
      status: 500,  
      headers: { "Content-Type": "application/json" },  
    });  
  }  
});  
```  
  
### 4. Database Webhook Configuration  
  
```  
Webhook Name:     notify-new-inquiry  
Table:            inquiries  
Events:           INSERT  
HTTP Method:      POST  
URL:              https://<project-ref>.supabase.co/functions/v1/send-inquiry-notification  
Headers:  
  Authorization:  Bearer <SUPABASE_SERVICE_ROLE_KEY>  
  Content-Type:   application/json  
```  
  
### 5. Supabase Environment Variables (Edge Functions)  
  
```  
RESEND_API_KEY=re_xxxxxxxxxxxx  
```  
  
---  
  
## Cloudflare Pages Setup (Complete Configuration)  
  
### 1. Project Connection  
  
```  
Platform:           Cloudflare Pages  
Source:              GitHub repository (or direct upload)  
Production Branch:   main  
Build Command:       npm run build  
Build Output Dir:    dist  
Root Directory:      /  
```  
  
### 2. Environment Variables (Cloudflare Dashboard)  
  
```  
# ============================================================  
# CLOUDFLARE PAGES ENVIRONMENT VARIABLES  
# Set in: Settings → Environment Variables  
# ============================================================  
  
# Production  
VITE_SUPABASE_URL=https://<project-ref>.[supabase.co](http://supabase.co)  
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...  
VITE_SITE_URL=[https://clearwaycarhire.ie](https://clearwaycarhire.ie)  
VITE_GA_ID=                                        # Optional: Google Analytics  
VITE_CF_ANALYTICS_TOKEN=                           # Optional: Cloudflare Analytics  
  
# Preview (same values or staging Supabase project)  
VITE_SUPABASE_URL=https://<staging-ref>.[supabase.co](http://supabase.co)  
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...  
VITE_SITE_URL=[https://staging.clearwaycarhire.ie](https://staging.clearwaycarhire.ie)  
```  
  
### 3. `public/_redirects` (SPA Routing for Cloudflare Pages)  
  
```  
# ============================================================  
# CLOUDFLARE PAGES SPA REDIRECTS  
# Ensures all routes serve index.html (React Router handles routing)  
# ============================================================  
  
/*    /index.html   200  
```  
  
### 4. `public/_headers` (Security & Performance Headers)  
  
```  
# ============================================================  
# CLOUDFLARE PAGES CUSTOM HEADERS  
# Security, caching, and performance  
# ============================================================  
  
/*  
  X-Frame-Options: DENY  
  X-Content-Type-Options: nosniff  
  X-XSS-Protection: 1; mode=block  
  Referrer-Policy: strict-origin-when-cross-origin  
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()  
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' [https://static.cloudflareinsights.com](https://static.cloudflareinsights.com); style-src 'self' 'unsafe-inline' [https://fonts.googleapis.com](https://fonts.googleapis.com); font-src 'self' [https://fonts.gstatic.com](https://fonts.gstatic.com); img-src 'self' data: https:; connect-src 'self' [https://*.supabase.co](https://*.supabase.co); frame-ancestors 'none'  
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload  
  
/assets/*  
  Cache-Control: public, max-age=31536000, immutable  
  
/*.html  
  Cache-Control: public, max-age=0, must-revalidate  
  
/index.html  
  Cache-Control: public, max-age=0, must-revalidate  
```  
  
### 5. Custom Domain Setup (Cloudflare DNS)  
  
```  
# ============================================================  
# DNS RECORDS (Cloudflare Dashboard → DNS)  
# ============================================================  
  
Type    Name                Value                           Proxy  
CNAME   [clearwaycarhire.ie](http://clearwaycarhire.ie)  <project>.[pages.dev](http://pages.dev)            ☁ Proxied  
CNAME   www                 [clearwaycarhire.ie](http://clearwaycarhire.ie)             ☁ Proxied  
  
# Cloudflare Pages will auto-provision SSL certificate  
# Enable: SSL/TLS → Full (Strict)  
# Enable: Edge Certificates → Always Use HTTPS  
# Enable: Edge Certificates → Automatic HTTPS Rewrites  
  
# Email DNS Records (for [alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)):  
Type    Name    Value                    Priority  
MX      @       [mail provider MX]       10  
TXT     @       v=spf1 include:... ~all  
TXT     _dmarc  v=DMARC1; p=quarantine; ...  
```  
  
### 6. Cloudflare Page Rules & Settings  
  
```  
# Speed → Optimization  
Auto Minify:          HTML ✓  CSS ✓  JavaScript ✓  
Brotli:               ON  
Early Hints:          ON  
HTTP/3:               ON  
0-RTT:                ON  
  
# Caching  
Browser Cache TTL:    Respect Existing Headers  
Cache Level:          Standard  
  
# Security  
Security Level:       Medium  
Bot Fight Mode:       ON  
```  
  
---  
  
## React + Supabase Integration Layer  
  
### Supabase Client Setup  
  
```typescript  
// src/lib/supabase.ts  
// ============================================================  
// SUPABASE CLIENT  
// Configured for Cloudflare Pages environment variables  
// ============================================================  
  
import { createClient } from '@supabase/supabase-js';  
  
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;  
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;  
  
if (!supabaseUrl || !supabaseAnonKey) {  
  throw new Error(  
    'Missing Supabase environment variables. ' +  
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'  
  );  
}  
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {  
  auth: {  
    persistSession: false, // No user auth needed — public site  
    autoRefreshToken: false,  
  },  
});  
  
// ============================================================  
// TYPE DEFINITIONS  
// ============================================================  
  
export interface InquiryFormData {  
  name: string;  
  email: string;  
  phone?: string;  
  travel_dates?: string;  
  pickup_location?: string;  
  message: string;  
  source_page?: string;  
}  
  
export interface InquiryRecord extends InquiryFormData {  
  id: string;  
  created_at: string;  
  status: string;  
}  
```  
  
### Form Submission Service  
  
```typescript  
// src/services/inquiryService.ts  
// ============================================================  
// INQUIRY SUBMISSION SERVICE  
// Handles form validation, anti-spam, rate limiting, and submission  
// ============================================================  
  
import { supabase, InquiryFormData } from '../lib/supabase';  
  
interface SubmissionResult {  
  success: boolean;  
  message: string;  
  error?: string;  
}  
  
// Client-side validation  
function validateForm(data: InquiryFormData): string | null {  
  if (![data.name](http://data.name) || [data.name](http://data.name).trim().length < 2) {  
    return 'Please enter your name (at least 2 characters).';  
  }  
  if (![data.email](http://data.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test([data.email](http://data.email))) {  
    return 'Please enter a valid email address.';  
  }  
  if (!data.message || data.message.trim().length < 10) {  
    return 'Please enter a message (at least 10 characters).';  
  }  
  if ([data.name](http://data.name).length > 100 || data.message.length > 5000) {  
    return 'Input exceeds maximum length.';  
  }  
  return null;  
}  
  
// Sanitize text input  
function sanitize(input: string): string {  
  return input  
    .replace(/</g, '&lt;')  
    .replace(/>/g, '&gt;')  
    .replace(/"/g, '&quot;')  
    .trim();  
}  
  
export async function submitInquiry(  
  data: InquiryFormData,  
  honeypot: string = ''  
): Promise<SubmissionResult> {  
  // 1. Honeypot check (bot detection)  
  if (honeypot && honeypot.length > 0) {  
    // Silently succeed to not alert bots  
    return { success: true, message: 'Thank you! We\'ll be in touch within 24 hours.' };  
  }  
  
  // 2. Client-side validation  
  const validationError = validateForm(data);  
  if (validationError) {  
    return { success: false, message: validationError };  
  }  
  
  // 3. Timing check (bots submit too fast — reject if < 3 seconds)  
  // (submitted_at_ms is set when form renders, compared at submission)  
  
  // 4. Submit to Supabase  
  try {  
    const { error } = await supabase.from('inquiries').insert({  
      name: sanitize([data.name](http://data.name)),  
      email: [data.email](http://data.email).trim().toLowerCase(),  
      phone: [data.phone](http://data.phone) ? sanitize([data.phone](http://data.phone)) : null,  
      travel_dates: [data.travel](http://data.travel)_dates ? sanitize([data.travel](http://data.travel)_dates) : null,  
      pickup_location: data.pickup_location ? sanitize(data.pickup_location) : null,  
      message: sanitize(data.message),  
      source_page: data.source_page || 'contact',  
      status: 'new',  
      honeypot: null,  
      submitted_at_ms: [Date.now](http://Date.now)(),  
    });  
  
    if (error) {  
      console.error('Supabase insert error:', error);  
      return {  
        success: false,  
        message: 'Something went wrong. Please try emailing us directly at [alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)',  
        error: error.message,  
      };  
    }  
  
    return {  
      success: true,  
      message: 'Thank you! Your inquiry has been sent. We\'ll get back to you within 24 hours.',  
    };  
  } catch (err) {  
    console.error('Submission error:', err);  
    return {  
      success: false,  
      message: 'Connection error. Please try emailing us directly at [alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)',  
      error: String(err),  
    };  
  }  
}  
```  
  
### Environment Variable Type Safety  
  
```typescript  
// src/env.d.ts  
// ============================================================  
// VITE ENVIRONMENT VARIABLE TYPE DECLARATIONS  
// ============================================================  
  
/// <reference types="vite/client" />  
  
interface ImportMetaEnv {  
  readonly VITE_SUPABASE_URL: string;  
  readonly VITE_SUPABASE_ANON_KEY: string;  
  readonly VITE_SITE_URL: string;  
  readonly VITE_CF_ANALYTICS_TOKEN?: string;  
}  
  
interface ImportMeta {  
  readonly env: ImportMetaEnv;  
}  
```  
  
---  
  
## Design System (Complete Token Set)  
  
### Color Palette  
  
| Token | Hex | Usage |  
|---|---|---|  
| `primary` | `#16A34A` | CTAs, links, checkmarks, step circles |  
| `primary-dark` | `#15803D` | Hover states on green buttons |  
| `primary-light` | `#DCFCE7` | Light green backgrounds, badges |  
| `accent-bg` | `#F0FDF4` | Alternating section backgrounds |  
| `secondary` | `#000000` | Nav background, headings |  
| `secondary-dark` | `#1A1A1A` | Footer background |  
| `gold` | `#F59E0B` | "Recommended" badge |  
| `white` | `#FFFFFF` | Card backgrounds, hero text |  
| `gray-50` → `gray-900` | Tailwind defaults | Body text, borders, inputs |  
  
### Typography  
  
| Element | Classes | Weight |  
|---|---|---|  
| H1 | `text-4xl md:text-5xl lg:text-6xl tracking-tight` | `font-bold` (700) |  
| H2 | `text-3xl md:text-4xl` | `font-bold` (700) |  
| H3 | `text-xl md:text-2xl` | `font-semibold` (600) |  
| Body | `text-base leading-relaxed` | `font-normal` (400) |  
| Small | `text-sm` | `font-normal` (400) |  
| Font | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Google Fonts: 400, 500, 600, 700 |  
  
### Spacing & Layout  
  
| Token | Value |  
|---|---|  
| Container | `max-w-7xl mx-auto` |  
| Section padding | `py-16 md:py-24 px-4 md:px-6 lg:px-8` |  
| Card radius | `rounded-2xl` |  
| Button radius | `rounded-lg` |  
| Card shadow | `shadow-lg hover:shadow-xl transition-shadow duration-300` |  
| Emerald shadow | `shadow-2xl ring-2 ring-green-500 lg:scale-105` |  
| Bio paragraph spacing | `mb-4` |  
  
### Button Variants  
  
**Primary (Green):**  
```  
bg-green-600 hover:bg-green-700 text-white font-semibold  
py-3 px-8 rounded-lg transition-all duration-300  
focus:outline-none focus:ring-4 focus:ring-green-300  
```  
  
**Secondary (Outline):**  
```  
border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white  
font-semibold py-3 px-8 rounded-lg transition-all duration-300  
```  
  
**White Filled (dark backgrounds):**  
```  
bg-white text-green-600 hover:bg-gray-100 font-semibold  
py-3 px-8 rounded-lg transition-all duration-300  
```  
  
**White Outline (hero secondary):**  
```  
border-2 border-white text-white hover:bg-white hover:text-green-600  
font-semibold py-3 px-8 rounded-lg transition-all duration-300  
```  
  
### Icons  
All via **lucide-react** (already installed) or inline SVGs. Required:  
- Mail, Phone, Check, Search, MessageCircle, ShieldCheck  
- Numbered circles (1–5), Menu, X, ArrowRight  
  
---  
  
## SEO & Meta Tags (Per Page)  
  
Every page sets via React Helmet or `document.title` in `useEffect`:  
  
| Page | `<title>` | `<meta name="description">` |  
|---|---|---|  
| `/` | `Expert Car Hire Advice in Ireland — Clearway Car Hire` | `Independent car hire consultancy in Ireland. Get honest advice, clear pricing, and personal service.` |  
| `/how-it-works` | `How It Works — Clearway Car Hire` | `See how Clearway Car Hire helps you find the perfect rental in 5 simple steps.` |  
| `/services` | `Services & Fees — Clearway Car Hire` | `Choose from 3 service packages. From €14.99 per booking. No hidden extras.` |  
| `/about` | `About Us — Clearway Car Hire` | `Meet Alan — 20+ years car hire experience. Independent, honest advice for Ireland.` |  
| `/contact` | `Contact Us — Clearway Car Hire` | `Get in touch for a free, no-obligation car hire quote in Ireland.` |  
| `/terms` | `Terms & Conditions — Clearway Car Hire` | `Terms and conditions for using the Clearway Car Hire website.` |  
| `/privacy` | `Privacy Policy — Clearway Car Hire` | `How Clearway Car Hire collects, uses, and protects your personal information.` |  
  
All pages also include:  
```html  
<meta property="og:title" content="[title]">  
<meta property="og:description" content="[description]">  
<meta property="og:type" content="website">  
<meta property="og:url" content="[https://clearwaycarhire.ie/[path]](https://clearwaycarhire.ie/[path])">  
<link rel="icon" href="/favicon.ico">  
<link rel="canonical" href="[https://clearwaycarhire.ie/[path]](https://clearwaycarhire.ie/[path])">  
```  
  
---  
  
## Pages & Sections (Complete Specification)  
  
---  
  
### PAGE 1: Homepage `/`)  
  
#### Section 1.1 — Hero  
- Full-width, `min-h-[80vh]`, background image/gradient with `bg-black/50` overlay  
- Image `alt="Car driving through scenic Irish countryside"`  
- **H1:** `"Expert Car Hire Advice for Your Trip to Ireland"`  
- **Subtext:** `"We take the stress out of hiring a car in Ireland. Get honest, independent advice and find the right rental — with no hidden fees, no confusion, and no pressure. Just get in touch and we'll do the rest."`  
- **CTAs (side by side, stack on mobile):**  
  - `[✉ Email Us]` → `mailto:alan@clearwaycarhire.ie` (white filled)  
  - `[📞 Call Us]` → `tel:+353879769694` (white outline)  
  
#### Section 1.2 — Trust Strip  
- 3-column grid, `bg-gray-50`, `py-12`  
  
| Icon | Heading | Description |  
|---|---|---|  
| Search | `"Independent Advice"` | `"No ties to any one provider. We work for you."` |  
| MessageCircle | `"Real Person, Real Help"` | `"Talk to Alan directly — no bots, no call centres."` |  
| ShieldCheck | `"No Hidden Fees"` | `"Transparent pricing. You'll know exactly what you're paying."` |  
  
#### Section 1.3 — How It Works Preview  
- 3-card condensed version (Steps 1, 3, 5)  
- Link: `"See the full process →"` → `/how-it-works`  
  
#### Section 1.4 — Pricing Cards (Full 3-tier)  
- H2: `"Services & Fees"` + subtext `"Choose the level of service that's right for you."`  
- All 3 cards rendered with `<PricingCard />` — identical content to Services page  
- Emerald highlighted with badge + elevated styling  
  
#### Section 1.5 — About Preview  
- Two-column: photo placeholder left, text right  
- First 3 sentences of Alan's bio  
- Button: `"Read more about us →"` → `/about`  
  
#### Section 1.6 — CTA Banner  
- `<CTABanner />`  
  
---  
  
### PAGE 2: How It Works `/how-it-works`)  
  
#### Section 2.1 — Page Header  
- **H1:** `"How It Works"`  
- **Subtext:** `"From your first email to collecting your car — here's exactly what to expect."`  
  
#### Section 2.2 — 5-Step Timeline  
- Vertical timeline, numbered green circles, connecting line  
- Alternating left-right on desktop, single column on mobile  
  
**EXACT copy (verbatim):**  
  
**Step 1 — `"Get in touch"`:**`"Email me with your car hire requirements — dates, location, car type, and anything else that matters to you. No forms, no jargon, no pressure."`  
  
**Step 2 — `"I do the searching for you"`:**`"I compare options from trusted car hire providers across Ireland and find the best deal based on your needs — not just the cheapest price, but the right coverage, fuel policy, and terms."`  
  
**Step 3 — `"Clear, honest advice"`:**`"I explain exactly what's included in plain English:"`  
- `Insurance & excess`  
- `Deposits`  
- `Fuel policy`  
- `Mileage limits`  
- `Any potential extras or hidden costs`  
`"You'll know before you arrive what to expect at the rental desk."`  
  
**Step 4 — `"Ask me anything (seriously)"`:**`"Have a question? Unsure about insurance? Never hired a car before? You can contact me as often as you like — even for the simplest queries. You're dealing with a real person who's happy to help."`  
  
**Step 5 — `"Collect your car with confidence"`:**`"When you turn up to collect your hire car, there are no surprises. You know the deal, the terms, and exactly what you're getting — so you can get on the road without stress."`  
  
#### Section 2.3 — CTA Banner  
  
---  
  
### PAGE 3: Services & Fees `/services`)  
  
#### Section 3.1 — Page Header  
- **H1:** `"Services & Fees"`  
- **Subtext:** `"Choose the level of service that's right for you. All packages are charged per booking with no hidden extras."`  
  
#### Section 3.2 — 3-Tier Pricing Cards  
  
**CARD 1: The Atlantic**  
- Badge: None  
- Price: `€14.99` per booking  
- Description: `"Our entry-level service helps you find the best car hire options in Ireland quickly and without the hassle of searching multiple websites."`  
- Details: `"Simply tell us your travel dates and pickup location, and we will search trusted Irish rental providers to find suitable options for your trip. We'll send you a shortlist of reliable rental choices, helping you avoid hidden fees and poor-quality providers."`  
- Disclaimer: `"You complete the booking directly with the rental provider."`  
- CTA: `"Get Started"` → mailto (Secondary button)  
  
**CARD 2: The Celtic**  
- Badge: None  
- Price: `€24.99` per booking  
- Includes (green checkmarks):  
  - ✔ Everything in The Atlantic  
  - ✔ Comparison of multiple trusted rental providers  
  - ✔ Expert advice on vehicle type, insurance options, and rental conditions  
  - ✔ Help choosing the best value option for your trip  
- Description: `"Avoid costly mistakes and hidden charges with guidance from someone who understands the Irish car hire market."`  
- Disclaimer: `"You complete the booking directly with the rental provider."`  
- CTA: `"Get Started"` → mailto (Secondary button)  
  
**CARD 3: The Emerald ★ HIGHLIGHTED**  
- Badge: `"Recommended"` — `bg-amber-500 text-white text-sm font-bold px-4 py-1 rounded-full` positioned top-center  
- Card: `border-2 border-green-500 shadow-2xl lg:scale-105 relative`  
- Price: `€49` per booking  
- Description: `"A personalised service for customers who want expert assistance before and during their car hire in Ireland."`  
- **Includes:** (label `font-semibold mt-4`)  
  - ✔ Everything in The Celtic package  
  - ✔ We arrange your car hire booking for you  
  - ✔ Priority assistance when organising your rental  
  - ✔ Help sourcing premium or specialist vehicles  
- **Support during your rental:** (label `font-semibold mt-4`)  
  - ✔ Assistance with vehicle questions  
  - ✔ Help if any issues arise with your rental  
  - ✔ Support contacting the rental provider  
  - ✔ General guidance during your hire period  
- Value Add: `"Enjoy peace of mind knowing you have independent support throughout your rental in Ireland."` — `bg-green-50 p-4 rounded-lg text-green-800 font-medium mt-4`  
- Disclaimer: `"Bookings are completed directly with the selected rental provider."`  
- CTA: `"Get Started"` → mailto (**Primary button**)  
  
#### Section 3.3 — CTA Banner  
  
---  
  
### PAGE 4: About Us `/about`)  
  
#### Section 4.1 — Page Header  
- **H1:** `"About Us"`  
- **Subtext:** `"The people behind Clearway Car Hire."`  
  
#### Section 4.2 — Profile Section  
- Two-column: image left (40%), text right (60%). Stacks on mobile.  
- Image: `rounded-2xl`, gray placeholder, `alt="Alan, founder of Clearway Car Hire"`  
- **Full bio (verbatim, 7 paragraphs with `mb-4` spacing):**  
  
```  
"Hi, I'm Alan — and I believe booking a service shouldn't be complicated."  
  
"With over 20 years' experience in the car hire industry, I started this business to make things simpler, clearer, and more personal for customers."  
  
"Too often, people are left dealing with confusing options, hidden costs, or impersonal systems. My goal is to offer a straightforward, honest service where you deal with a real person who actually cares about getting it right."  
  
"With a strong focus on customer service, reliability, and clear communication, we work closely with trusted providers to find the best solution for each customer's needs."  
  
"Our experience allows us to spot issues before they arise and guide customers toward the right choice, whether you're booking well in advance or need help at short notice."  
  
"This business is built on trust, transparency, and word-of-mouth — and I treat every booking as if it were my own."  
  
"If you ever have a question, just ask. I'm always happy to help."  
```  
  
#### Section 4.3 — CTA Banner  
  
---  
  
### PAGE 5: Contact `/contact`)  
  
#### Section 5.1 — Page Header  
- **H1:** `"Get in Touch"`  
- **Subtext:** `"Have a question or ready to get a quote? Reach out — I'd love to help."`  
  
#### Section 5.2 — Contact Layout  
- Two-column: info left, form right. Stacks on mobile.  
  
**Left — Contact Cards:**  
  
| Icon | Heading | Link |  
|---|---|---|  
| Mail | `"Email Us"` | `alan@clearwaycarhire.ie` (mailto) |  
| Phone | `"Call Us"` | `00353 87 9769694` (tel:+353879769694) |  
  
**Right — Contact Form (Supabase-connected):**  
  
| Field | Type | Required | Placeholder |  
|---|---|---|---|  
| Name | text | ✅ | `"Your name"` |  
| Email | email | ✅ | `"Your email address"` |  
| Phone | tel | ❌ | `"Your phone number (optional)"` |  
| Travel Dates | text | ❌ | `"e.g. 1 July – 10 July 2025"` |  
| Pickup Location | text | ❌ | `"e.g. Dublin Airport"` |  
| Message | textarea (4 rows) | ✅ | `"Tell us about your car hire needs..."` |  
| *Honeypot* | hidden text | — | Hidden field, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"` |  
  
- **Submit:** `"Send Enquiry"` (Primary green, with loading spinner state)  
- **States:**  
  - Default → Button enabled  
  - Submitting → Button disabled, spinner, text `"Sending..."`  
  - Success → Green success message: `"Thank you! Your inquiry has been sent. We'll get back to you within 24 hours."`  
  - Error → Red error message with fallback: `"Something went wrong. Please try emailing us directly at alan@clearwaycarhire.ie"`  
- **Note below form:** `"We'll get back to you within 24 hours."` — `text-sm text-gray-500 mt-4`  
- **Fallback:** If Supabase is unreachable, the form degrades gracefully to a `mailto:` link action  
- **Form submits via:** `inquiryService.submitInquiry()` → Supabase `inquiries` table → Edge Function sends email notification to Alan  
  
---  
  
### PAGE 6: Terms & Conditions `/terms`)  
  
- `max-w-4xl mx-auto` prose layout  
- All headings and content **verbatim** from spec  
  
**Heading structure:**  
  
| Level | Text |  
|---|---|  
| H1 | Terms & Conditions |  
| Intro | `"Clearway Car Hire. These Terms & Conditions govern..."` |  
| H2 | About Our Service |  
| H2 | Booking Enquiries |  
| H2 | Rental Agreements |  
| H2 | Information Accuracy |  
| H2 | Liability |  
| — | Bullet list: Vehicle condition, Rental provider policies, Insurance coverage, Vehicle availability, Any disputes... |  
| H2 | Website Use |  
| H2 | Privacy |  
| H2 | Changes to Terms |  
| H2 | Contact Information |  
| H2 | Third-Party Service Disclaimer |  
| H2 | Availability and Pricing Disclaimer |  
| H2 | No Guarantee of Service |  
  
---  
  
### PAGE 7: Privacy Policy `/privacy`)  
  
- Same `max-w-4xl mx-auto` prose layout  
- All headings, bullets, and content **verbatim** from spec  
  
**Heading structure:**  
  
| Level | Text |  
|---|---|  
| H1 | Privacy Policy |  
| Intro | `"Clearway Car Hire respects your privacy..."` |  
| H2 | Information We Collect |  
| — | Bullet list: Your name, Email address, Phone number, Travel dates..., Any other info... |  
| H2 | How We Use Your Information |  
| — | Bullet list: Respond to enquiries, Help find options, Communicate, Improve |  
| H2 | Sharing Your Information |  
| H2 | Data Security |  
| H2 | Cookies |  
| H2 | Your Rights |  
| — | Bullet list: Request access, Request correction, Request deletion |  
| H2 | Contact Us |  
| — | Email + Phone (clickable links) |  
| H2 | Changes to This Policy |  
  
---  
  
## Shared Components  
  
| Component | Description |  
|---|---|  
| `<Header />` | Sticky nav, logo image, links, CTA buttons, mobile hamburger menu with slide panel, blur on scroll |  
| `<Footer />` | 3-column (logo+tagline, quick links, contact), bottom bar with © + legal links |  
| `<CTABanner />` | Green full-width banner, headline + subtext + 2 white CTA buttons |  
| `<PricingCard />` | Reusable card with `isHighlighted` prop for Emerald variant |  
| `<StepCard />` | Timeline step with number circle + heading + text |  
| `<TrustItem />` | Icon + heading + description for trust strip |  
| `<ContactCard />` | Email/phone info card |  
| `<ContactForm />` | Supabase-connected form with validation, honeypot, states |  
| `<ScrollToTop />` | Scrolls to top on route change |  
| `<SEO />` | Sets title, meta description, OG tags per page |  
| `<Button />` | Reusable with `variant` prop: primary, secondary, white, whiteOutline |  
  
---  
  
## File Structure (Complete)  
  
```  
clearway-car-hire/  
├── public/  
│   ├── _redirects                    # Cloudflare SPA routing  
│   ├── _headers                      # Cloudflare security headers  
│   ├── favicon.ico                   # Favicon  
│   ├── robots.txt                    # SEO robots  
│   ├── sitemap.xml                   # SEO sitemap  
│   └── og-image.jpg                  # Open Graph share image  
│  
├── supabase/  
│   ├── migrations/  
│   │   └── 001_create_inquiries.sql  # Database schema  
│   ├── functions/  
│   │   └── send-inquiry-notification/  
│   │       └── index.ts              # Email notification edge function  
│   └── config.toml                   # Supabase project config  
│  
├── src/  
│   ├── components/  
│   │   ├── Header.tsx  
│   │   ├── Footer.tsx  
│   │   ├── CTABanner.tsx  
│   │   ├── PricingCard.tsx  
│   │   ├── StepCard.tsx  
│   │   ├── TrustItem.tsx  
│   │   ├── ContactCard.tsx  
│   │   ├── ContactForm.tsx  
│   │   ├── ScrollToTop.tsx  
│   │   ├── SEO.tsx  
│   │   └── Button.tsx  
│   │  
│   ├── pages/  
│   │   ├── Home.tsx  
│   │   ├── HowItWorks.tsx  
│   │   ├── Services.tsx  
│   │   ├── About.tsx  
│   │   ├── Contact.tsx  
│   │   ├── Terms.tsx  
│   │   └── Privacy.tsx  
│   │  
│   ├── lib/  
│   │   └── supabase.ts               # Supabase client + types  
│   │  
│   ├── services/  
│   │   └── inquiryService.ts          # Form submission logic  
│   │  
│   ├── hooks/  
│   │   ├── useScrollPosition.ts       # Sticky nav scroll detection  
│   │   └── useFormSubmission.ts       # Form state management hook  
│   │  
│   ├── App.tsx                        # React Router + layout  
│   ├── main.tsx                       # Entry point  
│   ├── index.css                      # Tailwind directives + Inter import  
│   └── env.d.ts                       # Vite env type declarations  
│  
├── .env.local                         # Local env vars (gitignored)  
├── .env.example                       # Template for env vars  
├── .gitignore  
├── index.html                         # Vite HTML entry + CF Analytics  
├── package.json  
├── tailwind.config.ts                 # Extended color palette  
├── tsconfig.json  
├── vite.config.ts                     # Vite build config  
└── wrangler.toml                      # Optional: Cloudflare Workers config  
```  
  
---  
  
## Additional Config Files  
  
### `public/robots.txt`  
  
```  
User-agent: *  
Allow: /  
Disallow: /api/  
  
Sitemap: [https://clearwaycarhire.ie/sitemap.xml](https://clearwaycarhire.ie/sitemap.xml)  
```  
  
### `public/sitemap.xml`  
  
```xml  
<?xml version="1.0" encoding="UTF-8"?>  
<urlset xmlns="[http://www.sitemaps.org/schemas/sitemap/0.9](http://www.sitemaps.org/schemas/sitemap/0.9)">  
  <url><loc>[https://clearwaycarhire.ie/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>](https://clearwaycarhire.ie/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/how-it-works</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>](https://clearwaycarhire.ie/how-it-works</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/services</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>](https://clearwaycarhire.ie/services</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/about</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>](https://clearwaycarhire.ie/about</loc><priority>0.7</priority><changefreq>monthly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/contact</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>](https://clearwaycarhire.ie/contact</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/terms</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>](https://clearwaycarhire.ie/terms</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>)  
  <url><loc>[https://clearwaycarhire.ie/privacy</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>](https://clearwaycarhire.ie/privacy</loc><priority>0.3</priority><changefreq>yearly</changefreq></url>)  
</urlset>  
```  
  
### `.env.example`  
  
```bash  
# ============================================================  
# ENVIRONMENT VARIABLES  
# Copy to .env.local for local development  
# Set in Cloudflare Pages dashboard for production  
# ============================================================  
  
VITE_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)  
VITE_SUPABASE_ANON_KEY=your-anon-key-here  
VITE_SITE_URL=[https://clearwaycarhire.ie](https://clearwaycarhire.ie)  
```  
  
### Cloudflare Web Analytics (in `index.html`)  
  
```html  
<!-- Cloudflare Web Analytics — added before </body> -->  
<script  
  defer  
  src="[https://static.cloudflareinsights.com/beacon.min.js](https://static.cloudflareinsights.com/beacon.min.js)"  
  data-cf-beacon='{"token": "YOUR_CF_ANALYTICS_TOKEN"}'  
></script>  
```  
  
---  
  
## Deployment Checklist  
  
### Pre-Deployment  
  
```  
□ All environment variables set in Cloudflare Pages dashboard  
□ Supabase project created in EU West region  
□ Database migrations run (inquiries table + RLS policies)  
□ Edge function deployed (send-inquiry-notification)  
□ Database webhook configured (INSERT on inquiries → edge function)  
□ Resend API key set in Supabase Edge Function secrets  
□ DNS records configured (CNAME for domain + www)  
□ SSL/TLS set to Full (Strict)  
□ Always Use HTTPS enabled  
□ _redirects file present in public/ for SPA routing  
□ _headers file present with security headers  
□ robots.txt and sitemap.xml in public/  
□ Favicon uploaded  
□ OG image uploaded  
□ .env.example committed (not .env.local)  
```  
  
### Post-Deployment Verification  
  
```  
□ All 7 pages load correctly via direct URL and navigation  
□ Contact form submits to Supabase (check table in dashboard)  
□ Email notification received at [alan@clearwaycarhire.ie](mailto:alan@clearwaycarhire.ie)  
□ Form validation works (required fields, email format)  
□ Honeypot field hidden and functional  
□ Error state shows fallback mailto link  
□ Success state shows confirmation message  
□ All mailto: links work  
□ All tel: links work  
□ Mobile hamburger menu opens/closes  
□ Sticky nav blurs on scroll  
□ Pricing cards render correctly (Emerald highlighted)  
□ All copy matches spec verbatim  
□ No horizontal scroll on any viewport  
□ Security headers present (check [securityheaders.com](http://securityheaders.com))  
□ SSL certificate active  
□ www redirects to apex (or vice versa)  
□ Lighthouse score: Performance 90+, Accessibility 95+, SEO 95+  
□ Page loads in < 2 seconds (Cloudflare CDN)  
□ Form works on mobile Safari, Chrome, Firefox  
□ Print view works for Terms & Privacy pages  
```  
  
---  
  
## Migration Path (Lovable → Cloudflare + Supabase)  
  
```  
STEP 1:  Export/clone repository from Lovable  
STEP 2:  Add Supabase client library: npm install @supabase/supabase-js  
STEP 3:  Add src/lib/supabase.ts + src/services/inquiryService.ts  
STEP 4:  Add src/env.d.ts for type safety  
STEP 5:  Update ContactForm.tsx to use inquiryService instead of mailto  
STEP 6:  Add public/_redirects and public/_headers  
STEP 7:  Add public/robots.txt and public/sitemap.xml  
STEP 8:  Add .env.example and .env.local  
STEP 9:  Create Supabase project → run migrations → deploy edge function  
STEP 10: Connect GitHub repo to Cloudflare Pages  
STEP 11: Set environment variables in Cloudflare dashboard  
STEP 12: Configure custom domain DNS  
STEP 13: Deploy and verify (use post-deployment checklist above)  
```  
  
---  
  
## Technical Requirements Checklist  
  
| # | Requirement | Status |  
|---|---|---|  
| 1 | React + React Router | Required |  
| 2 | Tailwind CSS | Required |  
| 3 | Google Fonts: Inter (400–700) | Required |  
| 4 | Responsive: 375px, 768px, 1440px+ | Required |  
| 5 | Mobile hamburger menu | Required |  
| 6 | Sticky nav with backdrop-blur | Required |  
| 7 | `scroll-behavior: smooth` | Required |  
| 8 | All `mailto:` → `alan@clearwaycarhire.ie` | Required |  
| 9 | All `tel:` → `+353879769694` | Required |  
| 10 | External links: `target="_blank" rel="noopener noreferrer"` | Required |  
| 11 | `alt` text on every `<img>` | Required |  
| 12 | `aria-label` on icon-only buttons | Required |  
| 13 | Focus-visible styles | Required |  
| 14 | Hover transitions `duration-300` | Required |  
| 15 | `<ScrollToTop />` on route change | Required |  
| 16 | Meta viewport | Required |  
| 17 | Page `<title>` per route | Required |  
| 18 | Meta descriptions per page | Required |  
| 19 | OG tags per page | Required |  
| 20 | Favicon | Required |  
| 21 | No horizontal scroll | Required |  
| 22 | `prefers-reduced-motion` respected | Required |  
| 23 | Print styles for legal pages | Nice-to-have |  
| 24 | Semantic HTML5 elements | Required |  
| 25 | Supabase form submission with validation | Required |  
| 26 | Honeypot anti-spam | Required |  
| 27 | Form error/success states with fallback | Required |  
| 28 | Email notification via Edge Function | Required |  
| 29 | Cloudflare security headers | Required |  
| 30 | SPA redirects via `_redirects` | Required |  
| 31 | `robots.txt` + `sitemap.xml` | Required |  
| 32 | Environment variable isolation | Required |  
| 33 | RLS policies on Supabase tables | Required |  
| 34 | CSP headers configured | Required |  
| 35 | Cloudflare Web Analytics | Nice-to-have |  
  
---  
  
## Negative Constraints (DO NOT)  
  
| # | Constraint |  
|---|---|  
| 1 | Do NOT use external icon CDNs — use lucide-react or inline SVGs |  
| 2 | Do NOT use stock photo URLs that will 404 — use gradients/placeholders |  
| 3 | Do NOT add cookie consent banners |  
| 4 | Do NOT add blog, testimonials, FAQ, or unspecified sections |  
| 5 | Do NOT change any provided copy text |  
| 6 | Do NOT use lorem ipsum |  
| 7 | Do NOT omit pricing card disclaimers |  
| 8 | Do NOT highlight Atlantic or Celtic — only Emerald |  
| 9 | Do NOT leave TODO/FIXME comments |  
| 10 | Do NOT omit the "within 24 hours" note |  
| 11 | Do NOT expose Supabase service_role key in client code |  
| 12 | Do NOT store .env.local in git |  
| 13 | Do NOT skip RLS policies |  
| 14 | Do NOT use Supabase Auth for public visitors — anon key only |  
| 15 | Do NOT make the contact form the only way to reach Alan — always show mailto/tel fallbacks |  
  
---  
