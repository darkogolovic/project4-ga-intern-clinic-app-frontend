import { getPatientName } from "../helpers/helpers";
import PageHeader from "./PageHeader";
import Card from "./ui/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const NurseDashboard = ({ appointments, user,patients }) => {
  
  const nurseAppointments = appointments.filter(
    (a) => a.nurse === user.id
  );

  const totalAppointments = nurseAppointments.length;


  const waitingAppointments = nurseAppointments.filter(
    (a) => a.status === "scheduled"
  );

  const uniquePatientsCount = new Set(
    nurseAppointments.map((a) => a.patient)
  ).size;

  // chart: opterećenje po satu
  const hourlyMap = {};
  nurseAppointments.forEach((a) => {
    if (!a.date_time) return;
    const d = new Date(a.date_time);
    const hour = d.getHours();
    const label = `${hour.toString().padStart(2, "0")}:00`;
    hourlyMap[label] = (hourlyMap[label] || 0) + 1;
  });

  const hourlyData = Object.entries(hourlyMap)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => (a.hour > b.hour ? 1 : -1));
    


  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard medicinske sestre"
        description={`Dobrodošli, ${user.first_name} ${user.last_name}.`}
      />

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Ukupni termini" value={totalAppointments} />
        <StatCard label="Na čekanju" value={waitingAppointments.length} />
        <StatCard label="Broj pacijenata" value={uniquePatientsCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">
              Pacijenti na čekanju
            </h2>
          </div>

          {waitingAppointments.length === 0 ? (
            <p className="text-xs text-gray-400">Nema pacijenata na čekanju.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {nurseAppointments.map((appt) => {
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
                        Termin ID: {appt.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">{time}</p>
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
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
            Opterećenje po satu
          </h2>
          <div className="h-56">
            {hourlyData.length === 0 ? (
              <EmptyChartState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 11 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
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

export default NurseDashboard;