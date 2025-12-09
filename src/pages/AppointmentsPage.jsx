import { useState } from "react";
import { useAppointments } from "../hooks/useAppointments";
import { useDashboardData } from "../hooks/useDashboardData";
import { useFreeSlots } from "../hooks/useFreeSlots";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import CardHeader from "../components/ui/CardHeader";
import CardContent from "../components/ui/CardContent";
import Title from "../components/ui/Title";

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

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    nurseId: "",
    date: "",
    time: "",
  });

  
  const {
    data: freeSlots = [],
    isFetching: isFetchingSlots,
  } = useFreeSlots(newAppointment.doctorId, newAppointment.date);

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
      nurse_id: newAppointment.nurseId
        ? Number(newAppointment.nurseId)
        : null,
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

  if (isLoadingAppointments || isLoadingDashboard) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Appointments</h1>
      <p className="text-gray-600">Dodavanje i pregled zakazanih termina.</p>

      {/* CREATE FORM */}
      <Card>
        <CardHeader>
          <Title>Novi termin</Title>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* PACIJENT */}
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
              <option value="">Izaberi pacijenta</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>

            {/* DOKTOR */}
            <select
              className="border rounded p-2"
              value={newAppointment.doctorId}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  doctorId: e.target.value,
                  time: "", // reset termina
                }))
              }
            >
              <option value="">Izaberi doktora</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name} ({d.specialization})
                </option>
              ))}
            </select>

            {/* OPCIONALNO: SESTRA */}
            <select
              className="border rounded p-2"
              value={newAppointment.nurseId}
              onChange={(e) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  nurseId: e.target.value,
                }))
              }
            >
              <option value="">Izaberi sestru (opciono)</option>
              {nurses.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.first_name} {n.last_name}
                </option>
              ))}
            </select>

            {/* DATUM */}
            <DatePicker
                selected={newAppointment.date ? new Date(newAppointment.date) : null}
                onChange={(date) =>
                setNewAppointment((prev) => ({
                ...prev,
                date: date.toISOString().slice(0, 10), // 'YYYY-MM-DD' za API
                time: "",
            }))
            }
             dateFormat="yyyy-MM-dd"
             className="border rounded p-2 w-full"
            placeholderText="Izaberi datum"
            />

            {/* VRIJEME – SLOBODNI SLOTVI */}
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
                  ? "Učitavanje termina..."
                  : freeSlots.length
                  ? "Izaberi slobodan termin"
                  : "Nema slobodnih termina ili odaberi doktora/datum"}
              </option>
              {freeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleCreate}>Sačuvaj termin</Button>
        </CardContent>
      </Card>

      {/* LISTA TERMINA */}
      <Card>
        <CardHeader>
          <Title variant="h3">Svi termini</Title>
        </CardHeader>

        <CardContent>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Pacijent</th>
                <th className="p-2">Doktor</th>
                <th className="p-2">Sestra</th>
                <th className="p-2">Datum</th>
                <th className="p-2">Vrijeme</th>
                <th className="p-2"></th>
              </tr>
            </thead>

            <tbody>
              {appointments?.map((a) => {
                // a.patient, a.doctor, a.nurse su ID‑evi (po serializeru)
                const dt = a.date_time; // ISO string
                const [datePart, timePart] = dt.split("T");

                return (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{getPatientName(a.patient)}</td>
                    <td className="p-2">{getUserName(a.doctor)}</td>
                    <td className="p-2">
                      {a.nurse ? getUserName(a.nurse) : "-"}
                    </td>
                    <td className="p-2">{datePart}</td>
                    <td className="p-2">{timePart?.slice(0, 5)}</td>

                    <td className="p-2 flex gap-2">
                      {/* Uredi po potrebi */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteAppointment(a.id)}
                      >
                        Delete
                      </Button>
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