import { useUser } from "../hooks/useUser";
import { usePatients } from "../hooks/usePatients";
import PageHeader from "../components/PageHeader";
import Card from "../components/ui/Card";
import PatientForm from "../components/PatientForm";
import PatientsTable from "../components/PatientsTable";

const PatientsPage = () => {
  const { data: user } = useUser();
  const { patientsQuery, createPatientMutation } = usePatients();

  const { data: patients = [], isLoading } = patientsQuery;

  const canCreate = user?.role === "NURSE";

  const handleCreatePatient = async (formData) => {
    try {
      await createPatientMutation.mutateAsync(formData);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={user?.role === "DOCTOR" ? "My Patients" : "Patients"}
        description={
          user?.role === "NURSE"
            ? "Add and manage patients."
            : "View patients."
        }
      />

      {/* New patient form (only for nurses) */}
      {canCreate && (
        <Card className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            New Patient
          </h2>
          <PatientForm
            onSubmit={handleCreatePatient}
            isSubmitting={createPatientMutation.isLoading}
          />
        </Card>
      )}

      {/* Patients list */}
      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          {user?.role === "DOCTOR" ? "My Patients List" : "All Patients"}
        </h2>

        {isLoading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : (
          <PatientsTable patients={patients} />
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;
