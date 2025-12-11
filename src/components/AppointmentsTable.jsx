import { Link } from "react-router-dom";
import Button from "./ui/Button";
import SearchBar from './ui/SearchBar'
import Title from "./ui/Title";
import { useState } from "react";

export default function AppointmentsTable({
  appointments,
  patients,
  doctors,
  nurses,
  user,
  onDeleteAppointment,
  onPrintReport,
}) {
  const isDoctor = user?.role === "DOCTOR";
  const isNurse = user?.role === "NURSE";
  const [search, setSearch] = useState("");

  const getPatientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.first_name} ${p.last_name}` : id;
  };

  const getUserName = (id) => {
    const u =
      doctors.find((x) => x.id === id) || nurses.find((x) => x.id === id);
    return u ? `${u.first_name} ${u.last_name}` : id;
  };

   const filteredAppointments = appointments.filter((a) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;

    const patientName = getPatientName(a.patient).toLowerCase();
    const doctorName = getUserName(a.doctor).toLowerCase();
    const nurseName = a.nurse ? getUserName(a.nurse).toLowerCase() : "";
    const dt = a.date_time || "";
    const [datePart, timePart] = dt.split("T");
    const timeShort = timePart?.slice(0, 5) || "";

    return (
      patientName.includes(term) ||
      doctorName.includes(term) ||
      nurseName.includes(term) ||
      datePart?.toLowerCase().includes(term) ||
      timeShort.toLowerCase().includes(term)
    );
  });

  return (
    <>
    <Title variant="h3">All Appointments</Title>
    <SearchBar 
    value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search appointments..."
    />
    <table className="w-full text-left">
      <thead>
        <tr className="border-b">
          <th className="p-2">Patient</th>
          <th className="p-2">Doctor</th>
          <th className="p-2">Nurse</th>
          <th className="p-2">Date</th>
          <th className="p-2">Time</th>
          <th className="p-2">Report</th>
          <th className="p-2"></th>
        </tr>
      </thead>

      <tbody>
        {filteredAppointments?.map((a) => {
          const dt = a.date_time;
          const [datePart, timePart] = dt.split("T");

          const hasReport = !!a.report_id;
          const canWriteReport =
            isDoctor && a.doctor === user.id && !hasReport;
          const canPrintReport = isNurse && hasReport;

          return (
            <tr key={a.id} className="border-b">
              <td className="p-2">{getPatientName(a.patient)}</td>
              <td className="p-2">{getUserName(a.doctor)}</td>
              <td className="p-2">
                {a.nurse ? getUserName(a.nurse) : "-"}
              </td>
              <td className="p-2">{datePart}</td>
              <td className="p-2">{timePart?.slice(0, 5)}</td>

              <td className="p-2">
                {canPrintReport && (
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => onPrintReport(a.report_id)}
                    title="Print report"
                  >
                    Print
                  </button>
                )}

                {canWriteReport && (
                  <Link
                    to={`/appointments/${a.id}/report`}
                    className="ml-2 text-xs text-indigo-600 hover:underline"
                  >
                    Write Report
                  </Link>
                )}
              </td>

              <td className="p-2">
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteAppointment(a.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    
</>
  );
}