import { Mail, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <>
      <SEO
        title="Contact Us — Clearway Car Hire"
        description="Get in touch for a free, no-obligation car hire quote in Ireland."
        path="/contact"
      />

      {/* Page Header */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/gurteen-beach.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Have a question or ready to get a quote? Reach out — I'd love to help.
          </p>
        </div>
      </section>

      {/* Contact Layout */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left — Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Contact Details</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                You can reach us directly by email or phone. We're always happy to help.
              </p>

              <div className="space-y-4">
                {/* Email Card */}
                <a
                  href="mailto:alan@clearwaycarhire.ie"
                  className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-light shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground">alan@clearwaycarhire.ie</p>
                  </div>
                </a>

                {/* Phone Card */}
                <a
                  href="tel:+353892559729"
                  className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-light shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Call Us</h3>
                    <p className="text-muted-foreground">00353 89 2559729</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right — Form */}
            <div className="relative">
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Send an Enquiry</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
