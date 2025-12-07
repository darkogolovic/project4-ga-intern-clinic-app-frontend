import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";


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
            
            {path:'/all',element:<MainPage />}
        ]
    }
])

export default router