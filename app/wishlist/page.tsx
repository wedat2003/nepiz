'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveToStorage, generateId, type Wish } from '@/lib/storage';
import { useStoredCollection } from '@/lib/storage-hooks';

export default function Wishlist() {
  const wishes = useStoredCollection<Wish>('wishlist', []);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [activeWish, setActiveWish] = useState<Wish | null>(null);

  const handleDelete = (id: string) => {
    const updated = wishes.filter((wish) => wish.id !== id);
    saveToStorage('wishlist', updated);
  };

  const handleAdd = () => {
    const nextTitle = title.trim();
    const nextNote = note.trim();
    if (!nextTitle) return;

    const newWish: Wish = {
      id: generateId(),
      title: nextTitle,
      note: nextNote || undefined,
      done: false,
      createdAt: Date.now(),
    };

    const updated = [newWish, ...wishes];
    saveToStorage('wishlist', updated);
    setTitle('');
    setNote('');
  };

  return (
    <main className="page-shell max-w-6xl mx-auto px-6 py-20 space-y-16">
      <section className="space-y-10 pb-12 md:pb-16">
        <div className="pill w-fit">Wish List</div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="max-w-4xl font-[var(--font-playfair)] text-5xl leading-[1.04] tracking-tight text-white md:text-7xl">
            Wishes you want to do together
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
          <article className="w-full rounded-2xl border border-white/12 bg-transparent p-6 md:p-8">
            <div className="grid min-h-[46rem] rounded-2xl border border-transparent bg-white/[0.02] p-8 md:p-10">
              <div className="flex h-full w-full flex-col items-center gap-8">
                <p className="text-center text-xs uppercase tracking-[0.18em] text-white/78">Add Wish</p>

                <div className="mx-auto w-full max-w-sm">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Your new wish..."
                    className="h-14 w-full rounded-xl border border-white/35 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/65 focus:border-white/55"
                  />
                </div>
                <div className="mx-auto w-full max-w-sm">
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Additional notes..."
                    rows={4}
                    className="w-full rounded-xl border border-white/35 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/65 focus:border-white/55"
                  />
                </div>

                <div className="flex w-full justify-center">
                  <Button
                    type="button"
                    onClick={handleAdd}
                    className="h-12 min-w-[11rem] rounded-full border-0 bg-[linear-gradient(135deg,#6da8ff,#4f82e8)] px-8 text-sm font-medium text-white shadow-[0_14px_32px_rgba(54,96,180,0.35)]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Wish
                  </Button>
                </div>
              </div>
            </div>
          </article>

          <article className="w-full rounded-2xl border border-white/12 bg-transparent p-6 md:p-8">
            <div className="grid min-h-[46rem] rounded-2xl border border-transparent bg-white/[0.02] p-8 md:p-10">
              <div className="flex h-full w-full flex-col items-center gap-8">
                <p className="text-center text-xs uppercase tracking-[0.18em] text-white/78">Wish List</p>
                <div className="mx-auto w-full max-w-sm">
                  <div className="space-y-3 px-2">
                    {wishes.map((wish) => (
                      <div
                        key={wish.id}
                        onClick={() => setActiveWish(wish)}
                        className="flex h-10 cursor-pointer items-center justify-between rounded-xl border border-white/20 bg-black/25 px-5"
                      >
                        <p className={`flex-1 text-sm leading-none ${wish.done ? 'text-white/55 line-through' : 'text-white/95'}`}>
                          {`\u00A0\u00A0\u00A0${wish.title}`}
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(wish.id);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-white/75 transition hover:bg-red-500/20 hover:text-red-300"
                          aria-label={`Delete ${wish.title}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {wishes.length === 0 ? (
                      <div className="rounded-xl border border-white/12 bg-black/20 px-4 py-4 text-center text-sm text-white/70">
                        No wishes yet
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {activeWish ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-6 backdrop-blur-[2px]"
          onClick={() => setActiveWish(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-white/20 bg-[#1b1232f2] p-10 md:p-12"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-h-[24rem] w-full rounded-3xl border border-white/20 bg-transparent p-8 md:p-10">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveWish(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-white/85 transition hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-6 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/78">Wish Details</p>
                  <h2 className="max-w-full break-words break-all font-[var(--font-playfair)] text-3xl leading-tight text-white md:text-4xl">
                    {activeWish.title}
                  </h2>
                  <div className="flex justify-center">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-transparent px-6 py-6 text-left">
                      <div className="max-w-full space-y-1 text-sm leading-relaxed text-white/88 md:text-base">
                        {(activeWish.note?.trim() ? activeWish.note : 'No additional notes yet.')
                          .split('\n')
                          .map((line, index) => (
                            <p key={`${activeWish.id}-line-${index}`} className="max-w-full break-all [overflow-wrap:anywhere]">
                              <span>{`\u00A0\u00A0\u00A0${line || '\u00A0'}`}</span>
                            </p>
                          ))}
                      </div>
                    </div>
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
