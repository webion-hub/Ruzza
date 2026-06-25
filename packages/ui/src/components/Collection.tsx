"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../lib/utils";

type CollectionItem = {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly category: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly href: string;
  readonly tileColor?: string;
};

type CollectionProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly items: readonly CollectionItem[];
  readonly emptyMessage?: string;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly theme?: "light" | "dark";
  readonly className?: string;
  readonly onItemClick?: (item: CollectionItem) => void;
};

export function Collection({
  eyebrow = "Collezione",
  title,
  ctaLabel = "Visualizza tutto",
  ctaHref = "#",
  items,
  emptyMessage = "Nessun prodotto trovato",
  titleFont = "libre-baskerville",
  theme = "light",
  className,
  onItemClick,
}: CollectionProps) {
  const isDark = theme === "dark";
  const sectionRef = React.useRef<HTMLElement>(null);

  // Track scroll progress for darkening overlay
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Overlay starts transparent and becomes fully opaque when section reaches top
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.97]);

  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative z-[2] py-20 overflow-visible",
        isDark ? "text-[#f7f4ee]" : "bg-white text-[#1a1815]",
        className
      )}
    >
      {/* Dark overlay - extends upward to cover transition from Hero */}
      {isDark && (
        <motion.div
          className="absolute inset-x-0 -top-[100vh] bottom-0 z-0 pointer-events-none bg-[#0a0a0a]"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-[1] w-[min(1280px,92vw)] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-[clamp(30px,5vh,60px)]">
          <div>
            <div
              className={cn(
                "font-archivo text-xs tracking-[0.34em] uppercase mb-3.5",
                isDark ? "text-[rgba(247,244,238,0.55)]" : "text-[#a39c92]"
              )}
            >
              {eyebrow}
            </div>
            <h2
              className={cn(
                fontClass,
                "font-light text-[clamp(34px,4.4vw,66px)] leading-[0.98] tracking-[0.01em]",
                isDark ? "text-[#f7f4ee]" : "text-[#1a1815]"
              )}
            >
              {title}
            </h2>
          </div>

          <a
            href={ctaHref}
            className={cn(
              "flex-shrink-0 inline-flex items-center gap-2.5 no-underline whitespace-nowrap font-archivo font-medium text-xs tracking-[0.14em] uppercase py-3 px-[22px] rounded-full border transition-all duration-[220ms] hover:gap-3.5",
              isDark
                ? "text-[#f7f4ee] border-[rgba(247,244,238,0.3)] hover:bg-[#f7f4ee] hover:text-[#1a1a1a] hover:border-[#f7f4ee]"
                : "text-[#1a1815] border-[rgba(26,24,21,0.28)] hover:bg-[#1a1815] hover:text-white hover:border-[#1a1815]"
            )}
          >
            {ctaLabel}
            <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-12 gap-x-5 gap-y-[50px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: { duration: 0.5, delay: index * 0.1 },
                  scale: { duration: 0.15 }
                }}
                onClick={(e) => {
                  if (onItemClick) {
                    e.preventDefault();
                    onItemClick(item);
                  }
                }}
                className={cn(
                  "col-span-4 max-lg:col-span-1 flex flex-col gap-3.5 no-underline hover:no-underline text-inherit"
                )}
              >
                <div
                  className={cn(
                    "font-archivo font-light text-xs tracking-[0.2em]",
                    isDark ? "text-[rgba(247,244,238,0.5)]" : "text-[#b3aca2]"
                  )}
                >
                  {item.number}
                </div>
                <div
                  className="w-full h-[300px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  style={{ backgroundColor: item.tileColor || "#f3f1ec" }}
                >
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <div
                    className={cn(
                      fontClass,
                      "font-normal text-[clamp(19px,1.5vw,26px)] leading-[1.08]",
                      isDark ? "text-[#f7f4ee]" : "text-[#1a1815]"
                    )}
                  >
                    {item.name}
                  </div>
                  <div
                    className={cn(
                      "font-archivo text-xs tracking-[0.06em]",
                      isDark ? "text-[rgba(247,244,238,0.55)]" : "text-[#8c867d]"
                    )}
                  >
                    {item.category}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "py-12 text-center font-archivo text-[clamp(15px,1.4vw,19px)] tracking-[0.05em]",
              isDark ? "text-[rgba(244,241,234,0.66)]" : "text-[#8c867d]"
            )}
          >
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
