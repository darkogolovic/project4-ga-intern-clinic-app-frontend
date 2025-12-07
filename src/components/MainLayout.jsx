import Sidebar  from "../components/Sidebar";
import { Outlet } from "react-router-dom";


export default function MainLayout() {
  return (
   
      <div className="flex h-screen">
      <div className="w-1/7 bg-gray-50 border-r">
        <Sidebar />
      </div>
        <Outlet />
      </div>
   
  );
};