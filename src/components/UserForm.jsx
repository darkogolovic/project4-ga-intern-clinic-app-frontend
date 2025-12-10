import { useForm } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import FormField from "./ui/FormField";

const UserForm = ({ defaultRole = "DOCTOR", onSubmit, isSubmitting, showRoleSelect = true }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: defaultRole,
      specialization: "",
    },
    shouldUnregister: true,
  });

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset({ role: defaultRole, specialization: "" });
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

      <FormField label="Email" error={errors.email}>
        <Input
          type="email"
          {...register("email", { required: "Email je obavezan." })}
        />
      </FormField>

      <FormField label="Lozinka" error={errors.password}>
        <Input
          type="password"
          {...register("password", { required: "Lozinka je obavezna." })}
        />
      </FormField>

      {showRoleSelect && (
        <FormField label="Uloga" error={errors.role}>
          <select
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            {...register("role", { required: "Uloga je obavezna." })}
          >
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
          </select>
        </FormField>
      )}

      <FormField label="Specijalizacija">
        <Input
          placeholder="npr. Kardiolog"
          {...register("specialization")}
        />
      </FormField>

      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Spremanje..." : "Dodaj korisnika"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;