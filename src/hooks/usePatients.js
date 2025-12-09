import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

const fetchPatients = async () => {
  const res = await api.get("/patients/");
  return res.data;
};

export const usePatients = () => {
  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const createPatientMutation = useMutation({
    mutationFn: (payload) => api.post("/patients/", payload),
    onSuccess: () => {
      toast.success("Pacijent je uspješno kreiran.");
      queryClient.invalidateQueries(["patients"]);
    },
    onError: () => {
      toast.error("Greška pri kreiranju pacijenta.");
    },
  });

  return {
    patientsQuery,
    createPatientMutation,
  };
};