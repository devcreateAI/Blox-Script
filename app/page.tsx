import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CodePreview } from "@/components/code-preview"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <CodePreview />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
