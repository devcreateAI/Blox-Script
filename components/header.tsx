"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center mx-0 font-normal flex-row">
        <Image
          src="/images/bloxscript-full-logo.png"
          alt="BLOXSCRIPT"
          width={200}
          height={200}
          className="h-80 w-auto"
        />
      </Link>

      <nav className="hidden md:flex gap-8 text-sm">
        <a href="#features" className="hover:text-scripton-cyan transition">
          Features
        </a>
        <a href="#playground" className="hover:text-scripton-cyan transition">
          Playground
        </a>
        <a href="#pricing" className="hover:text-scripton-cyan transition">
          Pricing
        </a>
        <a href="#testimonials" className="hover:text-scripton-cyan transition">
          Testimonials
        </a>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-400 hover:text-white">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 transition font-medium shadow-lg"
              >
                Try Free
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
