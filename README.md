# Interactive Bento Gallery

A modern Next.js application featuring an interactive bento-style gallery component built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Interactive Bento Gallery**: Drag-and-drop gallery with video and image support
- **Modal View**: Click on items to view them in a full-screen modal
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Video Playback**: Automatic video play/pause based on viewport visibility
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive bento gallery.

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── blocks/
│   │   ├── demo.tsx
│   │   └── interactive-bento-gallery.tsx
│   └── ui/
│       ├── button.tsx
│       └── ...
├── lib/
│   └── utils.ts
└── public/
```

## Component Usage

```tsx
import { BentoGridGalleryDemo } from "@/components/blocks/demo";

export default function Home() {
  return <BentoGridGalleryDemo />;
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
