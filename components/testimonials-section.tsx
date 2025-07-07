"use client"

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
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#101018] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-12 md:mb-14 text-center">
          Loved by Roblox creators and More
        </h2>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="fade voxel card3d rounded-lg p-6 ring-1 ring-white/10 shadow-xl"
              style={{ animationDelay: testimonial.delay }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 ring-2 ${testimonial.ringColor} flex-shrink-0 flex items-center justify-center`}
                >
                  <span className="text-white font-semibold text-sm">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
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
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-hide snap-x snap-mandatory">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className="fade voxel card3d rounded-lg p-6 ring-1 ring-white/10 shadow-xl w-[80vw] sm:w-[45vw] flex-shrink-0 snap-start"
                style={{ animationDelay: testimonial.delay }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 ring-2 ${testimonial.ringColor} flex-shrink-0 flex items-center justify-center`}
                  >
                    <span className="text-white font-semibold text-sm">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
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
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-4">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span>←</span>
              Scroll to see more testimonials
              <span>→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
