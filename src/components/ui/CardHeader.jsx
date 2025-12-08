export default function CardHeader({ title, value, subtitle, icon }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>

      {value && (
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      )}

      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
