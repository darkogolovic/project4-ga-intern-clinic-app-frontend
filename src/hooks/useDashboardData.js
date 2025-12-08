import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios"; 

const fetchDashboardData = async () => {
  const [patientsRes, appointmentsRes, usersRes] = await Promise.all([
    api.get("/patients/"),
    api.get("/appointments/"),
    api.get("/users/"),
  ]);

  const patients = patientsRes.data;
  const appointments = appointmentsRes.data;
  const users = usersRes.data;

  const doctors = users.filter((u) => u.role === "DOCTOR");
  const nurses = users.filter((u) => u.role === "NURSE");

  return { patients, appointments, doctors, nurses };
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
};