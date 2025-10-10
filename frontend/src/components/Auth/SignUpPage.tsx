import { SignUp } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
export default function SignUpPage() {
  const { user } = useUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="flex items-center justify-center mt-10">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
