export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-indigo-200"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
