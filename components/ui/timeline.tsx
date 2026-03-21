"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const FIRST_DOT_Y = 80;

export const Timeline = ({
  data,
  title = "Our Story",
  description = "The moments that stayed with you finally get the room they deserve.",
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState(0);
  const [dotPositions, setDotPositions] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const containerTop = el.getBoundingClientRect().top;
      setHeight(el.getBoundingClientRect().height);
      const positions = dotRefs.current.map((dotRef) => {
        if (!dotRef) return 0;
        return dotRef.getBoundingClientRect().top - containerTop;
      });
      setDotPositions(positions);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [data.length]);

  const lastDotY = dotPositions[dotPositions.length - 1] ?? 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 85%"],
  });

  const lineHeight = useTransform(
    scrollYProgress,
    [0, 0.75],
    [0, lastDotY > 0 ? lastDotY - FIRST_DOT_Y + 24 : height - FIRST_DOT_Y],
    { clamp: true }
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.03], [0, 1]);

  useMotionValueEvent(lineHeight, "change", (current) => {
    if (dotPositions.length === 0) return;
    let newActive = -1;
    dotPositions.forEach((pos, i) => {
      if (current >= pos - FIRST_DOT_Y - 5) newActive = i;
    });
    setActiveIndex(newActive);
  });

  return (
    <div className="w-full font-sans px-4 md:px-10" ref={containerRef}>
      {title || description ? (
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          {title ? (
            <h2 className="text-lg md:text-4xl mb-4 max-w-4xl text-white font-[var(--font-playfair)]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-xl text-sm leading-7 text-neutral-300 md:text-base md:leading-8">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-[300px] px-4 md:px-8 lg:px-10">

        {/* Static grey line */}
        <div
          className="absolute left-[27px] md:left-[99px] w-[2px] bg-neutral-800 rounded-full"
          style={{
            top: FIRST_DOT_Y + 'px',
            height: lastDotY > 0 ? lastDotY - FIRST_DOT_Y + 24 + 'px' : '100%',
          }}
        />

        {/* Animated line */}
        <motion.div
          className="absolute left-[27px] md:left-[99px] w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-fuchsia-500 rounded-full"
          style={{ top: FIRST_DOT_Y + 'px', height: lineHeight, opacity: opacityTransform }}
        />

        {data.map((item, index) => (
          <div
            key={index}
            className="flex gap-6 md:gap-10"
            style={{ paddingTop: index === 0 ? FIRST_DOT_Y + 'px' : '300px' }}
          >
            {/* Left: dot + date */}
            <div className="flex flex-col items-center shrink-0 w-[56px] md:w-[200px]">
              <div
                ref={(el) => { dotRefs.current[index] = el; }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                  index <= activeIndex
                    ? 'border-purple-400 bg-purple-900/40 shadow-[0_0_20px_rgba(168,85,247,0.7)]'
                    : 'border-neutral-700 bg-black'
                }`}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index <= activeIndex
                    ? 'bg-gradient-to-br from-purple-400 via-fuchsia-300 to-blue-400'
                    : 'bg-neutral-700'
                }`} />
              </div>
              <h3 className={`hidden md:block text-center mt-4 text-2xl lg:text-4xl font-bold leading-tight transition-colors duration-500 ${
                index <= activeIndex ? 'text-white' : 'text-neutral-500'
              }`}>
                {item.title}
              </h3>
            </div>

            {/* Right: content */}
            <div className="flex-1 min-w-0 pb-4">
              <h3 className={`md:hidden block text-xl mb-6 font-bold transition-colors duration-500 ${
                index <= activeIndex ? 'text-white' : 'text-neutral-500'
              }`}>
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Spacer so the last dot is never at the very bottom and the animation can reach it */}
        <div className="h-[500px]" />
      </div>
    </div>
  );
};
