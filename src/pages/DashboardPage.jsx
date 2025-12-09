import { useUser } from "../hooks/useUser";
import { useDashboardData } from "../hooks/useDashboardData";
import AdminDashboard from "../components/AdminDashboard";
import DoctorDashboard from "../components/DoctorDashboard";
import NurseDashboard from "../components/NurseDashboard";

const DashboardPage = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: dashData, isLoading: dashLoading } = useDashboardData();

  if (userLoading || dashLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
        Dashboard loading...
      </div>
    );
  }

  if (!user || !dashData) {
    return (
      <p className="text-sm text-gray-500">
        Nije moguće učitati dashboard.
      </p>
    );
  }

  const { patients, appointments, doctors, nurses } = dashData;

  if (user.role === "ADMIN") {
    return (
      <AdminDashboard
        patients={patients}
        appointments={appointments}
        doctors={doctors}
        nurses={nurses}
      />
    );
  }

  if (user.role === "DOCTOR") {
    return (
      <DoctorDashboard
        appointments={appointments}
        user={user}
      />
    );
  }

  if (user.role === "NURSE") {
    return (
      <NurseDashboard
        appointments={appointments}
        user={user}
      />
    );
  }

  return (
    <p className="text-sm text-gray-500">
      Nema dashboarda za vašu ulogu.
    </p>
  );
};

export default DashboardPage;