
const FormField = ({ label, error, children, className = "" }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label}
        </label>
      )}

      {children}

      {error && (
        <p className="text-[11px] text-red-500 mt-0.5">
          {error.message || error}
        </p>
      )}
    </div>
  );
};

export default FormField;