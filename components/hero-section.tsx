"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CodePreview } from "@/components/code-preview"

export function HeroSection() {
  return (
    <section id="hero" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Build Roblox Games Faster Than Ever
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
          Turn natural language prompts into advanced Roblox Lua code. Build faster, dream bigger with BLOXSCRIPT.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="px-8 py-3 rounded-md bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110 transition font-medium shadow-lg"
            >
              Start Generating for Free
            </Button>
          </Link>
          <Link href="#playground">
            <Button size="lg" variant="outline" className="border-white/20 bg-transparent">
              See it in Action
            </Button>
          </Link>
        </div>
      </div>
      <div id="playground" className="mt-12 md:mt-20">
        <CodePreview />
      </div>
    </section>
  )
}
