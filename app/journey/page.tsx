'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Timeline } from '@/components/ui/timeline';
import {
  deleteCloudMediaByPath,
  generateId,
  loadFromStorage,
  saveToStorage,
  type JourneyEntry,
  type MapPlace,
  uploadMediaFileToCloud,
} from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

function sortEntries(a: JourneyEntry, b: JourneyEntry) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function formatEntryDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPlaceId, setNewPlaceId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newText, setNewText] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaPath, setNewMediaPath] = useState('');
  const [newMediaError, setNewMediaError] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | null>(null);
  const mapPlaces = useStoredCollection<MapPlace>('mapPlaces', []);
  const sortedMapPlaces = useMemo(
    () => [...mapPlaces].sort((a, b) => b.createdAt - a.createdAt),
    [mapPlaces],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = loadFromStorage<JourneyEntry>('journey', []).sort(sortEntries);
      setEntries(stored);
      setHasLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveToStorage('journey', entries);
  }, [entries, hasLoaded]);

  const resetComposer = () => {
    setNewTitle('');
    setNewDate('');
    setNewPlaceId('');
    setNewLocation('');
    setNewText('');
    setNewMediaUrl('');
    setNewMediaPath('');
    setNewMediaError('');
    setNewMediaType(null);
    setIsComposerOpen(false);
  };

  const handleMediaChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
    const cloudUpload = await uploadMediaFileToCloud(file, 'journey');
    if (!cloudUpload) {
      setNewMediaError('Cloud upload failed. Please try again after a fresh login.');
      event.target.value = '';
      return;
    }
    const mediaUrl = cloudUpload.url;
    setNewMediaError('');
    setNewMediaType(type);
    setNewMediaUrl(mediaUrl);
    setNewMediaPath(cloudUpload?.path ?? '');
    event.target.value = '';
  };

  const handleTextEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();

    const target = event.currentTarget;
    const start = target.selectionStart ?? newText.length;
    const end = target.selectionEnd ?? newText.length;
    const nextValue = `${newText.slice(0, start)}\n${newText.slice(end)}`;
    setNewText(nextValue);

    requestAnimationFrame(() => {
      target.selectionStart = start + 1;
      target.selectionEnd = start + 1;
    });
  };

  const addEntry = () => {
    if (!newTitle.trim() || !newDate || !newText.trim()) return;
    const selectedPlace = sortedMapPlaces.find((place) => place.id === newPlaceId);
    const resolvedLocation = selectedPlace?.name || newLocation.trim() || undefined;

    const nextEntry: JourneyEntry = {
      id: generateId(),
      title: newTitle.trim(),
      date: newDate,
      text: newText.replace(/\r\n/g, '\n'),
      placeId: selectedPlace?.id,
      location: resolvedLocation,
      mediaUrl: newMediaUrl || undefined,
      mediaPath: newMediaPath || undefined,
      mediaType: newMediaType || undefined,
      imageUrl: newMediaType === 'image' ? newMediaUrl || undefined : undefined,
      createdAt: Date.now(),
    };

    setEntries((current) => [...current, nextEntry].sort(sortEntries));
    resetComposer();
  };

  const deleteEntry = (id: string) => {
    setEntries((current) => {
      const target = current.find((entry) => entry.id === id);
      if (target?.mediaPath) {
        void deleteCloudMediaByPath(target.mediaPath);
      }
      return current.filter((entry) => entry.id !== id);
    });
  };

  const timelineData = entries.map((entry) => ({
    title: formatEntryDate(entry.date),
    content: (
      <div className="space-y-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              {entry.title}
            </p>
            {entry.location ? (
              <p className="text-sm leading-relaxed text-white/65">{entry.location}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => deleteEntry(entry.id)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:border-white/20 hover:text-white"
            aria-label={`Delete ${entry.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="whitespace-pre-line text-base leading-[2.1] text-neutral-200 md:text-lg">
          {entry.text}
        </p>

        {entry.mediaUrl || entry.imageUrl ? (
          (entry.mediaType === 'video') ? (
            <video
              src={entry.mediaUrl}
              controls
              playsInline
              className="w-full rounded-2xl object-cover"
            />
          ) : (
          <img
            src={entry.mediaUrl || entry.imageUrl || ''}
            alt={entry.title}
            className="w-full rounded-2xl object-cover"
          />
          )
        ) : null}
      </div>
    ),
  }));

  return (
    <main className="page-shell max-w-6xl mx-auto px-4 py-12 space-y-10 md:px-6 md:py-20 md:space-y-16">
      <section className="space-y-10 pb-16">
        <div className="pill w-fit">Our Journey</div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl space-y-10">
            <h1 className="font-[var(--font-playfair)] text-4xl leading-[1.06] tracking-tight text-white sm:text-5xl md:text-7xl">
              Our Journey
            </h1>
            <p className="max-w-3xl text-base leading-[2.1] text-neutral-300 md:text-lg md:leading-[2.2]">
              Your own moments, your own photos and enough room so memories never feel compressed.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 pb-1 lg:mr-4">
            <Button
              asChild
              variant="outline"
              className="h-12 min-w-[11rem] rounded-full border-white/10 bg-white/5 px-8 text-sm font-medium text-white hover:bg-white/10"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="h-12 min-w-[11rem] rounded-full border border-white/10 bg-white/10 px-8 text-sm font-medium whitespace-nowrap text-white hover:bg-white/15"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add a Moment
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        {hasLoaded && entries.length > 0 ? (
          <Timeline data={timelineData} title={null} description={null} />
        ) : (
          <section className="flex min-h-[55vh] items-center justify-center rounded-[2rem] border border-dashed border-white/10 px-10 py-28 text-center md:min-h-[60vh] md:px-14">
            <div className="max-w-xl space-y-8">
              <h2 className="font-[var(--font-playfair)] text-3xl text-white">No moments yet</h2>
              <p className="mx-auto text-sm leading-[2.1] text-neutral-400 md:text-base md:leading-[2.2]">
                Open the composer and add your first moment. Title, date, location, text and photo are ready.
              </p>
            </div>
          </section>
        )}
      </section>

      {isComposerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-6 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[56rem] rounded-3xl border border-white/20 bg-[#1b1232f2] shadow-[0_30px_90px_rgba(0,0,0,0.48)]">
            <Button
              type="button"
              variant="outline"
              onClick={resetComposer}
              className="absolute right-6 top-6 h-10 w-10 rounded-xl border-white/25 bg-white/8 p-0 text-white hover:bg-white/12"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            <Button
              type="button"
              onClick={addEntry}
              className="absolute bottom-4 right-6 h-10 min-w-[8.5rem] rounded-xl border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-6 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)]"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>

            <div className="grid min-h-[38rem] place-items-center p-12 md:p-14">
              <div className="relative w-full max-w-xl pb-24 pt-12">
                <h2 className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 text-center text-2xl font-medium leading-relaxed text-white md:-top-16 md:text-3xl">
                  Create Moment
                </h2>

                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                      placeholder="Title"
                      className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
                    />
                  </div>

                  <div className="mt-14 space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(event) => setNewDate(event.target.value)}
                      className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition focus:border-white/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Place from Map
                    </label>
                    <select
                      value={newPlaceId}
                      onChange={(event) => {
                        const nextPlaceId = event.target.value;
                        setNewPlaceId(nextPlaceId);
                        const picked = sortedMapPlaces.find((place) => place.id === nextPlaceId);
                        if (picked) setNewLocation(picked.name);
                      }}
                      className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition focus:border-white/50"
                    >
                      <option value="" className="bg-[#1b1232] text-white/90">
                        Choose a place (optional)
                      </option>
                      {sortedMapPlaces.map((place) => (
                        <option key={place.id} value={place.id} className="bg-[#1b1232] text-white/90">
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(event) => setNewLocation(event.target.value)}
                      placeholder="Location"
                      className="h-14 w-full rounded-xl border border-white/30 bg-transparent px-4 text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Photo
                    </label>
                    <div className="relative flex h-14 w-full items-center rounded-xl border border-white/30 bg-transparent px-4 text-sm text-white/80 transition hover:border-white/50">
                      <span className="block w-full pl-1 text-left">
                        {newMediaUrl ? 'Selected' : 'Choose image or video from your device'}
                      </span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(event) => {
                          void handleMediaChange(event);
                        }}
                      />
                    </div>
                    {newMediaError ? (
                      <p className="text-center text-xs text-rose-300">{newMediaError}</p>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-xs uppercase tracking-wide text-white/60">
                      Text
                    </label>
                    <textarea
                      value={newText}
                      onChange={(event) => setNewText(event.target.value)}
                      onKeyDown={handleTextEnter}
                      placeholder="Write something..."
                      rows={6}
                      className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-4 text-white outline-none transition placeholder:text-white/42 focus:border-white/50"
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
