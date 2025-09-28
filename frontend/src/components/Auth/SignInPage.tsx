import { SignIn } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"
export default function SignInPage() {
  const { user } = useUser()
  if(user){
    return <Navigate to="/" replace /> 
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}
