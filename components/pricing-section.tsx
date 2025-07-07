"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CircleDollarSign, Hammer, CheckCircle } from "lucide-react"

const plans = [
  {
    name: "Free",
    icon: CircleDollarSign,
    iconColor: "text-scripton-green",
    description: "Get started with basic generation.",
    features: ["5 prompts / day", "Single-script output"],
    buttonText: "Start Free",
    buttonClass: "bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110",
    href: "/auth/signup",
    delay: "960ms",
  },
  {
    name: "Pro",
    icon: Hammer,
    iconColor: "text-scripton-pink",
    description: "Unlimited generation with advanced features.",
    features: ["Unlimited prompts", "Multi-script systems", "Advanced Code Analysis", "Priority support"],
    buttonText: "Upgrade to Pro",
    buttonClass: "bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110",
    href: "/auth/signup?plan=pro",
    delay: "1080ms",
    featured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-12 md:mb-14 text-center">
        Choose your plan
      </h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`fade voxel card3d rounded-lg p-8 md:p-10 ring-1 shadow-xl relative overflow-hidden ${
              plan.featured ? "ring-scripton-cyan/50" : "ring-white/10"
            }`}
            style={{ animationDelay: plan.delay }}
          >
            {plan.featured && (
              <div className="absolute inset-0 rounded-lg pointer-events-none animate-pulse bg-gradient-to-br from-scripton-pink/10 via-transparent to-scripton-green/10" />
            )}

            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 relative">
              <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
              {plan.name}
            </h3>

            <p className="text-gray-300 mb-6 relative">{plan.description}</p>

            <ul className="text-gray-300 space-y-3 text-sm mb-10 relative">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-scripton-green" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href={plan.href}>
              <Button
                className={`w-full px-4 py-2 rounded-md transition-all duration-200 font-medium relative ${plan.buttonClass} hover:scale-105 hover:shadow-lg`}
              >
                {plan.buttonText}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
