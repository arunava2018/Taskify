import { FAQS } from "@/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Faq() {
  return (
    <section className="lg:py-5 py-3 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="text-center mb-10 max-w-4xl mx-auto px-6">
        <h2 className="text-5xl md:text-5xl lg:text-7xl font-bold mb-4">
          Frequently Asked{" "}
          <span className="text-[var(--primary)]">Questions</span>
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Everything you need to know about using Taskify
        </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-6">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map(({ id, question, answer }) => (
            <AccordionItem
              key={id}
              value={`faq-${id}`}
              className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--card)]"
            >
              <AccordionTrigger className="px-4 py-3 text-[var(--card-foreground)] font-medium hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[var(--muted-foreground)] text-sm leading-relaxed">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
