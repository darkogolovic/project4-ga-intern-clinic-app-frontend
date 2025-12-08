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

const DoctorsPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const doctors = users.filter((u) => u.role === "DOCTOR");

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/users/", payload),
    onSuccess: () => {
      toast.success("Doktor kreiran.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Greška pri kreiranju doktora.");
    },
  });

  const handleCreateDoctor = async (data) => {
    try {
      // Forsiramo ulogu DOCTOR bez obzira šta neko unese
      await createMutation.mutateAsync({ ...data, role: "DOCTOR" });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Pregled i upravljanje doktorima."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Novi doktor
        </h2>
        <UserForm
          defaultRole="DOCTOR"
          onSubmit={handleCreateDoctor}
          isSubmitting={createMutation.isLoading}
          showRoleSelect={false} // skrivamo izbor role
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Lista doktora
        </h2>
        {isLoading ? (
          <p className="text-xs text-gray-400">Učitavanje...</p>
        ) : (
          <UserTable users={doctors} />
        )}
      </Card>
    </div>
  );
};

export default DoctorsPage;