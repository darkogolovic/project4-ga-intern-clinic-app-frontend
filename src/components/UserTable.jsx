const RoleBadge = ({ role }) => {
  const map = {
    ADMIN: "bg-slate-100 text-slate-700",
    DOCTOR: "bg-emerald-100 text-emerald-700",
    NURSE: "bg-sky-100 text-sky-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${map[role] || "bg-gray-100 text-gray-700"}`}
    >
      {role}
    </span>
  );
};

const UserTable = ({ users }) => {
  if (!users?.length) {
    return (
      <p className="text-xs text-gray-400">Nema korisnika za prikaz.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-gray-500">
            <th className="py-2 pr-4 text-left">Full name</th>
            <th className="py-2 pr-4 text-left">Email</th>
            <th className="py-2 pr-4 text-left">Role</th>
            <th className="py-2 pr-4 text-left">Specialization</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-b last:border-0 text-xs text-gray-700"
            >
              <td className="py-2 pr-4">
                {u.first_name} {u.last_name}
              </td>
              <td className="py-2 pr-4">{u.email}</td>
              <td className="py-2 pr-4">
                <RoleBadge role={u.role} />
              </td>
              <td className="py-2 pr-4">
                {u.specialization || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;