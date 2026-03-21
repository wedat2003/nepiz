'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DateIdeaRoulettePage() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState('');
  const [ideas, setIdeas] = useState<string[]>([
    'Sunset walk + ice cream',
    'Cook dinner together',
    'Movie night at home',
    'Try a new cafe',
    'Mini road trip',
    'Museum date',
  ]);

  const safePrizeNumber = ideas.length > 0 ? Math.min(prizeNumber, ideas.length - 1) : 0;
  const segmentAngle = ideas.length > 0 ? 360 / ideas.length : 360;
  const wheelBackground = useMemo(() => {
    if (ideas.length === 0) return 'transparent';
    const colors = [
      '#4c1d95',
      '#6d28d9',
      '#7e22ce',
      '#86198f',
      '#a21caf',
      '#be185d',
      '#db2777',
      '#e11d48',
      '#9333ea',
      '#8b5cf6',
      '#7c3aed',
      '#c026d3',
    ];
    const stops = ideas
      .map((_, index) => {
        const start = index * segmentAngle;
        const end = (index + 1) * segmentAngle;
        const color = colors[index % colors.length];
        return `${color} ${start}deg ${end}deg`;
      })
      .join(', ');
    return `conic-gradient(from -90deg, ${stops})`;
  }, [ideas, segmentAngle]);

  const handleSpin = () => {
    if (mustSpin || ideas.length === 0) return;
    const nextPrize = Math.floor(Math.random() * ideas.length);
    const targetCenterAngle = nextPrize * segmentAngle + segmentAngle / 2;
    const targetRotation = 360 - targetCenterAngle;
    const fullTurns = 360 * 6;
    const nextRotation = wheelRotation + fullTurns + targetRotation;
    setPrizeNumber(nextPrize);
    setWheelRotation(nextRotation);
    setMustSpin(true);
    setSelectedIdea(null);
    window.setTimeout(() => {
      setMustSpin(false);
      setSelectedIdea(ideas[nextPrize] ?? null);
    }, 4200);
  };

  const handleAddIdea = () => {
    const value = newIdea.trim();
    if (!value) return;
    setIdeas((current) => [...current, value]);
    setNewIdea('');
  };

  const handleDeleteIdea = (index: number) => {
    setIdeas((current) => {
      const next = current.filter((_, i) => i !== index);
      if (next.length === 0) {
        setMustSpin(false);
        setPrizeNumber(0);
        setWheelRotation(0);
        setSelectedIdea(null);
      } else if (prizeNumber >= next.length) {
        setPrizeNumber(0);
      }
      return next;
    });
  };

  return (
    <main className="page-shell max-w-6xl mx-auto px-6 py-20 space-y-16">
      <section className="space-y-10 pb-12 md:pb-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="max-w-4xl font-[var(--font-playfair)] text-5xl leading-[1.04] tracking-tight text-white md:text-7xl">
            Date Idea Roulette
          </h1>
          <Button
            asChild
            variant="outline"
            className="h-12 min-w-[11rem] rounded-full border-white/10 bg-white/5 px-8 text-sm font-medium text-white hover:bg-white/10"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>
      </section>

      <section className="flex min-h-[72vh] items-center justify-center">
        <div className="mx-auto grid w-full max-w-6xl gap-8 xl:grid-cols-2">
          <article className="w-full rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
            <div className="flex flex-col items-center justify-center gap-8 rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
              <div className="relative mx-auto aspect-square w-full max-w-[34rem] [&>div]:!h-full [&>div]:!w-full [&>div]:!max-h-none [&>div]:!max-w-none">
                {ideas.length > 0 ? (
                  <div className="relative h-full w-full">
                    <div className="absolute left-1/2 top-1 z-10 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-fuchsia-100 drop-shadow-[0_0_12px_rgba(244,114,182,0.65)]" />
                    <div
                      className="relative h-full w-full rounded-full border-[9px] border-fuchsia-200/80 shadow-[0_0_0_1px_rgba(255,255,255,0.45)_inset]"
                      style={{
                        background: wheelBackground,
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: mustSpin ? 'transform 4.2s cubic-bezier(0.18, 0.84, 0.16, 1)' : 'none',
                      }}
                    >
                      {ideas.map((idea, index) => (
                        <div
                          key={`${idea}-${index}`}
                          className="absolute left-1/2 top-1/2 w-[44%] -translate-y-1/2 origin-left text-center text-[11px] font-medium text-white"
                          style={{ transform: `rotate(${index * segmentAngle + segmentAngle / 2 - 90}deg)` }}
                        >
                          <span className="block -translate-y-1/2 rounded-md bg-black/20 px-2 py-1 backdrop-blur-sm">
                            {idea.length > 22 ? `${idea.substring(0, 22).trimEnd()}...` : idea}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid h-full w-full place-items-center rounded-2xl border border-white/10 bg-white/[0.02]">
                    <p className="text-sm text-white/70">Add at least one idea</p>
                  </div>
                )}

                {ideas.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleSpin}
                    disabled={mustSpin}
                    className="absolute left-1/2 top-1/2 z-[9] h-20 w-20 -translate-x-[55%] -translate-y-[55%] rounded-[5rem] border-none bg-white text-xs font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Spin
                  </button>
                ) : null}
              </div>

              <div className="mx-auto w-full max-w-[30rem] rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/20 px-8 py-6 text-center backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-100/85">Selected idea</p>
                <p className="mt-4 text-base leading-relaxed text-white">
                  {mustSpin
                    ? 'Spinning...'
                    : ideas.length === 0
                      ? 'Add ideas to enable the roulette'
                      : selectedIdea ?? `Spin to pick a date idea (${ideas[safePrizeNumber] ?? ''})`}
                </p>
              </div>
            </div>
          </article>

          <article className="w-full rounded-2xl border border-white/12 bg-transparent p-6 md:p-8">
            <div className="grid min-h-[46rem] rounded-2xl border border-transparent bg-white/[0.02] p-8 md:p-10">
              <div className="flex h-full w-full flex-col items-center gap-8">
                <p className="text-center text-xs uppercase tracking-[0.18em] text-white/78">Add Idea</p>
                <div className="mx-auto w-full max-w-sm">
                  <input
                    value={newIdea}
                    onChange={(event) => setNewIdea(event.target.value)}
                    placeholder="Your new date idea..."
                    className="h-14 w-full rounded-xl border border-white/35 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/65 focus:border-white/55"
                  />
                </div>
                <div className="mx-auto w-full max-w-sm">
                  <div className="mt-12 space-y-3">
                    {ideas.map((idea, index) => (
                      <div
                        key={`${idea}-${index}`}
                        className="flex h-9 items-center justify-between rounded-xl border border-white/20 bg-black/25 px-4"
                      >
                        <p className="text-sm leading-none text-white/95">{`\u00A0\u00A0\u00A0\u00A0${idea}`}</p>
                        <button
                          type="button"
                          onClick={() => handleDeleteIdea(index)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-white/75 transition hover:bg-red-500/20 hover:text-red-300"
                          aria-label={`Delete ${idea}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex w-full justify-center">
                  <Button
                    type="button"
                    onClick={handleAddIdea}
                    className="h-12 min-w-[11rem] rounded-full border-0 bg-[linear-gradient(135deg,#c026d3,#7c3aed)] px-8 text-sm font-medium text-white shadow-[0_14px_32px_rgba(124,58,237,0.35)]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Idea
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
