import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFreeSlots } from "../hooks/useFreeSlots";
import { useReports } from "../hooks/useReports";
import { useUser } from "../hooks/useUser";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import CardHeader from "../components/ui/CardHeader";
import CardContent from "../components/ui/CardContent";
import Title from "../components/ui/Title";
import toast from "react-hot-toast";

export default function Appointments() {
  const {
    appointments,
    isLoading: isLoadingAppointments,
    createAppointment,
    deleteAppointment,
  } = useAppointments();

  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useDashboardData();

  const patients = dashboardData?.patients || [];
  const doctors = dashboardData?.doctors || [];
  const nurses = dashboardData?.nurses || [];

  const { data: user, isLoading: isLoadingUser } = useUser();

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    nurseId: "",
    date: "",
    time: "",
  });

  const { data: freeSlots = [], isFetching: isFetchingSlots } = useFreeSlots(
    newAppointment.doctorId,
    newAppointment.date
  );

  const handleCreate = () => {
    if (
      !newAppointment.patientId ||
      !newAppointment.doctorId ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      return;
    }

    const dateTime = `${newAppointment.date}T${newAppointment.time}`;

    createAppointment({
      patient_id: Number(newAppointment.patientId),
      doctor_id: Number(newAppointment.doctorId),
      nurse_id: newAppointment.nurseId ? Number(newAppointment.nurseId) : null,
      date_time: dateTime,
      status: "scheduled",
    });

    setNewAppointment({
      patientId: "",
      doctorId: "",
      nurseId: "",
      date: "",
      time: "",
    });
  };

  const getPatientName = (id) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.first_name} ${p.last_name}` : id;
  };

  const getUserName = (id) => {
    const u =
      doctors.find((x) => x.id === id) || nurses.find((x) => x.id === id);
    return u ? `${u.first_name} ${u.last_name}` : id;
  };

  const handlePrintReport = (reportId) => {
    toast.success("Successfully printed!");
  };

  if (isLoadingAppointments || isLoadingDashboard || isLoadingUser) {
    return <p>Loading...</p>;
  }

  const isDoctor = user?.role === "DOCTOR";
  const isNurse = user?.role === "NURSE";

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Appointments</h1>
      <p className="text-gray-600">Add and view scheduled appointments.</p>

      <Card>
        <CardHeader>
          <Title>New Appointment</Title>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* PATIENT */}
            <select
              className="border rounded p-2"
              value={newAppointment.patientId}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  patientId: e.target.value,
                }))
              }
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>

            {/* DOCTOR */}
            <select
              className="border rounded p-2"
              value={newAppointment.doctorId}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  doctorId: e.target.value,
                  time: "",
                }))
              }
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                  {d.specialization ? ` (${d.specialization})` : ""}
                </option>
              ))}
            </select>

            {/* DATE */}
            <DatePicker
              selected={
                newAppointment.date ? new Date(newAppointment.date) : null
              }
              onChange={(date) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  date: date.toISOString().slice(0, 10),
                  time: "",
                }))
              }
              dateFormat="yyyy-MM-dd"
              className="border rounded p-2 w-full"
              placeholderText="Select date"
            />

            {/* TIME */}
            <select
              className="border rounded p-2"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  time: e.target.value,
                }))
              }
              disabled={!freeSlots.length && !isFetchingSlots}
            >
              <option value="">
                {isFetchingSlots
                  ? "Loading slots..."
                  : freeSlots.length
                  ? "Select available slot"
                  : "No free slots or select doctor/date"}
              </option>
              {freeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleCreate}>Save Appointment</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Title variant="h3">All Appointments</Title>
        </CardHeader>

        <CardContent>
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
              {appointments?.map((a) => {
                const dt = a.date_time;
                const [datePart, timePart] = dt.split("T");

                return (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{getPatientName(a.patient)}</td>
                    <td className="p-2">{getUserName(a.doctor)}</td>
                    <td className="p-2">{a.nurse ? getUserName(a.nurse) : "-"}</td>
                    <td className="p-2">{datePart}</td>
                    <td className="p-2">{timePart?.slice(0, 5)}</td>
                    <td className="p-2">
                      {a.report_id
                        ? isNurse && (
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handlePrintReport(a.report_id)}
                              title="Print report"
                            >
                              Print
                            </button>
                          )
                        : isDoctor && a.doctor === user.id && (
                            <Link
                              to={`/appointments/${a.id}/report`}
                              className="text-xs text-indigo-600 hover:underline"
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
                          onClick={() => deleteAppointment(a.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
