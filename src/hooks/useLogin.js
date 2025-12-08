import { useMutation } from "@tanstack/react-query";
import { loginService } from "../services/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: loginService,

    onSuccess: (data) => {
      console.log(data.user)
      localStorage.setItem("token", data.access);
      
      toast.success("Welcome back!");
      navigate('/dashboard')
      
    },

    onError: () => {
      toast.error("Invalid email or password");
    },
  });
};
