import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import { useNurses } from "../hooks/useNurses";

const NursesPage = () => {
  const { nurses, usersQuery, createNurseMutation } = useNurses();

  const handleCreateNurse = async (data) => {
    try {
      await createNurseMutation.mutateAsync({ ...data, role: "NURSE" });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nurses"
        description="Overview and management of nurses."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          New Nurse
        </h2>
        <UserForm
          defaultRole="NURSE"
          onSubmit={handleCreateNurse}
          isSubmitting={createNurseMutation.isLoading}
          showRoleSelect={false}
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Nurses List
        </h2>

        {usersQuery.isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : (
          <UserTable users={nurses} />
        )}
      </Card>
    </div>
  );
};

export default NursesPage;
