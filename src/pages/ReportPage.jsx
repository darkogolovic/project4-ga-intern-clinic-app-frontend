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
    return u ? `${u.first_name} ${u.last_name}` : `User #${id}`;
  };

  if (isLoadingUser || isLoadingDashboard || isLoadingAppointment) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "DOCTOR") {
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return (
      <p>
        Error loading appointment:{" "}
        {error?.response?.data?.detail || error.message}
      </p>
    );
  }

  if (!appointment) {
    return <p>Appointment not found.</p>;
  }

  // Frontend security check
  if (appointment.doctor !== user.id) {
    return <p>You do not have permission to write a report for this appointment.</p>;
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
        <Title variant="h2">New Report</Title>
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          Back to Appointments
        </Button>
      </div>

      {/* Appointment info */}
      <Card>
        <CardHeader>
          <Title variant="h3">Appointment Information</Title>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Patient:</span>{" "}
            {patient
              ? `${patient.first_name} ${patient.last_name}`
              : `Patient #${appointment.patient}`}
          </p>
          <p>
            <span className="font-medium">Date:</span> {datePart}
          </p>
          <p>
            <span className="font-medium">Time:</span> {timePart}
          </p>
          <p>
            <span className="font-medium">Doctor:</span>{" "}
            {getUserName(dashboardData.doctors || [], appointment.doctor)}
          </p>
          <p>
            <span className="font-medium">Nurse:</span>{" "}
            {getUserName(dashboardData.nurses || [], appointment.nurse)}
          </p>

          {/* Optional nurse selection */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nurse (optional)
            </label>
            <select
              className="border rounded p-2 text-sm w-full"
              value={nurseId}
              onChange={(e) => setNurseId(e.target.value)}
            >
              <option value="">No nurse</option>
              {nurses.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.first_name} {n.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Patient history button */}
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {showHistory ? "Hide Patient History" : "Show Patient History"}
            </Button>
          </div>

          {showHistory && patient && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Basic Information
                </h4>
                <p className="text-xs text-gray-600">
                  Date of Birth: {patient.date_of_birth || "-"}
                </p>
                <p className="text-xs text-gray-600">
                  Gender: {patient.gender || "-"}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Medical History
                </h4>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">
                  {patient.medical_history || "No medical history provided."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700">
                  Previous Appointments
                </h4>
                {patientAppointments.length === 0 ? (
                  <p className="text-xs text-gray-500">No recorded appointments.</p>
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

      {/* Report textarea */}
      <Card>
        <CardHeader>
          <Title variant="h3">Diagnosis / Report</Title>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full border rounded p-3 text-sm min-h-[250px]"
            placeholder="Enter a detailed report of the examination, diagnosis, and recommendations..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/appointments")}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
