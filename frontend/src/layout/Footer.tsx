import type { FC } from "react"
import { ListTodo } from "lucide-react"
import { Link } from "react-router-dom"
import { Privacy } from "@/components/Landing Page/Privacy"
import { Terms } from "@/components/Landing Page/Term"

const Footer: FC = () => {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] mt-5 ransition-colors duration-200">
      <div className="max-w-6xl mx-auto p-3 ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--ring)] transition-colors">
                <ListTodo className="h-4 w-4 text-[var(--primary-foreground)]" />
              </div>
              <span className="text-lg font-bold text-[var(--foreground)]">Taskify</span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)]">
              Made for teams who value simplicity and collaboration
            </p>
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            aria-label="Footer navigation"
          >
            <Privacy/>
             <Terms/>
            <a
              href="/contact"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="pt-6 text-center md:text-left">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Taskify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
