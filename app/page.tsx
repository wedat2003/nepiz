'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RomanticMenuPanel } from '@/components/ui/romantic-menu-panel';
import { MusicPlayerBlock } from '@/components/ui/music-player-block';
import {
  ArrowRight,
  Dice6,
  Gift,
  Heart,
  Image as ImageIcon,
  Lock,
  MailOpen,
  MapPin,
  MoonStar,
  Route,
  TimerReset,
} from 'lucide-react';
import { removeFromStorage, signOutCloud, type Counter } from '@/lib/storage';
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

const menuItems = [
  {
    title: 'Gallery',
    description: 'Your own photos, videos and shared moments in a curated space.',
    href: '/media',
    icon: ImageIcon,
    label: 'Gallery',
  },
  {
    title: 'Roulette',
    description: 'Spin and get your next date idea with a playful roulette animation.',
    href: '/date-idea-roulette',
    icon: Dice6,
    label: 'Spin',
  },
  {
    title: 'Wish List',
    description: 'Collect wishes and little dreams you want to do together.',
    href: '/wishlist',
    icon: Gift,
    label: 'Goals',
  },
  {
    title: 'Open When',
    description: 'Open letters for moments when you need comfort, courage, or a smile.',
    href: '/open-when',
    icon: MailOpen,
    label: 'Letters',
  },
  {
    title: 'Our Journey',
    description: 'Your shared story as a timeline built from your own moments and memories.',
    href: '/journey',
    icon: Route,
    label: 'Timeline',
  },
  {
    title: 'Map of Us',
    description: 'Pins for your places, notes and coordinates in one shared map page.',
    href: '/map-of-us',
    icon: MapPin,
    label: 'Places',
  },
  {
    title: 'Counter',
    description: 'A live relationship timer you can set from your own start date.',
    href: '/counters',
    icon: TimerReset,
    label: 'Together',
  },
];

export default function Home() {
  const router = useRouter();
  const [activeHref, setActiveHref] = useState(menuItems[0].href);
  const [now, setNow] = useState(() => Date.now());
  const counters = useStoredCollection<Counter>('counters', []);

  const homeCounters = useMemo(() => {
    const firstExtra = counters[0];
    return firstExtra ? [DEFAULT_COUNTER, firstExtra] : [DEFAULT_COUNTER];
  }, [counters]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleLogout = () => {
    signOutCloud();
    removeFromStorage('loginSession');
    router.replace('/login');
  };

  return (
    <main className="landing-page">
      <div className="landing-page__ambient landing-page__ambient--one" />
      <div className="landing-page__ambient landing-page__ambient--two" />

      <div className="landing-shell max-w-6xl mx-auto px-6 py-20 space-y-16">
        <header className="landing-topbar">
          <div className="landing-topbar__brand">
            <span className="landing-topbar__eyebrow">Private romantic space</span>
            <p className="leading-relaxed">A quiet place for the two of you.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/secret')}
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              aria-label="Open secret"
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button onClick={handleLogout} variant="outline" className="h-11 rounded-full px-14">
              Log out
            </Button>
          </div>
        </header>

        <section className="landing-stage">
          <section className="landing-hero">
            <div className="landing-hero__content">
              <span className="landing-hero__eyebrow">Made with love, not built like a dashboard</span>
              <h1>A digital space that feels intentional, intimate and refined.</h1>
              <p className="leading-relaxed">
                A little home for us: soft, warm and full of love. All our memories,
                special places and shared moments are together here, simple and sweet.
              </p>

              <div className="landing-hero__actions">
                <Button
                  size="lg"
                  className="landing-hero__primary"
                  onClick={() => router.push('/media')}
                >
                  Open Gallery
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="landing-hero__secondary"
                  onClick={() => router.push('/date-idea-roulette')}
                >
                  Spin Date Idea
                </Button>
              </div>

              <div className="landing-hero__line" />
            </div>
          </section>

          <aside className="landing-nav">
            <RomanticMenuPanel
              activeHref={activeHref}
              items={menuItems}
              onNavigate={(href) => {
                setActiveHref(href);
                router.push(href);
              }}
            />
          </aside>
        </section>

        <section className="landing-secondary">
          <article className="landing-private">
            <div className="landing-private__label">
              <Heart className="h-4 w-4" />
              Private space
            </div>
            <h2>A quieter space meant for the two of you, not for everyone.</h2>
            <p className="leading-relaxed">
              This should not feel like an app. It should feel like a carefully composed
              room: fewer elements, better spacing and a stronger sense of care.
            </p>
          </article>

          <article className="landing-note">
            <div className="landing-note__icon">
              <MoonStar className="h-4 w-4" />
            </div>
            <div className="landing-note__body">
              <span>Live Counter</span>
              <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-6">
                {homeCounters.map((counter) => {
                  const start = parseStartPoint(counter.targetLocal);
                  if (!start) return null;
                  const elapsedSeconds = Math.max(0, Math.floor((now - start.getTime()) / 1_000));
                  const stats = {
                    days: Math.floor(elapsedSeconds / 86_400),
                    hours: Math.floor((elapsedSeconds % 86_400) / 3_600),
                    minutes: Math.floor((elapsedSeconds % 3_600) / 60),
                    seconds: elapsedSeconds % 60,
                  };

                  return (
                    <div key={counter.id} className="space-y-6 rounded-2xl border border-transparent bg-transparent p-6 md:p-8">
                      <strong className="block text-center">{counter.title}</strong>
                      <div className="grid grid-cols-4 gap-6">
                        <div className="px-4 py-4 text-center">
                          <p className="font-[var(--font-playfair)] text-2xl leading-none text-white">{stats.days}</p>
                          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] leading-relaxed text-white/60">Days</p>
                        </div>
                        <div className="px-4 py-4 text-center">
                          <p className="font-[var(--font-playfair)] text-2xl leading-none text-white">{formatTwoDigits(stats.hours)}</p>
                          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] leading-relaxed text-white/60">Hours</p>
                        </div>
                        <div className="px-4 py-4 text-center">
                          <p className="font-[var(--font-playfair)] text-2xl leading-none text-white">{formatTwoDigits(stats.minutes)}</p>
                          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] leading-relaxed text-white/60">Minutes</p>
                        </div>
                        <div className="px-4 py-4 text-center">
                          <p className="font-[var(--font-playfair)] text-2xl leading-none text-white">{formatTwoDigits(stats.seconds)}</p>
                          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] leading-relaxed text-white/60">Seconds</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        </section>

        <MusicPlayerBlock />
      </div>
    </main>
  );
}
