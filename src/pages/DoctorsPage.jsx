import PageHeader from "../components/PageHeader";
import { useState } from "react";
import Card from "../components/ui/Card";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import { useDoctors } from "../hooks/useDoctors";
import SearchBar from "../components/ui/SearchBar";

const DoctorsPage = () => {
  const { doctors, usersQuery, createDoctorMutation } = useDoctors();
    const [search, setSearch] = useState("");
  
    const filteredDoctors = doctors.filter(u => {
      const term = search.toLowerCase();
      return (
        u.first_name.toLowerCase().includes(term) ||
        u.last_name.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
      );
    });

  const handleCreateDoctor = async (data) => {
    try {
      await createDoctorMutation.mutateAsync({ ...data, role: "DOCTOR" });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Overview and management of doctors."
      />

      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          New Doctor
        </h2>
        <UserForm
          defaultRole="DOCTOR"
          onSubmit={handleCreateDoctor}
          isSubmitting={createDoctorMutation.isLoading}
          showRoleSelect={false} 
        />
      </Card>
      
      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          Doctors List
        </h2>
         <SearchBar
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctors..."
                />
        {usersQuery.isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : (
          <UserTable users={filteredDoctors} />
        )}
      </Card>
    </div>
  );
};

export default DoctorsPage;
