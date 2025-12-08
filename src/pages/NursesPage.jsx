import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

const fetchUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

const NursesPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const nurses = users.filter((u) => u.role === "NURSE");

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/users/", payload),
    onSuccess: () => {
      toast.success("Sestra kreirana.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Greška pri kreiranju sestre.");
    },
  });

  const handleCreateNurse = async (data) => {
    try {
      await createMutation.mutateAsync({ ...data, role: "NURSE" });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nurses"
        description="Pregled i upravljanje medicinskim sestrama."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Nova medicinska sestra
        </h2>
        <UserForm
          defaultRole="NURSE"
          onSubmit={handleCreateNurse}
          isSubmitting={createMutation.isLoading}
          showRoleSelect={false}
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Lista sestara
        </h2>
        {isLoading ? (
          <p className="text-xs text-gray-400">Učitavanje...</p>
        ) : (
          <UserTable users={nurses} />
        )}
      </Card>
    </div>
  );
};

export default NursesPage;