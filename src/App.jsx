
import { RouterProvider } from "react-router-dom"
import router from './router.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
   <RouterProvider router={router}/>
   </QueryClientProvider>
  )
}

export default App