import { AuthForm } from "@/components/auth-form"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
    </div>
  )
}
