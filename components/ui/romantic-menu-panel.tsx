"use client";

import { type LucideIcon } from "lucide-react";

export interface RomanticMenuItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  label?: string;
}

interface RomanticMenuPanelProps {
  featured?: RomanticMenuItem;
  items: RomanticMenuItem[];
  activeHref?: string;
  onNavigate: (href: string) => void;
}

export function RomanticMenuPanel({
  featured,
  items,
  activeHref,
  onNavigate,
}: RomanticMenuPanelProps) {
  return (
    <div className="relative z-10 grid h-full content-start gap-10 px-6 md:gap-12 md:px-8">
      <div className="space-y-6">
        <span className="text-[11px] uppercase tracking-[0.24em] text-white/55">
          Main menu
        </span>
        <div className="space-y-6">
          <h2 className="max-w-[12ch] font-[var(--font-playfair)] text-4xl leading-none text-white md:text-5xl">
            Choose your next space.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/65 md:text-[15px]">
            Everything important stays clear, calm and easy to reach without
            feeling cramped.
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      <div className="grid gap-6">
        {featured ? (
          <button
            type="button"
            aria-label={featured.title}
            onClick={() => onNavigate(featured.href)}
            className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.08] md:p-8"
          >
            <div className="relative flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-white/6 px-12 py-12 text-center md:px-16 md:py-16">
              <div className="absolute left-8 top-8 md:left-10 md:top-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white md:h-[3.25rem] md:w-[3.25rem]">
                  <featured.icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mx-auto max-w-[21rem] space-y-6">
                <div className="space-y-4">
                  <h3 className="font-[var(--font-playfair)] text-[1.9rem] text-white md:text-[2.05rem]">
                    {featured.title}
                  </h3>
                  <p className="mx-auto max-w-[20rem] text-[13px] leading-relaxed text-white/68 md:text-[14px]">
                    {featured.description}
                  </p>
                </div>

                <div className="flex justify-center pt-4">
                  <span className="inline-flex h-12 min-w-[11rem] items-center justify-center rounded-full border border-white/15 bg-white/6 px-8 text-xs uppercase tracking-[0.18em] text-white/75 transition-colors group-hover:bg-white/10 group-hover:text-white">
                    Open space
                  </span>
                </div>
              </div>
            </div>
          </button>
        ) : null}

        {items.map((item) => {
          const ItemIcon = item.icon;
          const isActive = activeHref === item.href;

          return (
            <button
              key={item.href}
              type="button"
              aria-label={item.title}
              onClick={() => onNavigate(item.href)}
              className={`group rounded-2xl border p-6 text-left transition-all duration-300 md:p-8 ${
                isActive
                  ? "border-white/18 bg-white/[0.08] shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
                  : "border-white/8 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.05]"
              }`}
            >
              <div className="relative flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border border-white/6 px-12 py-12 text-center md:px-16 md:py-16">
                <div className="absolute left-8 top-8 md:left-10 md:top-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white md:h-[3.25rem] md:w-[3.25rem]">
                    <ItemIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mx-auto max-w-[21rem] space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-[var(--font-playfair)] text-[1.9rem] text-white md:text-[2.05rem]">
                      {item.title}
                    </h3>
                    <p className="mx-auto max-w-[20rem] text-[13px] leading-relaxed text-white/68 md:text-[14px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
