import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import DoctorsPage from "./pages/DoctorsPage";
import NursesPage from "./pages/NursesPage";


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
        ]
    }
])

export default router