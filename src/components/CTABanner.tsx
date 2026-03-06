import { Mail, Phone } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready to Find Your Perfect Car Hire?
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Get in touch today for a free, no-obligation quote.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:alan@clearwaycarhire.ie"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/30"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </a>
          <a
            href="tel:+353879769694"
            className="inline-flex items-center gap-2 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold py-3 px-8 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/30"
          >
            <Phone className="w-5 h-5" />
            Call Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
