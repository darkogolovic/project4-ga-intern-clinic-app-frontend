export default function CardContent({ className = "", children }) {
  return (
    <div className={`mt-4 flex flex-col gap-3 ${className}`}>
      {children}
    </div>
  );
}
