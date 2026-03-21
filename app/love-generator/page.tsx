'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const loveLines = [
  'I love you because you make me calm.',
  'I love you because you laugh at my jokes.',
  'I love you because you understand me.',
  'I love you because you make simple things special.',
  'I love you because you understand me without words.',
  'I love you because you are kind even when you are tired.',
  'I love you because your smile saves my day.',
  'I love you because you believe in me.',
  'I love you because you are my safe place.',
  'I love you because you push me to be better.',
  'I love you because you are soft and strong.',
  'I love you because you notice the little things.',
  'I love you because you feel like home.',
  'I love you because your voice is my favorite sound.',
  'I love you because you are wonderful in every way.',
  'I love you because you choose me.',
  'I love you because you are my favorite person.',
  'I love you because you light up every room.',
  'I love you because time feels slower with you.',
  'I love you because you make me happy.',
];

export default function LoveGenerator() {
  const [quote, setQuote] = useState(loveLines[0]);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * loveLines.length);
      setQuote(loveLines[randomIndex]);
      setIsFlipping(false);
    }, 300);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-fuchsia-500/15 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="pill mb-2">Reasons</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">Why I love you</h1>
            </div>
            <Link href="/" className="btn flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          {/* Card */}
          <div className={`group relative cursor-pointer h-80 mb-8 transition-transform duration-300 ${isFlipping ? 'scale-95' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl group-hover:blur-3xl" />
            
            <div className={`relative h-full card border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-rose-500/10 p-12 flex items-center justify-center transition-all duration-300 ${isFlipping ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`}>
              <p className="text-3xl md:text-4xl font-bold text-center leading-relaxed bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent">
                {quote}
              </p>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="btn btnPrimary w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold hover:scale-105 transition-transform"
          >
            <RefreshCw className="h-5 w-5" />
            Next reason
          </button>

          <p className="text-center text-gray-400 mt-8 text-sm">{loveLines.length} reasons to smile...</p>
        </div>
      </div>
    </main>
  );
}
