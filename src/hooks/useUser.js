import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("me/");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
};

