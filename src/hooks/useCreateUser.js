import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/users/", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Korisnik kreiran.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Greška pri kreiranju korisnika.");
    },
  });

  return mutation;
};
