import { useForm } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import FormField from "./ui/FormField";

const PatientForm = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <FormField label="First Name" error={errors.first_name}>
        <Input {...register("first_name", { required: "First name is required." })} />
      </FormField>

      <FormField label="Last Name" error={errors.last_name}>
        <Input {...register("last_name", { required: "Last name is required." })} />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <Input {...register("phone")} />
      </FormField>

      <FormField label="Address" error={errors.address}>
        <Input {...register("address")} />
      </FormField>

      <FormField label="Date of Birth" error={errors.date_of_birth}>
        <Input type="date" {...register("date_of_birth")} placeholder="YYYY-MM-DD"/>
      </FormField>

      <FormField label="Gender" error={errors.gender}>
        <select
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          {...register("gender")}
        >
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </FormField>

      <div className="sm:col-span-2">
        <FormField label="Medical History" error={errors.medical_history}>
          <textarea
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            {...register("medical_history")}
          />
        </FormField>
      </div>

      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Patient"}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
