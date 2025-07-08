"use client"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-6 md:py-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundSize: "32px 32px",
          backgroundImage:
            "linear-gradient(90deg, #1a1a26 1px, transparent 1px), linear-gradient(#1a1a26 1px, transparent 1px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 relative">
        <span className="text-xs md:text-sm text-gray-400">© 2025 BLOXSCRIPT. All rights reserved.</span>

        <nav className="flex gap-4 md:gap-6 text-xs md:text-sm">
          <a href="#" className="hover:text-scripton-cyan transition">
            Terms
          </a>
          <a href="#" className="hover:text-scripton-cyan transition">
            Privacy
          </a>
          <a href="#" className="hover:text-scripton-cyan transition">
            Support
          </a>
        </nav>
      </div>
    </footer>
  )
}
