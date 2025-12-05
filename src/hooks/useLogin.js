import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export function useLogin() {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login/", data);
      return res.data;
    },
  });
}
