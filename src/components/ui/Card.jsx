import { cn } from "../../utils/cn";

export default function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-2xl p-6 relative shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
