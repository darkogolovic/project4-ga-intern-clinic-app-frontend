import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

const fetchUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

export const useDoctors = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const doctors = (usersQuery.data || []).filter(u => u.role === "DOCTOR");

  const createDoctorMutation = useMutation({
    mutationFn: (payload) => api.post("/users/", payload),
    onSuccess: () => {
      toast.success("Doctor created.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Error creating doctor.");
    },
  });

  return {
    doctors,
    usersQuery,
    createDoctorMutation,
  };
};
