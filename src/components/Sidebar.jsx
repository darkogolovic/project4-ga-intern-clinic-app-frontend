import { data, NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { sidebarLinks } from "../utils/sidebarLinks";
import { useUser } from "../hooks/useUser";

export default function Sidebar() {
   const { data: user, isLoading } = useUser();
  const role = user?.role;
  const links = sidebarLinks[role] || [];

  return (
    <aside className="w-64 bg-white border-r h-screen p-6 flex flex-col gap-4">

      <h2 className="text-xl font-bold mb-4">Clinic</h2>

      <nav className="flex flex-col gap-2">
        {links.map((item) => {
          const Icon = Icons[item.icon];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                 ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
