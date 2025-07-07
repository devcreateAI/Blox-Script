import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, BrainCircuit, ShieldCheck, Code } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-8 h-8 text-scripton-green" />,
    title: "Instant Code Generation",
    description: "Get complex Roblox Lua scripts in seconds, not hours. Just describe what you need.",
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-scripton-cyan" />,
    title: "Powered by Advanced AI",
    description: "Utilizing state-of-the-art AI models to understand your requests and generate high-quality code.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-scripton-pink" />,
    title: "Secure & Reliable",
    description: "Generated scripts follow best practices for security and performance in the Roblox engine.",
  },
  {
    icon: <Code className="w-8 h-8 text-gray-400" />,
    title: "For All Skill Levels",
    description: "Whether you're a beginner or a pro, BloxScript accelerates your development workflow.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-scripton-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose BLOXSCRIPT?</h2>
          <p className="mt-4 text-lg text-gray-400">The ultimate toolkit for modern Roblox developers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="voxel border-white/10">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-transparent">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
