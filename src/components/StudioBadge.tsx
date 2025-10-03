interface StudioBadgeProps {
  size?: "sm" | "md" | "lg";
}

export default function StudioBadge({ size = "md" }: StudioBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div
      className={`inline-flex items-center justify-center bg-[#00DD89] text-black font-normal rounded-full ${sizeClasses[size]}`}
    >
      /Studio
    </div>
  );
}

