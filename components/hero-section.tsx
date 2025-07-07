"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
      <div className="text-center relative">
        <h1 className="fade text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 max-w-4xl mx-auto">
          Instant Roblox Lua Scripts from Your Ideas.
        </h1>

        <p
          className="fade text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          style={{ animationDelay: "120ms" }}
        >
          Turn natural language prompts into advanced Roblox code. Build faster, dream bigger with BLOXSCRIPT.
        </p>

        <div
          className="fade flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{ animationDelay: "240ms" }}
        >
          <Link href="/auth/signup">
            <Button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-scripton-green to-scripton-cyan hover:brightness-110 transition font-medium shadow-xl text-lg">
              <Rocket className="w-5 h-5" />
              Try BLOXSCRIPT Free
            </Button>
          </Link>

          <Link href="#playground">
            <Button
              variant="outline"
              className="px-8 py-4 rounded-lg border-white/20 hover:border-scripton-cyan/50 bg-transparent text-lg"
            >
              See Examples
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
