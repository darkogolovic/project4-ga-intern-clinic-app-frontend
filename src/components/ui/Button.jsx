import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",

  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",

  subtle:
    "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200",

  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50",

  ghost:
    "text-gray-700 hover:bg-gray-100",

  danger:"bg-red-600 text-white hover:bg-red-700",
  dark: "bg-[#020213] hover:bg-black text-white"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  full = false,
  ...props
}) {
  return (
    <button
      className={cn(
        "transition font-medium focus:ring-2 focus:ring-blue-300",
        variants[variant],
        sizes[size],
        full && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
