// src/pages/Appointments.jsx
import { useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFreeSlots } from "../hooks/useFreeSlots";
import { useUser } from "../hooks/useUser";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import CardHeader from "../components/ui/CardHeader";
import CardContent from "../components/ui/CardContent";
import Title from "../components/ui/Title";
import toast from "react-hot-toast";

import AppointmentsTable from "../components/AppointmentsTable";

export default function Appointments() {
  const { data: nurse } = useUser(); // ako ti ovo treba za nurseId
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
    nurseId: nurse?.id || "",
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

    const payload = {
      patient_id: Number(newAppointment.patientId),
      doctor_id: Number(newAppointment.doctorId),
      date_time: dateTime,
      status: "scheduled",
    };

    if (newAppointment.nurseId) {
      payload.nurse_id = Number(newAppointment.nurseId);
    }

    createAppointment(payload);

    setNewAppointment({
      patientId: "",
      doctorId: "",
      nurseId: nurse?.id || "",
      date: "",
      time: "",
    });
  };

  const handlePrintReport = (reportId) => {
    toast.success("Successfully printed!");
  };

  if (isLoadingAppointments || isLoadingDashboard || isLoadingUser) {
    return <p>Loading...</p>;
  }

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

            <div className="relative w-full">
              <DatePicker
                selected={
                  newAppointment.date
                    ? new Date(newAppointment.date)
                    : null
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
                wrapperClassName="w-full"
                placeholderText="Select date"
                minDate={new Date()}
              />
            </div>

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
          <AppointmentsTable
            appointments={appointments}
            patients={patients}
            doctors={doctors}
            nurses={nurses}
            user={user}
            onDeleteAppointment={deleteAppointment}
            onPrintReport={handlePrintReport}
          />
        </CardContent>
      </Card>
    </div>
  );
}