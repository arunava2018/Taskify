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
import { Shield, Lock, Users, Mail } from "lucide-react"

export function Privacy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] px-3 py-1 rounded-md transition-all"
        >
          Privacy
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] max-h-[80vh] p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--primary)]" />
            <DialogTitle className="text-lg font-semibold text-[var(--foreground)]">
              Privacy Policy
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
            <p>
              We collect minimal data to provide Taskify’s services, never sell your
              information, and give you control over your data.
            </p>

            {/* Section: What We Collect */}
            <div>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--primary)]" /> What We Collect
              </h3>
              <ul className="list-disc list-inside ml-1 mt-2 space-y-1">
                <li>Account info: name, email (passwords encrypted)</li>
                <li>Task data: tasks, notes, due dates, collaborators</li>
                <li>Usage analytics: anonymized patterns only</li>
              </ul>
            </div>

            {/* Section: Security */}
            <div>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--destructive)]" /> Security
              </h3>
              <ul className="list-disc list-inside ml-1 mt-2 space-y-1">
                <li>Encryption in transit & at rest</li>
                <li>Secure authentication & monitoring</li>
                <li>Regular audits & backups</li>
              </ul>
            </div>

            {/* Section: Contact */}
            <div>
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--primary)]" /> Contact
              </h3>
              <p className="mt-2">
                Questions? Email us at{" "}
                <a
                  href="mailto:privacy@taskify.com"
                  className="text-[var(--primary)] underline hover:no-underline"
                >
                  privacy@taskify.com
                </a>
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
