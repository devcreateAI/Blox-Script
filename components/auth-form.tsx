"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signIn, signUp } from "@/lib/auth"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const plan = searchParams.get("plan")
  const isSignUp = mode === "signup"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, plan === "pro" ? "pro" : "free")
        toast({
          title: "Account created!",
          description: "Welcome to BLOXSCRIPT. You can now start generating scripts.",
        })
      } else {
        await signIn(email, password)
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
      }

      // Wait a moment for the auth state to propagate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md voxel border-white/10">
      <CardHeader className="text-center p-4 md:p-6">
        <Link href="/" className="flex justify-center mb-6 md:mb-8">
          <Image
            src="/images/bloxscript-full-logo.png"
            alt="BLOXSCRIPT"
            width={280}
            height={100}
            className="h-12 md:h-16 w-auto"
          />
        </Link>
        <CardTitle className="text-lg md:text-xl">{isSignUp ? "Create your account" : "Welcome back"}</CardTitle>
        <CardDescription className="text-sm md:text-base">
          {isSignUp
            ? `Start generating Roblox scripts with ${plan === "pro" ? "Pro" : "Free"} plan`
            : "Sign in to your account to continue"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1a1a26] border-white/10 h-12 md:h-10 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1a1a26] border-white/10 h-12 md:h-10 text-base"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 min-h-[48px] text-base"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-scripton-cyan hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-scripton-cyan hover:underline">
                Sign up
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
