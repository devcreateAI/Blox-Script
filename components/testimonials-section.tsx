"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    quote: "Shipped my Roblox game 5× faster!",
    author: "Alex R.",
    role: "Indie Developer",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-cyan",
    delay: "720ms",
  },
  {
    quote: "Even my dev team uses BLOXSCRIPT for rapid systems.",
    author: "Jordan K.",
    role: "Studio Lead",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-pink",
    delay: "840ms",
  },
  {
    quote: "The AI understands Roblox better than most developers I know.",
    author: "Maya S.",
    role: "Game Designer",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-green",
    delay: "960ms",
  },
  {
    quote: "From idea to working script in seconds. This is the future!",
    author: "Carlos M.",
    role: "Technical Artist",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-cyan",
    delay: "1080ms",
  },
  {
    quote: "This saved me weeks of coding. The quality is incredible!",
    author: "Emma L.",
    role: "Full-Stack Developer",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-pink",
    delay: "1200ms",
  },
  {
    quote: "My students learn Roblox development 10x faster with this tool.",
    author: "Dr. James P.",
    role: "Computer Science Professor",
    avatar: "/placeholder.svg?height=48&width=48",
    ringColor: "ring-scripton-green",
    delay: "1320ms",
  },
  {
    name: "Dev_Jake",
    handle: "@jakerblx",
    avatar: "/placeholder-user.jpg",
    text: "BLOXSCRIPT is a game-changer. I can prototype ideas in minutes that used to take me hours. The generated code is surprisingly clean and efficient.",
  },
  {
    name: "StudioScripter",
    handle: "@studioscript",
    avatar: "/placeholder-user.jpg",
    text: "As a solo developer, this tool is like having a senior programmer on my team. It handles the boilerplate and lets me focus on the creative parts.",
  },
  {
    name: "LianaGFX",
    handle: "@lianagfx",
    avatar: "/placeholder-user.jpg",
    text: "I'm more of a designer, but BLOXSCRIPT has empowered me to bring my own ideas to life with code. It's incredibly intuitive!",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-scripton-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Roblox Creators</h2>
          <p className="mt-4 text-lg text-gray-400">See what developers are saying about BLOXSCRIPT.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="voxel border-white/10">
              <CardContent className="pt-6">
                {testimonial.text ? (
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    "
                    {testimonial.quote.includes("5×") ? (
                      <>
                        Shipped my Roblox game <span className="text-scripton-green">5× faster!</span>
                      </>
                    ) : testimonial.quote.includes("10x") ? (
                      <>
                        My students learn Roblox development <span className="text-scripton-cyan">10x faster</span> with
                        this tool.
                      </>
                    ) : (
                      testimonial.quote
                    )}
                    "
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author || testimonial.name}
                    />
                    <AvatarFallback>{(testimonial.author || testimonial.name).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author || testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role || testimonial.handle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
