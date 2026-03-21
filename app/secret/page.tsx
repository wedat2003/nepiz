'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecretBotanicalGarden } from '@/components/ui/secret-botanical-garden';

export default function Secret() {
  return (
    <main className="page-shell">
      <section className="mb-40 pb-40 md:mb-56 md:pb-56">
        <div className="space-y-12 md:space-y-16">
          <div className="pill w-fit">Secret</div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="max-w-5xl font-[var(--font-playfair)] text-5xl leading-[1.04] tracking-tight text-white md:text-7xl">
              A secret garden Bloom
            </h1>

            <div>
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
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 flex min-h-[70vh] items-center justify-center">
        <div className="mx-auto w-full max-w-4xl">
          <SecretBotanicalGarden />
        </div>
      </section>
    </main>
  );
}
