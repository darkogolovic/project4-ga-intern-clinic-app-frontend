import PageHeader from "./PageHeader";
import Card from "./ui/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AdminDashboard = ({ patients, appointments, doctors, nurses }) => {
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalDoctors = doctors.length;
  const totalNurses = nurses.length;

  // --- Chart 1: termini po danu (posljednjih 30 dana) ---
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const appointmentsByDayMap = {};
  appointments.forEach((a) => {
    if (!a.date_time) return;
    const d = new Date(a.date_time);
    if (d < thirtyDaysAgo) return;
    const day = d.toISOString().slice(0, 10); // YYYY-MM-DD
    appointmentsByDayMap[day] = (appointmentsByDayMap[day] || 0) + 1;
  });

  const appointmentsByDayData = Object.entries(appointmentsByDayMap)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => (a.day > b.day ? 1 : -1));

  // --- Chart 2: termini po statusu ---
  const statusLabels = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const statusMap = {};
  appointments.forEach((a) => {
    const status = a.status || "unknown";
    statusMap[status] = (statusMap[status] || 0) + 1;
  });

  const appointmentsByStatusData = Object.entries(statusMap).map(
    ([status, count]) => ({
      status: statusLabels[status] || status,
      count,
    })
  );

  // --- Posljednjih 5 termina (čisto da imaš nešto ispod chartova) ---
  const latestAppointments = [...appointments]
    .sort(
      (a, b) =>
        new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Pregled sistema: pacijenti, termini i osoblje."
      />

      {/* Stat kartice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pacijenti" value={totalPatients} />
        <StatCard label="Termini" value={totalAppointments} />
        <StatCard label="Doktori" value={totalDoctors} />
        <StatCard label="Medicinske sestre" value={totalNurses} />
      </div>

      {/* Chartovi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Termini po danu */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">
              Termini u zadnjih 30 dana
            </h2>
          </div>
          <div className="h-64">
            {appointmentsByDayData.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Termini po statusu */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-900">
              Termini po statusu
            </h2>
          </div>
          <div className="h-64">
            {appointmentsByStatusData.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentsByStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Posljednji termini */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-900">
            Poslednjih 5 termina
          </h2>
        </div>

        {latestAppointments.length === 0 ? (
          <p className="text-xs text-gray-400">Nema termina.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b text-[11px] text-gray-500">
                  <th className="py-2 pr-4 text-left">ID</th>
                  <th className="py-2 pr-4 text-left">Pacijent</th>
                  <th className="py-2 pr-4 text-left">Doktor</th>
                  <th className="py-2 pr-4 text-left">Vrijeme</th>
                  <th className="py-2 pr-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestAppointments.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 text-gray-700"
                  >
                    <td className="py-2 pr-4">#{a.id}</td>
                    <td className="py-2 pr-4">Pacijent #{a.patient}</td>
                    <td className="py-2 pr-4">Doktor #{a.doctor}</td>
                    <td className="py-2 pr-4">
                      {a.date_time &&
                        new Date(a.date_time).toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                        {statusLabels[a.status] || a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <Card className="p-4 flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-2xl font-semibold text-gray-900">{value}</span>
  </Card>
);

const EmptyChartState = () => (
  <div className="h-full flex items-center justify-center">
    <p className="text-xs text-gray-400">Nema dovoljno podataka za prikaz.</p>
  </div>
);

export default AdminDashboard;