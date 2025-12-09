const PatientsTable = ({ patients }) => {
  if (!patients?.length) {
    return (
      <p className="text-xs text-gray-400">Nema pacijenata za prikaz.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-gray-500">
            <th className="py-2 pr-4 text-left">Ime i prezime</th>
            <th className="py-2 pr-4 text-left">Telefon</th>
            <th className="py-2 pr-4 text-left">Adresa</th>
            <th className="py-2 pr-4 text-left">Datum rođenja</th>
            <th className="py-2 pr-4 text-left">Spol</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              className="border-b last:border-0 text-xs text-gray-700"
            >
              <td className="py-2 pr-4">
                {p.first_name} {p.last_name}
              </td>
              <td className="py-2 pr-4">{p.phone || "-"}</td>
              <td className="py-2 pr-4">{p.address || "-"}</td>
              <td className="py-2 pr-4">
                {p.date_of_birth || "-"}
              </td>
              <td className="py-2 pr-4">
                {p.gender === "M"
                  ? "Muško"
                  : p.gender === "F"
                  ? "Žensko"
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;