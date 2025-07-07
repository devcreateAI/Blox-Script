import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-scripton-card/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/bloxscript-full-logo.png"
                alt="BLOXSCRIPT"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/auth/signin" className="hover:text-white">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-white">
              Sign Up
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BLOXSCRIPT. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
