"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dice6,
  Gift,
  Heart,
  Image as ImageIcon,
  Lock,
  MapPin,
} from "lucide-react";

const highlights = [
  {
    title: "Private space",
    description:
      "Ein ruhiger, hochwertiger digitaler Ort für Erinnerungen, Nähe und Dinge, die nur euch gehören.",
  },
];

const menuItems = [
  {
    id: "secret",
    title: "Secret",
    subtitle: "Private area",
    description:
      "Ein besonders geschützter Bereich mit einer stillen, intimen Atmosphäre.",
    href: "/secret",
    icon: Lock,
    label: "Featured",
  },
  {
    id: "gallery",
    title: "Gallery",
    subtitle: "Photos & Videos",
    description:
      "Your own uploads, moments and memories in one curated place.",
    href: "/media",
    icon: ImageIcon,
    label: "Gallery",
  },
  {
    id: "date-idea-roulette",
    title: "Date Idea Roulette",
    subtitle: "Spin & pick",
    description: "A roulette animation that picks your next date idea.",
    href: "/date-idea-roulette",
    icon: Dice6,
    label: "Spin",
  },
  {
    id: "wishlist",
    title: "Wish List",
    subtitle: "Shared wishes",
    description: "Add wishes and mark what you have already done together.",
    href: "/wishlist",
    icon: Gift,
    label: "Goals",
  },
  {
    id: "map-of-us",
    title: "Map of Us",
    subtitle: "Your places",
    description: "Save meaningful places with coordinates and notes.",
    href: "/map-of-us",
    icon: MapPin,
    label: "Places",
  },
];

export function GlassmorphismListenAppBlock() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = menuItems[activeIndex];
  const ActiveIcon = activeItem.icon;

  return (
    <section className="relative overflow-hidden px-3 py-8 md:px-4 md:py-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-foreground/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-foreground/[0.02] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <Card className="relative overflow-hidden border border-border/50 bg-background/40 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.25)] backdrop-blur-2xl md:p-10 xl:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.05] via-transparent to-transparent" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-10">
              <div className="space-y-5">
                <Badge
                  variant="outline"
                  className="w-fit border-border/60 bg-background/40 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur"
                >
                  private romantic website
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                    Ein ruhiger Ort für Erinnerungen, Nähe und eure eigenen kleinen Welten.
                  </h1>
                  <p className="max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
                    Eine moderne, private Oberfläche mit klarer Übersicht: Galerie,
                    Events, Posts und ein geschützter Bereich für alles, was bewusst
                    nur euch beiden gehört.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base"
                  onClick={() => router.push("/media")}
                >
                  Galerie öffnen
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full px-8 text-base hover:bg-foreground/5"
                  onClick={() => router.push(activeItem.href)}
                >
                  Aktiven Bereich öffnen
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-1">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="group h-full rounded-3xl border border-border/40 bg-background/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground/80">
                      <Heart className="h-4 w-4" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border/40 bg-background/70 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-foreground/30 via-foreground/10 to-transparent">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />
                    <ActiveIcon className="relative z-10 h-8 w-8 text-foreground" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">
                          Highlighted section
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                          {activeItem.title}
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {activeItem.subtitle}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-border/40 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground/55"
                      >
                        {activeItem.label}
                      </Badge>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
                      {activeItem.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full border-border/50 bg-background/60 px-4 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur hover:text-foreground"
                      onClick={() => router.push(activeItem.href)}
                    >
                      Bereich öffnen
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="flex items-center justify-between text-xs font-medium tracking-wide text-foreground/50">
                    <span>Overview</span>
                    <span>Focused</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-foreground to-foreground/40 transition-[width]"
                      style={{ width: `${30 + activeIndex * 20}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="space-y-3">
                  {menuItems.map((item, index) => {
                    const isActive = index === activeIndex;
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-center gap-4 rounded-3xl border border-border/40 bg-background/60 p-5 text-left backdrop-blur-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                          isActive
                            ? "border-foreground/40 bg-foreground/[0.08] shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
                            : "hover:-translate-y-1 hover:border-border/60"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/40 transition-colors ${
                            isActive
                              ? "bg-foreground/20 text-foreground"
                              : "bg-background/70 text-foreground/70"
                          }`}
                        >
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground/90">
                              {item.title}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {item.subtitle}
                            </p>
                          </div>
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
                            {item.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
