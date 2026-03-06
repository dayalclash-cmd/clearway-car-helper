import { Link } from "react-router-dom";
import { Mail, Phone, Search, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import TrustItem from "@/components/TrustItem";
import PricingCard from "@/components/PricingCard";
import CTABanner from "@/components/CTABanner";

const Home = () => {
  return (
    <>
      <SEO
        title="Expert Car Hire Advice in Ireland — Clearway Car Hire"
        description="Independent car hire consultancy in Ireland. Get honest advice, clear pricing, and personal service."
        path="/"
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-20" role="img" aria-label="Car driving through scenic Irish countryside" />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center pt-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground mb-6">
            Expert Car Hire Advice for Your Trip to Ireland
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8">
            We take the stress out of hiring a car in Ireland. Get honest, independent advice and find the right rental — with no hidden fees, no confusion, and no pressure. Just get in touch and we'll do the rest.
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

      {/* Trust Strip */}
      <section className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustItem
              icon={Search}
              heading="Independent Advice"
              description="No ties to any one provider. We work for you."
            />
            <TrustItem
              icon={MessageCircle}
              heading="Real Person, Real Help"
              description="Talk to Alan directly — no bots, no call centres."
            />
            <TrustItem
              icon={ShieldCheck}
              heading="No Hidden Fees"
              description="Transparent pricing. You'll know exactly what you're paying."
            />
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A simple process from start to finish.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              { num: 1, title: "Get in touch", desc: "Email me with your car hire requirements — dates, location, car type, and anything else that matters to you." },
              { num: 3, title: "Clear, honest advice", desc: "I explain exactly what's included in plain English — insurance, deposits, fuel policy, mileage, and any extras." },
              { num: 5, title: "Collect your car with confidence", desc: "No surprises at the rental desk. You know the deal, the terms, and exactly what you're getting." },
            ].map((step) => (
              <div key={step.num} className="text-center p-6 rounded-2xl bg-muted">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-300"
            >
              See the full process <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Services & Fees</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the level of service that's right for you.
            </p>
          </div>
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

      {/* About Preview */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-muted rounded-2xl aspect-square md:aspect-[4/5] flex items-center justify-center">
              <span className="text-muted-foreground text-lg">Alan's Photo</span>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Us</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Hi, I'm Alan — and I believe booking a service shouldn't be complicated.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                With over 20 years' experience in the car hire industry, I started this business to make things simpler, clearer, and more personal for customers.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Too often, people are left dealing with confusing options, hidden costs, or impersonal systems. My goal is to offer a straightforward, honest service where you deal with a real person who actually cares about getting it right.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-300"
              >
                Read more about us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
};

export default Home;
