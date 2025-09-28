import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { FileText, Shield, Mail } from "lucide-react"

export function Terms() {
  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] px-3 py-1 rounded-md transition-colors"
        >
          Terms
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-[560px] max-h-[80vh] p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--primary)]" />
            <DialogTitle className="text-lg font-semibold text-[var(--foreground)]">
              Terms of Service
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[var(--muted-foreground)]">
            Effective: Sept 28, 2025 • Last Updated: Sept 28, 2025
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Scrollable Content */}
        <ScrollArea className="px-6 py-4 max-h-[55vh]">
          <div className="space-y-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {/* Intro */}
            <p>
              By using Taskify, you agree to follow these terms. Please read them carefully.
            </p>

            {/* Section: Usage */}
            <section>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--primary)]" />
                Usage
              </h3>
              <ul className="list-disc list-inside ml-1 mt-2 space-y-1">
                <li>Use Taskify only for lawful purposes</li>
                <li>Do not abuse or exploit the platform</li>
                <li>Respect the rights of other users</li>
              </ul>
            </section>

            {/* Section: Content */}
            <section>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--primary)]" />
                Content
              </h3>
              <ul className="list-disc list-inside ml-1 mt-2 space-y-1">
                <li>You own the content you create</li>
                <li>You grant Taskify permission to store & process it</li>
                <li>We may remove content that violates these terms</li>
              </ul>
            </section>

            {/* Section: Contact */}
            <section>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--destructive)]" />
                Contact
              </h3>
              <p className="mt-2">
                Questions? Email us at{" "}
                <a
                  href="mailto:support@taskify.com"
                  className="text-[var(--primary)] underline hover:no-underline"
                >
                  support@taskify.com
                </a>
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
