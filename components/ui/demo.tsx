"use client";

import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import type { JourneyEntry } from "@/lib/storage";

export function TimelineDemo({ entries }: { entries: JourneyEntry[] }) {
  const data = entries.map((entry) => ({
    title: new Date(entry.date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    content: (
      <div>
        <p className="mb-4 text-xs font-normal text-white/55 md:text-sm">
          {entry.title}
        </p>
        <p className="mb-6 max-w-3xl whitespace-pre-line text-sm font-normal leading-relaxed text-neutral-200 md:text-base">
          {entry.text}
        </p>
        {entry.location ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45 md:text-sm">
              {entry.location}
            </div>
          </div>
        ) : null}
        {entry.imageUrl ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Image
              src={entry.imageUrl}
              alt={entry.title}
              width={500}
              height={500}
              className="h-56 w-full rounded-2xl object-cover shadow-[0_24px_60px_rgba(0,0,0,0.2)] md:h-72"
              unoptimized
            />
            <Image
              src={entry.imageUrl}
              alt={entry.title}
              width={500}
              height={500}
              className="h-56 w-full rounded-2xl object-cover shadow-[0_24px_60px_rgba(0,0,0,0.2)] md:h-72"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    ),
  }));

  return <Timeline data={data} />;
}
