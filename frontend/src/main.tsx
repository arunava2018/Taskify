import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import App from './App';
import { ThemeProvider, useTheme } from '@/theme/Themeprovides';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkWithTheme() {
  const { theme } = useTheme();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return (
    <ClerkProvider
      key={theme}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
      }}
      publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkWithTheme />
    </ThemeProvider>
  </React.StrictMode>
);
