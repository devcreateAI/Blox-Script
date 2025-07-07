import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For hobbyists and new developers",
    features: ["5 script generations per day", "Access to standard AI models", "Community support"],
    buttonText: "Start for Free",
    buttonLink: "/auth/signup",
    isFeatured: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For serious developers and teams",
    features: [
      "Unlimited script generations",
      "Access to premium AI models (Claude Opus)",
      "Faster generation speeds",
      "Priority support",
    ],
    buttonText: "Go Pro",
    buttonLink: "/upgrade",
    isFeatured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Flexible Pricing for Every Creator</h2>
          <p className="mt-4 text-lg text-gray-400">Choose the plan that fits your development needs.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`voxel border-white/10 flex flex-col ${
                tier.isFeatured ? "border-scripton-cyan/50 shadow-[0_8px_24px_-4px_rgba(0,204,255,0.3)]" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-4xl font-bold pt-4">
                  {tier.price}
                  {tier.name !== "Free" && <span className="text-lg font-normal text-gray-400">/month</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-scripton-green" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.buttonLink}>
                  <Button
                    size="lg"
                    className={`w-full ${
                      tier.isFeatured ? "bg-gradient-to-r from-scripton-pink to-scripton-cyan hover:brightness-110" : ""
                    }`}
                    variant={tier.isFeatured ? "default" : "outline"}
                  >
                    {tier.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
