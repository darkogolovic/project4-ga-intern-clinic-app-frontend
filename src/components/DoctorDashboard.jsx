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

/**
 * props:
 *  - appointments: lista svih termina (iz /appointments/)
 *  - user: ulogovani doktor (User)
 *  - patients: lista pacijenata (iz /patients/)
 */
const DoctorDashboard = ({ appointments, user, patients }) => {
  // Svi termini ovog doktora
  const doctorAppointments = appointments.filter(
    (a) => a.doctor === user.id
  );

  const totalAppointments = doctorAppointments.length;

  // Današnji termini
  const today = new Date().toDateString();
  const todaysAppointments = doctorAppointments.filter((a) => {
    if (!a.date_time) return false;
    const d = new Date(a.date_time);
    return d.toDateString() === today;
  });

  // Broj jedinstvenih pacijenata
  const uniquePatientsCount = new Set(
    doctorAppointments.map((a) => a.patient)
  ).size;

  // Termini po statusu
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
        title="Doktorski Dashboard"
        description={`Dobrodošli, ${user.first_name} ${user.last_name}.`}
      />

      {/* Stat kartice */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Ukupni termini" value={totalAppointments} />
        <StatCard label="Današnji termini" value={todaysAppointments.length} />
        <StatCard label="Aktivni pacijenti" value={uniquePatientsCount} />
      </div>

      {/* Sadržaj */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Današnji termini */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">
              Današnji termini
            </h2>
          </div>

          {todaysAppointments.length === 0 ? (
            <p className="text-xs text-gray-400">Nema termina za danas.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todaysAppointments.map((appt) => {
                const time = appt.date_time
                  ? new Date(appt.date_time).toLocaleTimeString("de-DE", {
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
                        {getPatientName(patients,appt.patient)}
                      </p>
                      <p className="text-gray-400">
                         {getPatientName(patients,appt.patient) }
                      </p>
                      <p className="text-gray-400">
                        Termin ID: {appt.id}
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

        {/* Chart po statusu */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-2">
            Termini po statusu
          </h2>
          <div className="h-56">
            {statusData.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                  />
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
    <span className="text-xs uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-2xl font-semibold text-gray-900">{value}</span>
  </Card>
);

const EmptyChartState = () => (
  <div className="h-full flex items-center justify-center">
    <p className="text-xs text-gray-400">Nema podataka.</p>
  </div>
);

export default DoctorDashboard;