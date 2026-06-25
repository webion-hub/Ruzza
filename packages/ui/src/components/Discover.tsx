"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type DiscoverTab = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly isActive?: boolean;
};

type DiscoverProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly titleHighlight?: string;
  readonly tabs: readonly DiscoverTab[];
  readonly onTabClick?: (tab: DiscoverTab) => void;
  readonly theme?: "light" | "dark";
  readonly className?: string;
};

export function Discover({
  eyebrow = "Discover",
  title,
  titleHighlight,
  tabs,
  onTabClick,
  theme = "dark",
  className,
}: DiscoverProps) {
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "relative z-[2] flex flex-col items-center text-center gap-[clamp(14px,2vh,22px)] px-[6vw] py-[clamp(40px,7vh,96px)]",
        isDark ? "" : "bg-white",
        className
      )}
    >
      <div
        className={cn(
          "font-archivo text-[clamp(10px,0.78vw,12px)] tracking-[0.42em] uppercase",
          isDark ? "text-[rgba(244,241,234,0.6)]" : "text-[rgba(26,26,26,0.55)]"
        )}
      >
        {eyebrow}
      </div>

      <h3
        className={cn(
          "font-archivo font-medium text-[clamp(20px,2.4vw,38px)] tracking-[0.02em] leading-[1.2] text-balance",
          isDark ? "text-[#f7f4ee]" : "text-[#1a1a1a]"
        )}
      >
        {title}
        {titleHighlight && (
          <>
            <br />
            <span className={isDark ? "text-[rgba(244,241,234,0.45)]" : "text-[rgba(26,26,26,0.4)]"}>
              {titleHighlight}
            </span>
          </>
        )}
      </h3>

      <div
        className={cn(
          "mt-[clamp(6px,1.2vh,14px)] inline-flex gap-1.5 p-1 max-w-full rounded-full backdrop-blur-[14px] saturate-[140%]",
          isDark
            ? "bg-[rgba(20,19,22,0.4)] border border-[rgba(244,241,234,0.16)]"
            : "bg-[rgba(26,26,26,0.05)] border border-[rgba(26,26,26,0.14)]"
        )}
      >
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            onClick={(e) => {
              if (onTabClick) {
                e.preventDefault();
                onTabClick(tab);
              }
            }}
            className={cn(
              "flex-[1_1_0] inline-flex items-center justify-center min-w-0 text-center whitespace-nowrap appearance-none cursor-pointer no-underline hover:no-underline font-archivo font-medium text-[clamp(10px,0.82vw,13px)] tracking-[0.12em] uppercase py-[clamp(7px,0.8vw,10px)] px-[clamp(22px,2.2vw,36px)] rounded-full transition-all duration-[180ms]",
              tab.isActive
                ? isDark
                  ? "bg-[#f4f1ea] text-[#1a1a1d]"
                  : "bg-[#1a1a1a] text-[#f7f4ee]"
                : isDark
                  ? "text-[rgba(244,241,234,0.78)] hover:text-[#f7f4ee] hover:bg-[rgba(244,241,234,0.08)]"
                  : "text-[rgba(26,26,26,0.7)] hover:text-[#1a1a1a] hover:bg-[rgba(26,26,26,0.06)]"
            )}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </section>
  );
}
