"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { User, Settings, LogOut, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react"

interface DashboardHeaderProps {
  user: any
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-white/10 bg-scripton-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/bloxscript-full-logo.png"
            alt="BLOXSCRIPT"
            width={160}
            height={80}
            className="h-10 md:h-16 w-auto"
          />
        </Link>

        {/* Mobile menu button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-400">Plan: </span>
            <span className={`font-medium ${user?.plan === "pro" ? "text-scripton-pink" : "text-scripton-green"}`}>
              {user?.plan === "pro" ? "Pro" : "Free"}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 min-h-[44px]">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.email || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-scripton-card border-white/10">
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu (expanded) */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-scripton-card border-b border-white/10 p-4 z-50 md:hidden">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan: </span>
                <span className={`font-medium ${user?.plan === "pro" ? "text-scripton-pink" : "text-scripton-green"}`}>
                  {user?.plan === "pro" ? "Pro" : "Free"}
                </span>
              </div>
              <div className="text-sm text-gray-300">{user?.email || "User"}</div>
              <Link href="/settings" className="flex items-center py-2">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
              <button onClick={signOut} className="flex items-center py-2 text-red-400">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
