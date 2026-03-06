import SEO from "@/components/SEO";
import StepCard from "@/components/StepCard";
import CTABanner from "@/components/CTABanner";

const HowItWorks = () => {
  return (
    <>
      <SEO
        title="How It Works — Clearway Car Hire"
        description="See how Clearway Car Hire helps you find the perfect rental in 5 simple steps."
        path="/how-it-works"
      />

      {/* Page Header */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From your first email to collecting your car — here's exactly what to expect.
          </p>
        </div>
      </section>

      {/* 5-Step Timeline */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <StepCard
            number={1}
            heading="Get in touch"
            description="Email me with your car hire requirements — dates, location, car type, and anything else that matters to you. No forms, no jargon, no pressure."
          />
          <StepCard
            number={2}
            heading="I do the searching for you"
            description="I compare options from trusted car hire providers across Ireland and find the best deal based on your needs — not just the cheapest price, but the right coverage, fuel policy, and terms."
          />
          <StepCard
            number={3}
            heading="Clear, honest advice"
            description="I explain exactly what's included in plain English:"
            subList={[
              "Insurance & excess",
              "Deposits",
              "Fuel policy",
              "Mileage limits",
              "Any potential extras or hidden costs",
            ]}
            continuation="You'll know before you arrive what to expect at the rental desk."
          />
          <StepCard
            number={4}
            heading="Ask me anything (seriously)"
            description="Have a question? Unsure about insurance? Never hired a car before? You can contact me as often as you like — even for the simplest queries. You're dealing with a real person who's happy to help."
          />
          <StepCard
            number={5}
            heading="Collect your car with confidence"
            description="When you turn up to collect your hire car, there are no surprises. You know the deal, the terms, and exactly what you're getting — so you can get on the road without stress."
          />
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default HowItWorks;
