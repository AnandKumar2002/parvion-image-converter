import { DynamicIcon } from "../layout/DynamicIcon";

export default function PageHeader({
  title,
  description,
  icon,
  color,
  bg,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-row items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
        <DynamicIcon icon={icon} className={`w-6 h-6 sm:w-7 sm:h-7 ${color}`} />
      </div>
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-1 sm:mb-2">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground font-light max-w-2xl">{description}</p>
      </div>
    </div>
  );
}
