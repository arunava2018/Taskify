import type { FC } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Users, Globe } from "lucide-react"

const HeroSection: FC = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14 text-center">
      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--primary)]" />
          <span>40M+ users</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[var(--primary)]" />
          <span>180+ countries</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
          <span>99.9% uptime</span>
        </div>
      </div>

      {/* Main headline */}
      <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] mb-6 tracking-tight max-w-3xl mx-auto leading-[0.9]">
        The <span className="text-[var(--primary)]">simple</span> way to manage{" "}
        <span className="relative inline-block">
          everything
          <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[var(--accent)] opacity-30 -rotate-1 rounded-sm" />
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto leading-relaxed">
        Streamline your personal tasks, family projects, and team workflows in
        one powerful platform.{" "}
        <span className="font-semibold text-[var(--foreground)]">
          Trusted by millions worldwide.
        </span>
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <Button
          size="lg"
          className="group px-8 py-6 text-lg font-semibold rounded-xl 
          bg-[var(--primary)] text-white 
          hover:bg-[var(--ring)] shadow-lg hover:shadow-xl 
          transform hover:scale-105 transition-all duration-200"
        >
          Start Free Today
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">
        ✨ Free Forever • No Credit Card Required
      </p>
    </main>
  )
}

export default HeroSection
