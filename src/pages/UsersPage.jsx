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

const UsersPage = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post("/users/", payload),
    onSuccess: () => {
      toast.success("Korisnik kreiran.");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Greška pri kreiranju korisnika.");
    },
  });

  const handleCreateUser = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Pregled i upravljanje svim korisnicima sistema."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Novi korisnik
        </h2>
        <UserForm
          onSubmit={handleCreateUser}
          isSubmitting={createMutation.isLoading}
          showRoleSelect={true}
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Lista korisnika
        </h2>
        {isLoading ? (
          <p className="text-xs text-gray-400">Učitavanje...</p>
        ) : (
          <UserTable users={users} />
        )}
      </Card>
    </div>
  );
};

export default UsersPage;