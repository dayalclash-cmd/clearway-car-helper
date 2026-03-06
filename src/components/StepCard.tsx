interface StepCardProps {
  number: number;
  heading: string;
  description: string;
  subList?: string[];
  continuation?: string;
}

const StepCard = ({ number, heading, description, subList, continuation }: StepCardProps) => {
  return (
    <div className="flex gap-6">
      {/* Number Circle + Line */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
          {number}
        </div>
        <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
      </div>

      {/* Content */}
      <div className="pb-12">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">{heading}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
        {subList && subList.length > 0 && (
          <ul className="mt-3 space-y-1.5 pl-1">
            {subList.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
        {continuation && (
          <p className="text-base text-muted-foreground leading-relaxed mt-3">{continuation}</p>
        )}
      </div>
    </div>
  );
};

export default StepCard;
