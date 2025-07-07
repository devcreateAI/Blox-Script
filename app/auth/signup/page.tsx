import { AuthForm } from "@/components/auth-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <AuthForm mode="signup" />
    </div>
  )
}
