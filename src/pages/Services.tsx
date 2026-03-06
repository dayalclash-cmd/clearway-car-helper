import SEO from "@/components/SEO";
import PricingCard from "@/components/PricingCard";
import CTABanner from "@/components/CTABanner";

const Services = () => {
  return (
    <>
      <SEO
        title="Services & Fees — Clearway Car Hire"
        description="Choose from 3 service packages. From €14.99 per booking. No hidden extras."
        path="/services"
      />

      {/* Page Header */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            Services & Fees
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the level of service that's right for you. All packages are charged per booking with no hidden extras.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <PricingCard
              name="The Atlantic"
              price="€14.99"
              description="Our entry-level service helps you find the best car hire options in Ireland quickly and without the hassle of searching multiple websites."
              details="Simply tell us your travel dates and pickup location, and we will search trusted Irish rental providers to find suitable options for your trip. We'll send you a shortlist of reliable rental choices, helping you avoid hidden fees and poor-quality providers."
              disclaimer="You complete the booking directly with the rental provider."
            />
            <PricingCard
              name="The Celtic"
              price="€24.99"
              includes={[
                "Everything in The Atlantic",
                "Comparison of multiple trusted rental providers",
                "Expert advice on vehicle type, insurance options, and rental conditions",
                "Help choosing the best value option for your trip",
              ]}
              description="Avoid costly mistakes and hidden charges with guidance from someone who understands the Irish car hire market."
              disclaimer="You complete the booking directly with the rental provider."
            />
            <PricingCard
              name="The Emerald"
              price="€49"
              badge="Recommended"
              isHighlighted
              description="A personalised service for customers who want expert assistance before and during their car hire in Ireland."
              includesLabel="Includes:"
              includes={[
                "Everything in The Celtic package",
                "We arrange your car hire booking for you",
                "Priority assistance when organising your rental",
                "Help sourcing premium or specialist vehicles",
              ]}
              supportLabel="Support during your rental:"
              supportItems={[
                "Assistance with vehicle questions",
                "Help if any issues arise with your rental",
                "Support contacting the rental provider",
                "General guidance during your hire period",
              ]}
              valueAdd="Enjoy peace of mind knowing you have independent support throughout your rental in Ireland."
              disclaimer="Bookings are completed directly with the selected rental provider."
            />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default Services;
