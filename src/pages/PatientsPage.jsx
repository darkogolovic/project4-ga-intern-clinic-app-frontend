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
        title={
          user?.role === "DOCTOR"
            ? "Moji pacijenti"
            : "Pacijenti"
        }
        description={
          user?.role === "NURSE"
            ? "Dodavanje i pregled pacijenata."
            : "Pregled pacijenata."
        }
      />

      {/* Forma za novu pacijenticu samo za NURSE */}
      {canCreate && (
        <Card className="p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Novi pacijent
          </h2>
          <PatientForm
            onSubmit={handleCreatePatient}
            isSubmitting={createPatientMutation.isLoading}
          />
        </Card>
      )}

      {/* Lista pacijenata */}
      <Card className="p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">
          {user?.role === "DOCTOR" ? "Lista pacijenata" : "Svi pacijenti"}
        </h2>

        {isLoading ? (
          <p className="text-xs text-gray-400">Učitavanje...</p>
        ) : (
          <PatientsTable patients={patients} />
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;