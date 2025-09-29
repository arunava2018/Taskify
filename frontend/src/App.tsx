import AppLayout from "./layout/AppLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";
import SignInPage from "@/components/Auth/SignInPage";
import SignUpPage from "@/components/Auth/SignUpPage";
import { ThemeProvider } from "@/theme/Themeprovides";
import "./index.css";

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [{ path: "/", element: <Landing /> }],
    },
    { path: "/sign-in", element: <SignInPage /> },
    { path: "/sign-up", element: <SignUpPage /> },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
