import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

const fetchFreeSlots = async ({ queryKey }) => {
  const [_key, doctorId, date] = queryKey;

  const res = await api.get("/appointments/available-slots/", {
    params: { doctor_id: doctorId, date },
  });

  return res.data;
};

export const useFreeSlots = (doctorId, date) => {
  return useQuery({
    queryKey: ["freeSlots", doctorId, date],
    queryFn: fetchFreeSlots,
    enabled: !!doctorId && !!date,
  });
};