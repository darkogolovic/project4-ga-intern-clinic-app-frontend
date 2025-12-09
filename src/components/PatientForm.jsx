import { useForm } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import FormField from "./ui/FormField";

const PatientForm = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <FormField label="Ime" error={errors.first_name}>
        <Input
          {...register("first_name", { required: "Ime je obavezno." })}
        />
      </FormField>

      <FormField label="Prezime" error={errors.last_name}>
        <Input
          {...register("last_name", { required: "Prezime je obavezno." })}
        />
      </FormField>

      <FormField label="Telefon" error={errors.phone}>
        <Input {...register("phone")} />
      </FormField>

      <FormField label="Adresa" error={errors.address}>
        <Input {...register("address")} />
      </FormField>

      <FormField label="Datum rođenja" error={errors.date_of_birth}>
        <Input type="date" {...register("date_of_birth")} />
      </FormField>

      <FormField label="Spol" error={errors.gender}>
        <select
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register("gender")}
        >
          <option value="">Odaberi</option>
          <option value="M">Muško</option>
          <option value="F">Žensko</option>
        </select>
      </FormField>

      <div className="sm:col-span-2">
        <FormField label="Medicinska historija" error={errors.medical_history}>
          <textarea
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            {...register("medical_history")}
          />
        </FormField>
      </div>

      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Spremanje..." : "Sačuvaj pacijenta"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;