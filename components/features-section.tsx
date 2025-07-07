"use client"

import { Zap, Layers, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Prompt to Script in Seconds",
    description: "Instantly create production-ready Lua from plain English.",
    color: "text-scripton-green",
    delay: "360ms",
  },
  {
    icon: Layers,
    title: "Generate Multi-Script Systems",
    description: "Weapons, NPCs, UI & more — all interconnected automatically.",
    color: "text-scripton-pink",
    delay: "480ms",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Optimized Code",
    description: "Generates safe, server-validated code that's optimized for performance from the start.",
    color: "text-scripton-cyan",
    delay: "600ms",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-12 md:mb-14 text-center">
        Why developers choose BLOXSCRIPT
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="fade voxel card3d rounded-lg p-8 ring-1 ring-white/10 shadow-xl"
            style={{ animationDelay: feature.delay }}
          >
            <feature.icon className={`w-7 h-7 ${feature.color} mb-5`} />
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
