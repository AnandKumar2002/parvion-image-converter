import * as React from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps extends LucideIcons.LucideProps {
  icon: string;
}

export function DynamicIcon({ icon, ...props }: DynamicIconProps) {
  // Convert "lucide:arrow-left-right" to "ArrowLeftRight"
  const iconName = icon
    .replace("lucide:", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback {...props} />;
  }

  return <IconComponent {...props} />;
}
