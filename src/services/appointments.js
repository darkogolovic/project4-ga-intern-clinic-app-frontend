import api from "../lib/axios";

// GET all appointments
export const getAppointments = async () => {
  const res = await api.get("/appointments/");
  return res.data;
};

// CREATE new appointment
export const createAppointment = async (data) => {
  const res = await api.post("/appointments/", data);
  return res.data;
};

// UPDATE appointment
export const updateAppointment = async (id, data) => {
  const res = await api.put(`/appointments/${id}/`, data);
  return res.data;
};

// DELETE appointment
export const deleteAppointment = async (id) => {
  const res = await api.delete(`/appointments/${id}/`);
  return res.data;
};
