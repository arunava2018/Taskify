import AppLayout from "./layout/AppLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Landing from "./pages/Landing"
function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        { path: "/", element: <Landing /> },
      ],
    },
  ])
  return <RouterProvider router={router} />
}
export default App
