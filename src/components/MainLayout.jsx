import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useUser } from "../hooks/useUser";

const AppLayout = () => {
  const { data: user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
       Loading...
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <aside className="w-[20%] min-w-[220px] max-w-xs border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      
      <main className="w-[80%] p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;