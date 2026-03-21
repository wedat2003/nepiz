'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const letters = [
  {
    occasion: 'When you miss me',
    text: 'I am not there, but I am in every heartbeat. Close your eyes, I am closer than you think.',
  },
  {
    occasion: 'When everything feels hard',
    text: 'When life feels heavy, hold on to me. I am your home, even from far away.',
  },
  {
    occasion: 'On your birthday',
    text: 'Today the world celebrates you and I celebrate you every day. Thank you for being here.',
  },
  {
    occasion: 'When you need peace',
    text: 'Take a deep breath, close your eyes and rest for a minute. I am with you in this quiet moment.',
  },
  {
    occasion: 'When you need to laugh',
    text: 'Think of our funniest moment and smile. I am smiling with you right now.',
  },
  {
    occasion: 'When it is all too much',
    text: 'I am the thought that helps you rest. Imagine me holding your hand.',
  },
  {
    occasion: 'When you feel lonely',
    text: 'You are never alone. Even if I am not there, I am with you, always.',
  },
  {
    occasion: 'When you need courage',
    text: 'You are braver than you think. I believe in you, every day.',
  },
  {
    occasion: 'When you feel stressed',
    text: 'One step at a time. You do not need to solve everything right now.',
  },
  {
    occasion: 'When your day was bad',
    text: 'Today was hard, but you are still here and still strong. I am proud of you.',
  },
  {
    occasion: 'When you cannot sleep',
    text: 'Slow your breathing and rest your mind. Imagine I am right beside you.',
  },
  {
    occasion: 'When you doubt yourself',
    text: 'You are enough exactly as you are. Do not forget how much light you carry.',
  },
  {
    occasion: 'When you feel overwhelmed',
    text: 'Pause. Drink water. Breathe. We can handle one small thing first.',
  },
  {
    occasion: 'When you need motivation',
    text: 'You have done hard things before. You can do this too.',
  },
  {
    occasion: 'When you need a smile',
    text: 'Think of one happy memory of us. Keep it for a minute and smile with me.',
  },
  {
    occasion: 'When you need a break',
    text: 'Take five quiet minutes for yourself. Breathe slowly, relax your shoulders and reset.',
  },
];

export default function OpenWhen() {
  const [openedLetters, setOpenedLetters] = useState<Set<number>>(new Set());

  const toggleLetter = (index: number) => {
    const updated = new Set(openedLetters);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setOpenedLetters(updated);
  };

  return (
    <main className="page-shell page-shell--narrow">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="pill mb-2">Open When</div>
          <h1 className="text-4xl font-bold">Open When...</h1>
          <p className="mt-2 opacity-75">Love letters for hard moments</p>
        </div>
        <Link href="/" className="btn">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="hr" />

      <div className="grid gap-4 md:grid-cols-2">
        {letters.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => toggleLetter(idx)}
            className="card text-left transition-all duration-300 hover:border-pink-500"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-pink-300">
                  Open When...
                </p>
                <p className="mt-2 text-lg font-bold">{letter.occasion}</p>
              </div>
            </div>

            {openedLetters.has(idx) && (
              <div className="mt-4 border-t border-gray-500 pt-4">
                <p className="leading-relaxed text-gray-200">{letter.text}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
