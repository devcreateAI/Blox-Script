"use client"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundSize: "32px 32px",
          backgroundImage:
            "linear-gradient(90deg, #1a1a26 1px, transparent 1px), linear-gradient(#1a1a26 1px, transparent 1px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 relative text-center md:text-left">
        <span className="text-sm text-gray-400">© 2025 BLOXSCRIPT. All rights reserved.</span>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
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
