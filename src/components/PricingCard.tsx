import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  perBooking?: string;
  badge?: string;
  isHighlighted?: boolean;
  description?: string;
  details?: string;
  includes?: string[];
  includesLabel?: string;
  supportItems?: string[];
  supportLabel?: string;
  valueAdd?: string;
  disclaimer: string;
}

const PricingCard = ({
  name,
  price,
  perBooking = "per booking",
  badge,
  isHighlighted = false,
  description,
  details,
  includes,
  includesLabel,
  supportItems,
  supportLabel,
  valueAdd,
  disclaimer,
}: PricingCardProps) => {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-8 transition-shadow duration-300 ${
        isHighlighted
          ? "border-2 border-primary shadow-2xl lg:scale-105 bg-card"
          : "border border-border shadow-lg hover:shadow-xl bg-card"
      }`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gold text-primary-foreground text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
            {badge}
          </span>
        </div>
      )}

      {/* Name */}
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{name}</h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground ml-2">{perBooking}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-base text-muted-foreground leading-relaxed mb-4">{description}</p>
      )}

      {/* Details */}
      {details && (
        <p className="text-base text-muted-foreground leading-relaxed mb-4">{details}</p>
      )}

      {/* Includes */}
      {includes && includes.length > 0 && (
        <div className="mb-4">
          {includesLabel && (
            <p className="font-semibold text-foreground mt-4 mb-2">{includesLabel}</p>
          )}
          <ul className="space-y-2">
            {includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Support Items */}
      {supportItems && supportItems.length > 0 && (
        <div className="mb-4">
          {supportLabel && (
            <p className="font-semibold text-foreground mt-4 mb-2">{supportLabel}</p>
          )}
          <ul className="space-y-2">
            {supportItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Value Add */}
      {valueAdd && (
        <div className="bg-accent p-4 rounded-lg mt-4">
          <p className="text-primary-dark font-medium text-sm">{valueAdd}</p>
        </div>
      )}

      {/* Spacer to push disclaimer + CTA to bottom */}
      <div className="flex-1" />

      {/* Disclaimer */}
      <p className="text-sm italic text-muted-foreground mt-4">{disclaimer}</p>

      {/* CTA */}
      <a
        href="mailto:alan@clearwaycarhire.ie"
        className={`mt-6 inline-flex items-center justify-center font-semibold py-3 px-8 rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 ${
          isHighlighted
            ? "bg-primary hover:bg-primary-dark text-primary-foreground"
            : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        Get Started
      </a>
    </div>
  );
};

export default PricingCard;
