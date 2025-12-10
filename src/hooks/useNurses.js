// src/hooks/useNurses.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

const fetchUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

export const useNurses = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const nurses = (usersQuery.data || []).filter(
    (u) => u.role === "NURSE"
  );

  const createNurseMutation = useMutation({
    mutationFn: (payload) => api.post("/users/", payload),
    onSuccess: () => {
      toast.success("Nurse created.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Error creating nurse.");
    },
  });

  return {
    nurses,
    usersQuery,
    createNurseMutation,
  };
};
