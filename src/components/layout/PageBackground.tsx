import { cn } from "@/lib/utils";

interface PageBackgroundProps {
  children: React.ReactNode;
  variant?: "default" | "white" | "dark" | "custom";
  customColor?: string;
  className?: string;
}

const backgroundVariants = {
  default: "", // 전역 배경색 사용 (var(--background))
  white: "bg-white",
  dark: "bg-gray-900",
  custom: "", // customColor 사용
};

export default function PageBackground({ 
  children, 
  variant = "default", 
  customColor,
  className 
}: PageBackgroundProps) {
  const baseClasses = "min-h-screen";
  
  let backgroundClass = "";
  let style = {};
  
  if (variant === "custom" && customColor) {
    style = { backgroundColor: customColor };
  } else {
    backgroundClass = backgroundVariants[variant];
  }

  return (
    <div 
      className={cn(baseClasses, backgroundClass, className)}
      style={style}
    >
      {children}
    </div>
  );
}
