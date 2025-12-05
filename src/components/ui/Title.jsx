import { cn } from "../../utils/cn";

const variants = {
  h1: "text-4xl font-bold text-gray-900",
  h2: "text-3xl font-semibold text-gray-800",
  h3: "text-2xl font-medium text-gray-700",
};

export default function Title({ children, variant = "h1", className, ...props }) {
  const Tag = variant; 
  return (
    <Tag className={cn(variants[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
