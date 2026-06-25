"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type CarouselItem = {
  readonly id: string;
  readonly index: string;
  readonly total: string;
  readonly name: string;
  readonly tag: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly href: string;
};

type NewArrivalsProps = {
  readonly eyebrow?: string;
  readonly eyebrowBadge?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly items: readonly CarouselItem[];
  readonly discoverLabel?: string;
  readonly prevAriaLabel?: string;
  readonly nextAriaLabel?: string;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly theme?: "light" | "dark";
  readonly className?: string;
};

export function NewArrivals({
  eyebrow = "Nuovi arrivi",
  eyebrowBadge,
  title,
  subtitle,
  ctaLabel = "VEDI TUTTI I MODELLI",
  ctaHref = "#",
  items,
  discoverLabel = "Discover",
  prevAriaLabel = "Precedente",
  nextAriaLabel = "Successivo",
  titleFont = "libre-baskerville",
  theme = "dark",
  className,
}: NewArrivalsProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  const goTo = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    setActiveIndex(clampedIndex);

    if (trackRef.current) {
      const slides = trackRef.current.querySelectorAll(".slide");
      const slide = slides[clampedIndex] as HTMLElement;
      if (slide) {
        const left = slide.offsetLeft + slide.offsetWidth / 2 - trackRef.current.clientWidth / 2;
        trackRef.current.scrollTo({ left, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const slides = Array.from(track.querySelectorAll(".slide")) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;

    let bestIndex = 0;
    let bestDist = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });

    setActiveIndex(bestIndex);
  };

  return (
    <section
      className={cn(
        "relative z-[2] min-h-screen min-h-[100svh] flex flex-col py-[clamp(64px,9vh,120px)]",
        isDark ? "text-[#f4f1ea]" : "bg-white text-[#1a1a1a]",
        className
      )}
    >
      {/* Top shadow from Collection above */}
      {!isDark && (
        <div
          className="absolute inset-x-0 top-0 h-20 z-[1] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 40%, transparent 100%)"
          }}
        />
      )}

      {/* Header */}
      <div className="flex-shrink-0 flex flex-col items-center text-center gap-[clamp(8px,1.4vh,16px)] px-[6vw]">
        <div
          className={cn(
            "flex items-center gap-3 font-archivo text-[clamp(10px,0.8vw,13px)] tracking-[0.42em] uppercase pl-[0.42em]",
            isDark ? "text-[rgba(244,241,234,0.62)]" : "text-[rgba(26,26,26,0.5)]"
          )}
        >
          {eyebrow}
          {eyebrowBadge && (
            <>
              <span className="w-1 h-1 rounded-full bg-current opacity-60" />
              <span className="opacity-60">{eyebrowBadge}</span>
            </>
          )}
        </div>
        <h2
          className={cn(
            fontClass,
            "font-light text-[clamp(40px,6.2vw,104px)] leading-[0.96] tracking-[0.02em]",
            isDark ? "text-[#f7f4ee]" : "text-[#1a1a1a]"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "max-w-[44ch] text-[clamp(13px,1.05vw,16px)] leading-[1.6] text-balance",
              isDark ? "text-[rgba(244,241,234,0.68)]" : "text-[rgba(26,26,26,0.6)]"
            )}
          >
            {subtitle}
          </p>
        )}
        <a
          href={ctaHref}
          className={cn(
            "self-center mt-[clamp(18px,2.4vh,28px)] inline-flex items-center gap-2.5 no-underline font-archivo font-semibold text-[clamp(11px,0.9vw,13px)] tracking-[0.16em] uppercase py-[15px] px-[30px] rounded-full transition-all duration-[180ms] hover:opacity-[0.86] hover:gap-3.5",
            isDark ? "bg-[#f7f4ee] text-[#14130f]" : "bg-[#1a1a1a] text-white"
          )}
        >
          {ctaLabel}
        </a>
      </div>

      {/* Carousel */}
      <div className="relative flex-[1_1_auto] min-h-0 flex items-center mt-[clamp(20px,3vh,44px)]">
        {/* Hairline */}
        <div
          className={cn(
            "absolute left-0 right-0 top-1/2 h-px z-0",
            isDark
              ? "bg-gradient-to-r from-transparent via-[rgba(244,241,234,0.22)] to-transparent"
              : "bg-gradient-to-r from-transparent via-[rgba(26,26,26,0.16)] to-transparent"
          )}
        />

        {/* Prev Button */}
        <button
          type="button"
          aria-label={prevAriaLabel}
          disabled={activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
          className={cn(
            "absolute left-[clamp(12px,3vw,48px)] top-1/2 -translate-y-1/2 z-[5] w-[clamp(42px,3.4vw,54px)] h-[clamp(42px,3.4vw,54px)] grid place-items-center appearance-none cursor-pointer rounded-full backdrop-blur-[26px] saturate-150 transition-all duration-[200ms] disabled:opacity-25 disabled:pointer-events-none active:scale-[0.94]",
            isDark
              ? "text-[#f4f1ea] bg-[rgba(18,17,20,0.55)] border border-[rgba(244,241,234,0.22)] hover:bg-[rgba(244,241,234,0.16)] hover:border-[rgba(244,241,234,0.5)]"
              : "text-[#1a1a1a] bg-[rgba(255,255,255,0.65)] border border-[rgba(26,26,26,0.2)] hover:bg-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.5)]"
          )}
        >
          <svg className="w-[40%] h-[40%]" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex items-center gap-[clamp(20px,3vw,56px)] w-full overflow-x-auto snap-x snap-mandatory [-webkit-overflow-scrolling:touch] px-[max(6vw,calc(50vw-min(560px,44vw)))] py-[clamp(10px,2vh,28px)] scrollbar-hide cursor-grab active:cursor-grabbing"
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "slide flex-shrink-0 w-[min(1120px,88vw)] snap-center grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-[clamp(8px,1.4vw,22px)] relative z-[1] max-md:grid-cols-1 max-md:text-center max-md:gap-[clamp(14px,3vh,26px)]"
              )}
            >
              {/* Meta */}
              <div className="self-start justify-self-start max-w-[30ch] flex flex-col gap-[clamp(8px,1.2vh,14px)] pt-[clamp(6px,4vh,56px)] max-md:items-center">
                <div
                  className={cn(
                    "font-archivo text-[clamp(10px,0.8vw,13px)] tracking-[0.34em] uppercase",
                    isDark ? "text-[rgba(244,241,234,0.5)]" : "text-[rgba(26,26,26,0.5)]"
                  )}
                >
                  {item.index} / {item.total}
                </div>
                <div
                  className={cn(
                    fontClass,
                    "font-light text-[clamp(24px,3vw,48px)] leading-[0.94] tracking-[0.02em]",
                    isDark ? "text-[#f7f4ee]" : "text-[#1a1a1a]"
                  )}
                >
                  {item.name}
                </div>
                <div
                  className={cn(
                    "mt-[clamp(4px,0.8vh,10px)] font-archivo text-[clamp(10px,0.82vw,13px)] tracking-[0.22em] uppercase",
                    isDark ? "text-[rgba(244,241,234,0.62)]" : "text-[rgba(26,26,26,0.6)]"
                  )}
                >
                  {item.tag}
                </div>
              </div>

              {/* Image */}
              <div className="relative grid place-items-center py-[clamp(8px,2vh,26px)]">
                <motion.img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  initial={false}
                  animate={{ scale: activeIndex === index ? 1 : 0.84, opacity: activeIndex === index ? 1 : 0.92 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  className="relative z-[1] h-[clamp(300px,48vh,580px)] w-auto max-w-full object-contain"
                />
              </div>

              {/* CTA */}
              <div className="justify-self-start max-md:justify-self-center">
                <a
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2.5 py-2.5 px-4 rounded-full no-underline font-archivo text-[clamp(10px,0.82vw,13px)] tracking-[0.26em] uppercase whitespace-nowrap bg-transparent border-0 backdrop-blur-[18px] saturate-150 transition-all duration-[220ms] hover:gap-4",
                    isDark ? "text-[#f4f1ea]" : "text-[#1a1a1a]"
                  )}
                >
                  {discoverLabel}
                  <span
                    className={cn(
                      "w-[34px] h-[34px] grid place-items-center rounded-full border transition-all duration-[220ms]",
                      isDark
                        ? "border-[rgba(244,241,234,0.4)] hover:bg-[rgba(244,241,234,0.14)] hover:border-[rgba(244,241,234,0.7)]"
                        : "border-[rgba(26,26,26,0.35)] hover:bg-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.6)]"
                    )}
                  >
                    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          aria-label={nextAriaLabel}
          disabled={activeIndex === items.length - 1}
          onClick={() => goTo(activeIndex + 1)}
          className={cn(
            "absolute right-[clamp(12px,3vw,48px)] top-1/2 -translate-y-1/2 z-[5] w-[clamp(42px,3.4vw,54px)] h-[clamp(42px,3.4vw,54px)] grid place-items-center appearance-none cursor-pointer rounded-full backdrop-blur-[26px] saturate-150 transition-all duration-[200ms] disabled:opacity-25 disabled:pointer-events-none active:scale-[0.94]",
            isDark
              ? "text-[#f4f1ea] bg-[rgba(18,17,20,0.55)] border border-[rgba(244,241,234,0.22)] hover:bg-[rgba(244,241,234,0.16)] hover:border-[rgba(244,241,234,0.5)]"
              : "text-[#1a1a1a] bg-[rgba(255,255,255,0.65)] border border-[rgba(26,26,26,0.2)] hover:bg-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.5)]"
          )}
        >
          <svg className="w-[40%] h-[40%]" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="flex-shrink-0 flex flex-col items-center gap-[clamp(14px,2vh,22px)] px-[6vw] pt-[clamp(18px,3vh,40px)]">
        <div
          className={cn(
            "w-[min(360px,60vw)] flex items-center gap-4 font-archivo text-[clamp(10px,0.78vw,12px)] tracking-[0.2em]",
            isDark ? "text-[rgba(244,241,234,0.6)]" : "text-[rgba(26,26,26,0.55)]"
          )}
        >
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <div
            className={cn(
              "flex-[1_1_auto] h-px relative overflow-hidden",
              isDark ? "bg-[rgba(244,241,234,0.2)]" : "bg-[rgba(26,26,26,0.2)]"
            )}
          >
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-[20%] transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                isDark ? "bg-[#f4f1ea]" : "bg-[#1a1a1a]"
              )}
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
          </div>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
