import { type LucideIcon } from "lucide-react";

interface TrustItemProps {
  icon: LucideIcon;
  heading: string;
  description: string;
}

const TrustItem = ({ icon: Icon, heading, description }: TrustItemProps) => {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{heading}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default TrustItem;
