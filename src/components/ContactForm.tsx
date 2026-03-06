import { useState, useRef } from "react";
import { Mail } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  travel_dates: string;
  pickup_location: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    travel_dates: "",
    pickup_location: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formLoadTime = useRef(Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      setStatus("success");
      return;
    }

    // Timing check (< 3 seconds = bot)
    if (Date.now() - formLoadTime.current < 3000) {
      setStatus("success");
      return;
    }

    // Client validation
    if (!form.name.trim() || form.name.trim().length < 2) {
      setErrorMsg("Please enter your name (at least 2 characters).");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setErrorMsg("Please enter a message (at least 10 characters).");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // mailto fallback — builds a pre-filled email
    const subject = encodeURIComponent("Car Hire Inquiry from " + form.name.trim());
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim() || "Not provided"}\nTravel Dates: ${form.travel_dates.trim() || "Not provided"}\nPickup Location: ${form.pickup_location.trim() || "Not provided"}\n\nMessage:\n${form.message.trim()}`
    );

    window.location.href = `mailto:alan@clearwaycarhire.ie?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus("success");
    }, 500);
  };

  if (status === "success") {
    return (
      <div className="bg-accent p-8 rounded-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
          <Mail className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your inquiry has been sent. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={255}
          placeholder="Your email address"
          value={form.email}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          maxLength={20}
          placeholder="Your phone number (optional)"
          value={form.phone}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Travel Dates */}
      <div>
        <label htmlFor="travel_dates" className="block text-sm font-medium text-foreground mb-1">
          Travel Dates
        </label>
        <input
          type="text"
          id="travel_dates"
          name="travel_dates"
          maxLength={200}
          placeholder="e.g. 1 July – 10 July 2025"
          value={form.travel_dates}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Pickup Location */}
      <div>
        <label htmlFor="pickup_location" className="block text-sm font-medium text-foreground mb-1">
          Pickup Location
        </label>
        <input
          type="text"
          id="pickup_location"
          name="pickup_location"
          maxLength={200}
          placeholder="e.g. Dublin Airport"
          value={form.pickup_location}
          onChange={handleChange}
          className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={5000}
          placeholder="Tell us about your car hire needs..."
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px]"
        />
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
          {errorMsg || "Something went wrong. Please try emailing us directly at alan@clearwaycarhire.ie"}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          "Send Enquiry"
        )}
      </button>

      <p className="text-sm text-muted-foreground mt-4">
        We'll get back to you within 24 hours.
      </p>
    </form>
  );
};

export default ContactForm;
