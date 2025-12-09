// hooks/useAppointments.js – primjer create mutacije
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import toast from "react-hot-toast";

const fetchAppointments = async () => {
  const res = await api.get("/appointments/");
  return res.data;
};

const createAppointmentRequest = async (data) => {
  return api.post("/appointments/", data);
};
const deleteAppointmentRequest = async (id) => {
  return api.delete(`/appointments/${id}/`);
};

export function useAppointments() {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });


  const createMutation = useMutation({
    mutationFn: createAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success('Appointment created !')
    },
    onError: (error) => {
    toast.error('Cannot create appointemnt at that time')
    
  },
  });

  return {
    appointments,
    isLoading,
    createAppointment: (payload) => createMutation.mutate(payload),
    deleteAppointment: (id) => deleteMutation.mutate(id),
    
  };
}