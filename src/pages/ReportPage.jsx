// src/pages/ReportCreatePage.jsx

import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

import { useUser } from "../hooks/useUser";
import { useDashboardData } from "../hooks/useDashboardData";
import { useReports } from "../hooks/useReports";

import Card from "../components/ui/Card";
import CardHeader from "../components/ui/CardHeader";
import CardContent from "../components/ui/CardContent";
import Title from "../components/ui/Title";
import Button from "../components/ui/Button";

const fetchAppointment = async (id) => {
  const res = await api.get(`/appointments/${id}/`);
  return res.data;
};

export default function ReportCreatePage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: isLoadingUser } = useUser();
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
  } = useDashboardData();
  const { createReport } = useReports();

  const {
    data: appointment,
    isLoading: isLoadingAppointment,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => fetchAppointment(appointmentId),
  });

  const [diagnosis, setDiagnosis] = useState("");
  const [nurseId, setNurseId] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const patients = dashboardData?.patients || [];
  const nurses = dashboardData?.nurses || [];
  const allAppointments = dashboardData?.appointments || [];

  const getPatient = (id) => patients.find((p) => p.id === id);
  const getUserName = (list, id) => {
    if (!id) return "-";
    const u = list.find((x) => x.id === id);
    return u ? `${u.first_name} ${u.last_name}` : `Korisnik #${id}`;
  };

  if (isLoadingUser || isLoadingDashboard || isLoadingAppointment) {
    return <p>Učitavanje...</p>;
  }

  if (!user || user.role !== "DOCTOR") {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <p>
        Greška pri učitavanju termina:{" "}
        {error?.response?.data?.detail || error.message}
      </p>
    );
  }

  if (!appointment) {
    return <p>Termin nije pronađen.</p>;
  }

  // sigurnosna provjera i na frontendu
  if (appointment.doctor !== user.id) {
    return <p>Nemate pravo da pišete izvještaj za ovaj termin.</p>;
  }

  const patient = getPatient(appointment.patient);
  const patientAppointments = allAppointments.filter(
    (a) => a.patient === appointment.patient
  );

  const handleSubmit = () => {
    if (!diagnosis.trim()) return;

    const payload = {
      appointment_id: appointment.id,
      diagnosis,
    };

    if (nurseId) {
      payload.nurse_id = Number(nurseId);
    }

    createReport(payload, {
      onSuccess: () => {
        // nakon kreiranja reporta vrati se na listu termina
        navigate("/appointments");
      },
    });
  };

  const dt = appointment.date_time;
  const [datePart, timePartFull] = dt.split("T");
  const timePart = timePartFull?.slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Title variant="h2">Novi izvještaj</Title>
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          Nazad na termine
        </Button>
      </div>

      {/* Info o pacijentu i terminu */}
      <Card>
        <CardHeader>
          <Title variant="h3">Informacije o terminu</Title>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Pacijent:</span>{" "}
            {patient
              ? `${patient.first_name} ${patient.last_name}`
              : `Pacijent #${appointment.patient}`}
          </p>
          <p>
            <span className="font-medium">Datum:</span> {datePart}
          </p>
          <p>
            <span className="font-medium">Vrijeme:</span> {timePart}
          </p>
          <p>
            <span className="font-medium">Doktor:</span>{" "}
            {getUserName(dashboardData.doctors || [], appointment.doctor)}
          </p>
          <p>
            <span className="font-medium">Sestra:</span>{" "}
            {getUserName(dashboardData.nurses || [], appointment.nurse)}
          </p>

          {/* Odabir sestre za report (opciono) */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sestra (opciono)
            </label>
            <select
              className="border rounded p-2 text-sm w-full"
              value={nurseId}
              onChange={(e) => setNurseId(e.target.value)}
            >
              <option value="">Bez sestre</option>
              {nurses.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.first_name} {n.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Dugme za istoriju pacijenta */}
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {showHistory ? "Sakrij istoriju pacijenta" : "Prikaži istoriju pacijenta"}
            </Button>
          </div>

          {showHistory && patient && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Osnovni podaci
                </h4>
                <p className="text-xs text-gray-600">
                  Datum rođenja: {patient.date_of_birth || "-"}
                </p>
                <p className="text-xs text-gray-600">
                  Pol: {patient.gender || "-"}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Medicinska istorija
                </h4>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                  {patient.medical_history || "Nema unijete medicinske istorije."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Prethodni termini
                </h4>
                {patientAppointments.length === 0 ? (
                  <p className="text-xs text-gray-500">Nema zabilježenih termina.</p>
                ) : (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {patientAppointments.map((appt) => {
                      const [d, tFull] = appt.date_time.split("T");
                      const t = tFull.slice(0, 5);
                      return (
                        <li key={appt.id}>
                          {d} {t} – {appt.status}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Veliko polje za pisanje izvještaja */}
      <Card>
        <CardHeader>
          <Title variant="h3">Dijagnoza / Izvještaj</Title>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full border rounded p-3 text-sm min-h-[250px]"
            placeholder="Unesite detaljan izvještaj o pregledu, dijagnozu i preporuke..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/appointments")}
            >
              Otkaži
            </Button>
            <Button onClick={handleSubmit}>Sačuvaj izvještaj</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}