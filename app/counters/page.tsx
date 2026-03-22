'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Counter } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

const DEFAULT_COUNTER: Counter = {
  id: 'default-counter',
  title: 'Since we have been together',
  targetLocal: '2025-09-21T00:00',
  mode: 'countup',
  createdAt: new Date('2025-09-21T00:00').getTime(),
};

function parseStartPoint(value: string) {
  if (!value) return null;
  const normalized = value.includes('T') ? value : `${value}T00:00`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTwoDigits(value: number) {
  return String(value).padStart(2, '0');
}

function getCounterStats(counter: Counter, now: number) {
  const start = parseStartPoint(counter.targetLocal);
  if (!start) return null;

  const deltaMs =
    counter.mode === 'countdown'
      ? start.getTime() - now
      : now - start.getTime();
  const isActive = deltaMs >= 0;
  const elapsedSeconds = isActive ? Math.floor(deltaMs / 1_000) : 0;

  return {
    isActive,
    days: Math.floor(elapsedSeconds / 86_400),
    hours: Math.floor((elapsedSeconds % 86_400) / 3_600),
    minutes: Math.floor((elapsedSeconds % 3_600) / 60),
    seconds: elapsedSeconds % 60,
  };
}

export default function CountersPage() {
  const counters = useStoredCollection<Counter>('counters', []);
  const [now, setNow] = useState(() => Date.now());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const displayCounters = [DEFAULT_COUNTER, ...counters];

  const showEditor = isEditorOpen;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="page-shell max-w-6xl mx-auto px-4 py-12 space-y-10 md:px-6 md:py-20 md:space-y-16">
      <section className="space-y-10 pb-12 md:pb-16">
        <div className="space-y-10">
          <div className="pill w-fit">Counter</div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="max-w-5xl font-[var(--font-playfair)] text-4xl leading-[1.06] tracking-tight text-white sm:text-5xl md:text-7xl">
              Counter
            </h1>

            <div className="flex flex-wrap items-center justify-end gap-6">
              <Button
                asChild
                variant="outline"
                className="h-12 w-fit min-w-[12rem] rounded-full border-white/10 bg-white/5 px-10 text-sm font-medium text-white hover:bg-white/10"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back Home
                </Link>
              </Button>

              <Button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                className="h-12 w-fit min-w-[14rem] rounded-full border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-8 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)]"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Time Entry
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 flex min-h-[70vh] items-center justify-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10">
          {displayCounters.map((counter) => {
            const stats = getCounterStats(counter, now);

            return (
              <div
                key={counter.id}
                className="mx-auto w-full max-w-2xl rounded-2xl border border-white/35 bg-transparent p-6 md:p-8"
              >
                {!stats ? (
                  <div className="grid min-h-[12rem] place-items-center text-center">
                    <p className="text-base leading-relaxed text-white/70">
                      No time entry yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <p className="text-base leading-relaxed text-white/78">{counter.title}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/60">
                      {counter.mode === 'countdown' ? 'Future time' : 'Past time'}
                    </p>
                    <div className="mx-auto flex w-full items-center justify-between gap-6">
                      <div className="min-w-0 flex-1 text-center">
                        <p className="font-[var(--font-playfair)] text-4xl text-white md:text-5xl">
                          {stats.days}
                        </p>
                        <p className="mt-4 text-sm italic leading-relaxed text-white/80">Days</p>
                      </div>
                      <div className="h-14 w-px shrink-0 bg-white/20" />
                      <div className="min-w-0 flex-1 text-center">
                        <p className="font-[var(--font-playfair)] text-4xl text-white md:text-5xl">
                          {formatTwoDigits(stats.hours)}
                        </p>
                        <p className="mt-4 text-sm italic leading-relaxed text-white/80">Hours</p>
                      </div>
                      <div className="h-14 w-px shrink-0 bg-white/20" />
                      <div className="min-w-0 flex-1 text-center">
                        <p className="font-[var(--font-playfair)] text-4xl text-white md:text-5xl">
                          {formatTwoDigits(stats.minutes)}
                        </p>
                        <p className="mt-4 text-sm italic leading-relaxed text-white/80">Minutes</p>
                      </div>
                      <div className="h-14 w-px shrink-0 bg-white/20" />
                      <div className="min-w-0 flex-1 text-center">
                        <p className="font-[var(--font-playfair)] text-4xl text-white md:text-5xl">
                          {formatTwoDigits(stats.seconds)}
                        </p>
                        <p className="mt-4 text-sm italic leading-relaxed text-white/80">Seconds</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {showEditor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-6 backdrop-blur-[2px]">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#1b1232f2] shadow-[0_30px_90px_rgba(0,0,0,0.48)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
              className="absolute right-6 top-6 h-10 w-10 rounded-xl border-white/25 bg-white/8 p-0 text-white hover:bg-white/12"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <Button
              type="button"
              className="absolute bottom-6 right-6 h-10 min-w-[8.5rem] rounded-xl border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-6 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)]"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <div className="grid min-h-[36rem] place-items-center p-10 md:p-12">
              <div className="relative w-full max-w-xl pt-10">
                <h2 className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 text-center text-2xl font-medium leading-relaxed text-white md:-top-32 md:text-3xl">
                  Create Counter
                </h2>
                <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                    Counter Title
                  </label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
                  />
                </div>

                <div className="mt-12 space-y-3">
                  <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition focus:border-white/50"
                  />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
