import { TESTIMONIALS } from '@/constants';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="lg:py-5 py-3 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="text-center mb-10 md:max-w-3xl max-w-2xl mx-auto p-2">
        <h2 className="text-5xl md:text-5xl lg:text-7xl font-bold mb-4">
          Loved by teams{' '}
          <span className="text-[var(--primary)]">everywhere</span>
        </h2>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          See what people are saying about their experience with Taskify
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(
            ({ id, name, role, company, feedback, avatar, rating }) => (
              <div
                key={id}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 text-left shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Feedback */}
                <blockquote className="text-[var(--muted-foreground)] mb-4 text-sm leading-relaxed">
                  “{feedback}”
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full border border-[var(--border)]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[var(--card-foreground)] truncate">
                      {name}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] truncate">
                      {role}
                    </p>
                    {company && (
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
