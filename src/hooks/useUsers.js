import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

const fetchUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

export const useUsers = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return { users: data, isLoading, error };
};
