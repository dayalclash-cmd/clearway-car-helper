import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const Footer = () => {
  const { siteSettings } = useSiteData();

  return (
    <footer className="bg-secondary-dark text-gray-300 no-print">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <img
              src="/logo.png"
              alt="Clearway Car Hire logo"
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed text-gray-500">
              {siteSettings.tagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/services", label: "Services & Fees" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-primary-foreground font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors duration-300"
              >
                <Mail className="w-4 h-4 text-primary" />
                {siteSettings.email}
              </a>
              <a
                href={`tel:${siteSettings.phone}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors duration-300"
              >
                <Phone className="w-4 h-4 text-primary" />
                {siteSettings.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteSettings.businessName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-primary transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/admin/login"
              className="text-sm text-gray-500 hover:text-primary transition-colors duration-300"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
