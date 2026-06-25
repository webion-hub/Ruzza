"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type HeroProps = {
  readonly title: string;
  readonly eyebrow?: string;
  readonly showRule?: boolean;
  readonly scrollCueText?: string;
  readonly scrollCueBadge?: string;
  readonly scrollCueAriaLabel?: string;
  readonly onScrollCueClick?: () => void;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly theme?: "light" | "dark";
  readonly className?: string;
};

export function Hero({
  title,
  eyebrow,
  showRule = true,
  scrollCueText = "Nuovi arrivi",
  scrollCueBadge,
  scrollCueAriaLabel = "Scopri i nuovi arrivi",
  onScrollCueClick,
  titleFont = "libre-baskerville",
  theme = "light",
  className,
}: HeroProps) {
  const isDark = theme === "dark";

  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  return (
    <section
      className={cn(
        "relative z-[2] min-h-screen min-h-[100svh] flex flex-col items-center justify-center text-center px-[6vw] bg-transparent",
        className
      )}
    >
      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className={cn(
            fontClass,
            "font-light leading-[0.92] text-[clamp(64px,18vw,380px)] text-balance",
            "[font-kerning:none] [font-feature-settings:'kern'_0,'liga'_0]",
            "[text-rendering:geometricPrecision]",
            isDark ? "text-[#f7f4ee]" : "text-[#2a2722]"
          )}
          aria-label={title}
        >
          {/* Render each letter with uniform spacing to override font kerning */}
          {title.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ marginRight: i < title.length - 1 ? "0.04em" : 0 }}
            >
              {char}
            </span>
          ))}
        </motion.h1>

        {showRule && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className={cn(
              "w-[clamp(160px,26vw,420px)] h-px -mt-14 opacity-70 origin-center",
              isDark ? "bg-[rgba(244,241,234,0.6)]" : "bg-[rgba(42,39,34,0.62)]"
            )}
          />
        )}

        {eyebrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              fontClass,
              "font-normal text-[clamp(14px,1.4vw,28px)] tracking-[0.42em] uppercase mt-[clamp(14px,2vw,28px)] pl-[0.42em]",
              isDark ? "text-[rgba(244,241,234,0.62)]" : "text-[rgba(42,39,34,0.62)]"
            )}
          >
            {eyebrow}
          </motion.div>
        )}
      </div>

      {/* Scroll Cue */}
      {scrollCueText && (
        <div className="absolute bottom-[clamp(18px,3.4vh,42px)] left-0 right-0 flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            type="button"
            aria-label={scrollCueAriaLabel}
            onClick={onScrollCueClick}
            className={cn(
              "appearance-none bg-transparent border-0 cursor-pointer flex flex-col items-center gap-2.5 font-archivo text-[clamp(9px,0.78vw,12px)] uppercase transition-colors duration-[200ms]",
              isDark
                ? "text-[rgba(244,241,234,0.62)] hover:text-[#f7f4ee]"
                : "text-[rgba(42,39,34,0.62)] hover:text-[#2a2722]"
            )}
          >
            <span className="flex items-center gap-3 tracking-[0.32em]" style={{ paddingLeft: "0.32em" }}>
              {scrollCueText}
              {scrollCueBadge && (
                <>
                  <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                  <span className="opacity-60">{scrollCueBadge}</span>
                </>
              )}
            </span>
            <svg
              className="w-[22px] h-[22px] animate-[cueBob_2.2s_ease-in-out_infinite] motion-reduce:animate-none"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      )}

      <style>{`
        @keyframes cueBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}
