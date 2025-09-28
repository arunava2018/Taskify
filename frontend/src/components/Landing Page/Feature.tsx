import { FEATURES } from "@/constants";
import type { FC } from "react";

const Feature: FC = () => {
  return (
    <section
      id="features"
      className="lg:py-10 py-6 bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Header */}
      <div className="text-center mb-12 md:max-w-3xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          Everything you need to{" "}
          <span className="text-[var(--primary)]">get things done</span>
        </h2>
        <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
          Discover powerful tools designed to streamline your workflow and boost
          productivity
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map(({ id, title, description, icon: Icon }, index) => (
            <div
              key={id}
              className="group relative bg-[var(--card)] rounded-2xl p-6 shadow-sm border border-[var(--border)] hover:shadow-xl hover:border-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon Container */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-[var(--muted)] rounded-xl flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--card-foreground)] group-hover:text-[var(--primary)] transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/0 group-hover:from-[var(--primary)]/5 group-hover:to-[var(--primary)]/10 rounded-2xl transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
