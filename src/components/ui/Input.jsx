import { cn } from "../../utils/cn";

const variants = {
  primary: "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
  secondary: "border-gray-200 focus:border-gray-400 focus:ring-gray-200",
  error: "border-red-500 focus:border-red-500 focus:ring-red-200",
  disabled: "bg-gray-100 border-gray-200 cursor-not-allowed",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-lg",
};

export default function Input({
  label,
  helperText,
  type = "text",
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  placeholder = '',
  error = false,
  disabled = false,
  ...props
}) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-3">{leftIcon}</span>}
        <input
          className={cn(
            "w-full transition-colors duration-200 border focus:ring-2 focus:outline-none",
            sizes[size],
            error ? variants.error : variants[variant],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            disabled && "cursor-not-allowed bg-gray-100"
          )}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        {rightIcon && <span className="absolute right-3">{rightIcon}</span>}
      </div>
      {helperText && (
        <span className={cn("mt-1 text-sm", error ? "text-red-500" : "text-gray-500")}>
          {helperText}
        </span>
      )}
    </div>
  );
}
