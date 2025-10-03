import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LinkButton } from "@/components/LinkButton"
import {
  ListTodo,
  House,
  User,
  UserPlus,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react"
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import type { FC } from "react"
import { useTheme } from "@/theme/Themeprovides" 

const Navbar: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors border-b-2 duration-300 ${
        scrolled
          ? "bg-[var(--background)]/80 backdrop-blur border-b border-[var(--border)] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--ring)] transition-colors">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Taskify</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <LinkButton to="/" className="flex items-center gap-2">
              <House className="h-4 w-4" />
              <span>Home</span>
            </LinkButton>
          </Button>

          <Button variant="ghost" asChild>
            <a href="#features">Features</a>
          </Button>

          {/* Signed Out (Login & Sign Up) */}
          <SignedOut>
            <Button variant="ghost" asChild>
              <LinkButton to="/sign-in" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </LinkButton>
            </Button>

            <Button
              asChild
              className="ml-2 flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--ring)] text-white"
            >
              <LinkButton to="/sign-up">
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </LinkButton>
            </Button>
          </SignedOut>

          {/* Signed In (User Avatar / Menu) */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-[var(--foreground)]" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar Panel */}
          <div
            className={`fixed top-0 right-0 h-screen w-64 bg-[var(--background)] border-l border-[var(--border)] z-50 transform transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="font-bold text-lg text-[var(--foreground)]">Menu</h2>
              <button
                className="p-2 rounded-lg hover:bg-[var(--muted)]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-[var(--foreground)]" />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 py-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                onClick={() => setMobileOpen(false)}
              >
                <House className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <a
                href="#features"
                className="py-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>

              {/* Signed Out Links */}
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="flex items-center gap-2 py-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/sign-up"
                  className="flex items-center gap-2 py-2 bg-[var(--primary)] text-white rounded-lg px-3 hover:bg-[var(--ring)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </SignedOut>

              {/* Signed In User Menu */}
              <SignedIn>
                <div className="py-2 flex items-center gap-2 text-[var(--foreground)]">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-[var(--foreground)] hover:text-[var(--primary)]">
                    Profile
                  </span>
                </div>
              </SignedIn>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="mt-4 flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-blue-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

export default Navbar
