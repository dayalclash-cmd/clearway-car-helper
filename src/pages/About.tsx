import SEO from "@/components/SEO";
import CTABanner from "@/components/CTABanner";

const About = () => {
  return (
    <>
      <SEO
        title="About Us — Clearway Car Hire"
        description="Meet Alan — 20+ years car hire experience. Independent, honest advice for Ireland."
        path="/about"
      />

      {/* Page Header */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/clew-bay.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-secondary/70" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-4">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            The people behind Clearway Car Hire.
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
            {/* Photo */}
            <div className="md:col-span-2">
              <img
                src="/images/leenane-road.jpg"
                alt="Scenic road to Leenane, County Galway, Ireland"
                className="rounded-2xl aspect-square object-cover w-full"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-3">
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Hi, I'm Alan — and I believe booking a service shouldn't be complicated.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                With over 20 years' experience in the car hire industry, I started this business to make things simpler, clearer, and more personal for customers.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Too often, people are left dealing with confusing options, hidden costs, or impersonal systems. My goal is to offer a straightforward, honest service where you deal with a real person who actually cares about getting it right.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                With a strong focus on customer service, reliability, and clear communication, we work closely with trusted providers to find the best solution for each customer's needs.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Our experience allows us to spot issues before they arise and guide customers toward the right choice, whether you're booking well in advance or need help at short notice.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                This business is built on trust, transparency, and word-of-mouth — and I treat every booking as if it were my own.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                If you ever have a question, just ask. I'm always happy to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
};

export default About;
