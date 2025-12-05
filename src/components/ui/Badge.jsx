import { cn } from "../../utils/cn";

const variants = {
  stable: "bg-green-50 text-green-700 border-green-200",
  monitoring: "bg-blue-50 text-blue-700 border-blue-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Badge({
  children,
  variant = "neutral",
  className,
}) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium border rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
