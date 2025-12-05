import { cn } from "../../utils/cn";

export default function Card({
  title,
  value,
  subtitle,
  icon,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-2xl p-6 relative",
        className
      )}
    >
     
      {icon && (
        <div className="absolute top-4 right-4 text-gray-500">
          {icon}
        </div>
      )}

      {title && (
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          {title}
        </h3>
      )}

     
      {value && (
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {value}
        </div>
      )}

     
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}

      
      {children}
    </div>
  );
}
