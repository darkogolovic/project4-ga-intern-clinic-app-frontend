
import { RouterProvider } from "react-router-dom"
import router from './router.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
   <RouterProvider router={router}/>
   <ReactQueryDevtools initialIsOpen={false} />
   </QueryClientProvider>
  )
}

export default App