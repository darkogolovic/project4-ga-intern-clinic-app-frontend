import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import toast from "react-hot-toast";

const createReportRequest = async (data) => {
  const res = await api.post("/reports/", data);
  return res.data;
};

export function useReports() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createReportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success("Reprot Created !")
    },
    onError: (error) => {
      console.error(
        "CREATE REPORT ERROR PAYLOAD:",
        error.response?.data || error
      );
      alert(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    },
  });

  return {
    createReport: (payload, options) => createMutation.mutate(payload, options),
  };
}