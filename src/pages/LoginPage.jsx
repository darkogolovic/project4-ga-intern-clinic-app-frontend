import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router";

export default function Login() {
  
  const { register, handleSubmit, formState } = useForm();
  const login = useLogin();

  const onSubmit = (data) => {
    login.mutate(data)
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8eeff] px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-md p-10 flex flex-col items-center">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ClipboardList size={40} color="white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-1">Clinic Intern Portal</h1>
        <p className="text-gray-500 mb-8 text-center">
          Sign in to access the medical portal
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
          <Input
            label="Email"
            placeholder="your.email@clinic.com"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={formState.errors?.email?.message}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={formState.errors?.password?.message}
          />

          <Button type="submit" variant="dark" full>
            {login.isPending ? "Loading..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="w-full border-t my-8"></div>

        {/* Demo credentials */}
        <div className="text-sm text-gray-600 w-full">
          <p className="font-semibold mb-1">Demo credentials:</p>

          <p><strong>Admin:</strong> admin@clinic.com / admin123</p>
          <p><strong>Doctor:</strong> sarah.chen@clinic.com / doctor123</p>
          <p><strong>Nurse:</strong> emily.davis@clinic.com / nurse123</p>
        </div>
      </div>
    </div>
  );
}
