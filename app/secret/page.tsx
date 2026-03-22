'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecretBotanicalGarden } from '@/components/ui/secret-botanical-garden';

export default function Secret() {
  return (
    <main className="page-shell">
      <section className="mb-16 pb-10 md:mb-32 md:pb-24">
        <div className="space-y-8 md:space-y-12">
          <div className="pill w-fit">Secret</div>

          <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
            <h1 className="max-w-5xl font-[var(--font-playfair)] text-4xl leading-[1.06] tracking-tight text-white sm:text-5xl md:text-7xl">
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

      <section className="scroll-mt-20 flex min-h-[58vh] items-center justify-center md:min-h-[66vh]">
        <div className="mx-auto w-full max-w-5xl px-1 sm:px-2">
          <SecretBotanicalGarden />
        </div>
      </section>
    </main>
  );
}
