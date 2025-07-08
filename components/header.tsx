"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X } from "lucide-react"

export function Header() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between relative">
      <Link href="/" className="flex items-center mx-0 font-normal flex-row z-10">
        <Image
          src="/images/bloxscript-full-logo.png"
          alt="BLOXSCRIPT"
          width={200}
          height={200}
          className="h-12 md:h-16 w-auto"
        />
      </Link>

      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden z-20" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop navigation */}
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

      {/* Desktop auth buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="min-h-[40px]">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-400 hover:text-white min-h-[40px]">
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="min-h-[40px]">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 transition font-medium shadow-lg min-h-[40px]"
              >
                Try Free
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-scripton-dark/95 z-10 flex flex-col items-center justify-center md:hidden">
          <nav className="flex flex-col items-center gap-6 text-lg mb-8">
            <a
              href="#features"
              className="hover:text-scripton-cyan transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#playground"
              className="hover:text-scripton-cyan transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Playground
            </a>
            <a href="#pricing" className="hover:text-scripton-cyan transition" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-scripton-cyan transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
          </nav>

          <div className="flex flex-col items-center gap-4 w-full px-8">
            {user ? (
              <>
                <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full min-h-[48px] bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="text-gray-400 hover:text-white w-full min-h-[48px]"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full min-h-[48px] bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    size="lg"
                    className="w-full px-4 py-3 rounded-md bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 transition font-medium shadow-lg min-h-[48px]"
                  >
                    Try Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
