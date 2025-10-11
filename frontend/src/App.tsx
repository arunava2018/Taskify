import AppLayout from './layout/AppLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';
import SignInPage from '@/components/Auth/SignInPage';
import SignUpPage from '@/components/Auth/SignUpPage';
import { ThemeProvider } from '@/theme/Themeprovides';
import { Toaster } from '@/components/ui/sonner';
import './index.css';
import Dashboard from './components/Dashboard/Dashboard';
import Error404 from './components/Error404';

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <Error404 />,
      children: [
        { path: '/', element: <Landing /> },
        { path: '/dashboard', element: <Dashboard /> },
      ],
    },
    { path: '/sign-in/*', element: <SignInPage /> },
    { path: '/sign-up/*', element: <SignUpPage /> },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}

export default App;
