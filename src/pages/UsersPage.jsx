import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import { useUsers } from "../hooks/useUsers";
import { useCreateUser } from "../hooks/useCreateUser";
import SearchBar from "../components/ui/SearchBar";

import { useState } from "react";

const UsersPage = () => {
  const { users, isLoading } = useUsers();
  const createUser = useCreateUser();

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => {
    const term = search.toLowerCase();
    return (
      u.first_name.toLowerCase().includes(term) ||
      u.last_name.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  const handleCreateUser = async (data) => {
    try {
      await createUser.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Overview and management of all system users."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          New User
        </h2>
        <UserForm
          onSubmit={handleCreateUser}
          isSubmitting={createUser.isLoading}
          showRoleSelect={true}
        />
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Users List
        </h2>

        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
        </div>

        {isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : (
          <UserTable users={filteredUsers} />
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
