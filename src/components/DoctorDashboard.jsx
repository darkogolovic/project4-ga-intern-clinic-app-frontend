import { getPatientName } from "../helpers/helpers";
import PageHeader from "./PageHeader";
import Card from "./ui/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DoctorDashboard = ({ appointments, user, patients }) => {
  const doctorAppointments = appointments.filter((a) => a.doctor === user.id);
  const totalAppointments = doctorAppointments.length;

  const today = new Date().toDateString();
  const todaysAppointments = doctorAppointments.filter((a) => {
    if (!a.date_time) return false;
    const d = new Date(a.date_time);
    return d.toDateString() === today;
  });

  const uniquePatientsCount = new Set(
    doctorAppointments.map((a) => a.patient)
  ).size;

  const statusMap = {};
  doctorAppointments.forEach((a) => {
    const status = a.status || "unknown";
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  const statusData = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Dashboard"
        description={`Welcome, ${user.first_name} ${user.last_name}.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Appointments" value={totalAppointments} />
        <StatCard label="Today's Appointments" value={todaysAppointments.length} />
        <StatCard label="Active Patients" value={uniquePatientsCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">
              Today's Appointments
            </h2>
          </div>

          {todaysAppointments.length === 0 ? (
            <p className="text-xs text-gray-400">No appointments for today.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todaysAppointments.map((appt) => {
                const time = appt.date_time
                  ? new Date(appt.date_time).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <li
                    key={appt.id}
                    className="py-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="text-gray-900">
                        {getPatientName(patients, appt.patient)}
                      </p>
                      <p className="text-gray-400">
                        Appointment ID: {appt.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">{time}</p>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {appt.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            Appointments by Status
          </h2>
          <div className="h-56">
            {statusData.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <Card className="p-4 flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-2xl font-semibold text-gray-900">{value}</span>
  </Card>
);

const EmptyChartState = () => (
  <div className="h-full flex items-center justify-center">
    <p className="text-xs text-gray-400">No data available.</p>
  </div>
);

export default DoctorDashboard;
