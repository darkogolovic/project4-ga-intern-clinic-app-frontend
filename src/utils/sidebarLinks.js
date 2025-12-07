export const sidebarLinks = {
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Users", path: "/users", icon: "Users" },
    { label: "Doctors", path: "/doctors", icon: "Stethoscope" },
    { label: "Nurses", path: "/nurses", icon: "UserPlus" },
    { label: "Patients", path: "/patients", icon: "User" },
    { label: "Appointments", path: "/appointments", icon: "Calendar" },
  ],

  DOCTOR: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Patients", path: "/patients", icon: "User" },
    { label: "My Appointments", path: "/appointments", icon: "Calendar" },
    { label: "Reports", path: "/reports", icon: "FileText" },
  ],

  NURSE: [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Patients", path: "/patients", icon: "User" },
    { label: "Appointments", path: "/appointments", icon: "Calendar" },
  ],
};
