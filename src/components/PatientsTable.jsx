import { useState, useMemo } from "react";
import SearchBar from "./ui/SearchBar";

const PatientsTable = ({ patients }) => {
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    if (!search) return patients;
    const lowerSearch = search.toLowerCase();
    return patients.filter(
      (p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(lowerSearch)
    );
  }, [patients, search]);

  if (!patients?.length) {
    return <p className="text-xs text-gray-400">No patients to display.</p>;
  }

  return (
    <div className="space-y-3">
      <SearchBar
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-500">
              <th className="py-2 pr-4 text-left">Full Name</th>
              <th className="py-2 pr-4 text-left">Phone</th>
              <th className="py-2 pr-4 text-left">Address</th>
              <th className="py-2 pr-4 text-left">Date of Birth</th>
              <th className="py-2 pr-4 text-left">Gender</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr
                key={p.id}
                className="border-b last:border-0 text-xs text-gray-700"
              >
                <td className="py-2 pr-4">{p.first_name} {p.last_name}</td>
                <td className="py-2 pr-4">{p.phone || "-"}</td>
                <td className="py-2 pr-4">{p.address || "-"}</td>
                <td className="py-2 pr-4">{p.date_of_birth || "-"}</td>
                <td className="py-2 pr-4">
                  {p.gender === "M"
                    ? "Male"
                    : p.gender === "F"
                    ? "Female"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsTable;
