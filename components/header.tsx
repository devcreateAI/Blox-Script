"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function Header() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#playground", label: "Playground" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
  ]

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center mx-0 font-normal flex-row">
        <Image
          src="/images/bloxscript-full-logo.png"
          alt="BLOXSCRIPT"
          width={150}
          height={40}
          className="h-10 w-auto"
        />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 text-sm">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-scripton-cyan transition">
            {link.label}
          </a>
        ))}
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
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

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-[#0a0a12] border-l-white/10 p-0">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src="/images/bloxscript-full-logo.png"
                    alt="BLOXSCRIPT"
                    width={150}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col items-center justify-center flex-1 gap-8 text-lg">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a href={link.href} className="hover:text-scripton-cyan transition">
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="p-4 border-t border-white/10 flex flex-col gap-4">
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full border-white/20 bg-transparent">
                          Dashboard
                        </Button>
                      </Link>
                    </SheetClose>
                    <Button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/auth/signin">
                        <Button variant="outline" className="w-full border-white/20 bg-transparent">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/auth/signup">
                        <Button className="w-full bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110">
                          Try Free
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
