import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import DoctorsPage from "./pages/DoctorsPage";
import NursesPage from "./pages/NursesPage";
import PatientsPage from "./pages/PatientsPage";
import Appointments from "./pages/AppointmentsPage";

import ReportCreatePage from "./pages/ReportPage";


const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {path:'/',element:<LoginPage />}
        ]
    },
    {
        element:<MainLayout />,
        children:[
            {path:'/dashboard',element:<DashboardPage />},
            {path: "/users", element: <UsersPage />  },
            {path: "/doctors",element: <DoctorsPage />},
            {path: "/nurses",element: <NursesPage />},
            {path: "/patients", element: <PatientsPage />},
            {path: "/appointments", element:<Appointments />},
            {path:"/appointments/:appointmentId/report", element :<ReportCreatePage />  }
        ]
    }
])

export default router