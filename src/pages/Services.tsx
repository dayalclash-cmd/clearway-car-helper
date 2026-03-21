import SEO from "@/components/SEO";
import PricingCard from "@/components/PricingCard";
import CTABanner from "@/components/CTABanner";
import { useSiteData } from "@/context/SiteDataContext";

const Services = () => {
  const { packages } = useSiteData();

  return (
    <>
      <SEO
        title="Services & Fees — Clearway Car Hire"
        description="Choose from 3 service packages. From €14.99 per booking. No hidden extras."
        path="/services"
      />

      {/* Page Header */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/achill-beach.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            Services & Fees
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Choose the level of service that's right for you. All packages are charged per booking with no hidden extras.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <PricingCard
                key={pkg.id}
                name={pkg.name}
                price={pkg.price}
                perBooking={pkg.perBooking}
                badge={pkg.badge}
                isHighlighted={pkg.isHighlighted}
                description={pkg.description}
                details={pkg.details}
                includes={pkg.includes}
                includesLabel={pkg.includesLabel}
                supportItems={pkg.supportItems}
                supportLabel={pkg.supportLabel}
                valueAdd={pkg.valueAdd}
                disclaimer={pkg.disclaimer}
              />
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default Services;
