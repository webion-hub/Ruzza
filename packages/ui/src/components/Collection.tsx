"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type ProductVariant = {
  readonly id: string;
  readonly title: string;
  readonly price: string;
  readonly available: boolean;
};

type CollectionItem = {
  readonly id: string;
  readonly number?: string;
  readonly name: string;
  readonly subtitle?: string;
  readonly category?: string;
  readonly price?: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly href: string;
  readonly tileColor?: string;
  readonly badge?: string;
  readonly available?: boolean;
  readonly variants?: readonly ProductVariant[];
};

type CollectionProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly showCta?: boolean;
  readonly items: readonly CollectionItem[];
  readonly emptyMessage?: string;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly theme?: "light" | "dark";
  readonly cardStyle?: "default" | "watch";
  readonly addToCartLabel?: string;
  readonly unavailableLabel?: string;
  readonly className?: string;
  readonly onItemClick?: (item: CollectionItem) => void;
  readonly onAddToCart?: (item: CollectionItem) => void;
};

export function Collection({
  eyebrow = "Collezione",
  title,
  description,
  ctaLabel = "Visualizza tutto",
  ctaHref = "#",
  showCta = true,
  items,
  emptyMessage = "Nessun prodotto trovato",
  titleFont = "libre-baskerville",
  theme = "light",
  cardStyle = "default",
  addToCartLabel = "AGGIUNGI",
  unavailableLabel = "NON DISPONIBILE",
  className,
  onItemClick,
  onAddToCart,
}: CollectionProps) {
  const isDark = theme === "dark";
  const sectionRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isDark || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isDark]);

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
      {/* Dark overlay - fades in when section becomes visible */}
      {isDark && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 -top-[100vh] z-0 pointer-events-none bg-[#0a0a0a] transition-opacity duration-700 ease-out",
            isVisible ? "opacity-95" : "opacity-0"
          )}
        />
      )}
      <div className={cn(
        "relative z-[1] mx-auto px-4 sm:px-0",
        cardStyle === "watch" ? "w-full sm:w-[min(1440px,94vw)]" : "w-[min(1280px,92vw)]"
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-[clamp(30px,5vh,60px)]">
          <div className={cardStyle === "watch" ? "max-w-full sm:max-w-[500px]" : ""}>
            <div
              className={cn(
                "font-archivo text-[10px] sm:text-xs tracking-[0.34em] uppercase mb-2 sm:mb-3.5",
                isDark ? "text-[rgba(247,244,238,0.55)]" : "text-[#a39c92]"
              )}
            >
              {eyebrow}
            </div>
            <h2
              className={cn(
                fontClass,
                "font-light text-[24px] sm:text-[clamp(28px,3.5vw,48px)] leading-[1.1] sm:leading-[1.02] tracking-[0.01em]",
                isDark ? "text-[#f7f4ee]" : "text-[#1a1815]"
              )}
            >
              {title}
            </h2>
          </div>

          {description && cardStyle === "watch" ? (
            <p
              className={cn(
                "font-archivo text-[12px] sm:text-[13px] leading-[1.6] text-left sm:text-right max-w-full sm:max-w-[240px]",
                isDark ? "text-[rgba(247,244,238,0.6)]" : "text-[#8c867d]"
              )}
            >
              {description}
            </p>
          ) : showCta ? (
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
          ) : null}
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className={cn(
            "grid gap-x-5 gap-y-[50px]",
            cardStyle === "watch"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "grid-cols-12 max-lg:grid-cols-2 max-sm:grid-cols-1"
          )}>
            {items.map((item) => (
              cardStyle === "watch" ? (
                /* Watch-style product card */
                <div
                  key={item.id}
                  className="flex flex-col rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] transition-all duration-200 hover:scale-[1.005] hover:border-[#c8a35f]"
                >
                  {/* Image section with marble background and badge */}
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (onItemClick) {
                        e.preventDefault();
                        onItemClick(item);
                      }
                    }}
                    className="relative block aspect-square sm:aspect-[4/5] overflow-hidden"
                  >
                    {/* Marble/smoke background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a]">
                      <div
                        className="absolute inset-0 opacity-40"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.009' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                          backgroundSize: 'cover',
                          mixBlendMode: 'overlay',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.3)] via-transparent to-[rgba(255,255,255,0.05)]" />
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "absolute top-3 left-3 sm:top-4 sm:left-4 font-archivo text-[9px] sm:text-[10px] font-medium tracking-[0.1em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded",
                        item.available !== false
                          ? "bg-[#4a5a4a] text-[#c8d4c8]"
                          : "bg-[#3a3a3a] text-[#999999]"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="relative z-[1] w-full h-full object-contain p-4 sm:p-8 drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                    />
                  </a>

                  {/* Info section */}
                  <div className="flex flex-col gap-1 sm:gap-1.5 p-3 sm:p-5 pt-3 sm:pt-4 bg-[#0c0a08] border-t border-[rgba(255,255,255,0.08)]">
                    <div>
                      <h3 className="font-archivo font-semibold text-[13px] sm:text-[15px] tracking-[0.06em] uppercase text-[#f7f4ee]">
                        {item.name}
                      </h3>
                      {item.subtitle && (
                        <p className="font-['Cormorant_Garamond'] italic text-[13px] sm:text-[15px] text-[#a9a395] mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      {item.price && (
                        <span className="font-archivo font-medium text-lg sm:text-xl text-[#f7f4ee]">
                          {item.price}
                        </span>
                      )}
                      {item.available !== false ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.(item);
                          }}
                          className="font-archivo font-medium text-[10px] sm:text-[11px] tracking-[0.1em] uppercase px-3 sm:px-5 py-2 sm:py-2.5 rounded bg-[#1a1815] border border-[rgba(255,255,255,0.15)] text-[#f7f4ee] hover:bg-[#252320] transition-colors"
                        >
                          {addToCartLabel} →
                        </button>
                      ) : (
                        <span className="font-archivo font-medium text-[10px] sm:text-[11px] tracking-[0.1em] uppercase px-3 sm:px-5 py-2 sm:py-2.5 rounded border border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.4)]">
                          {unavailableLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Default card style */
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    if (onItemClick) {
                      e.preventDefault();
                      onItemClick(item);
                    }
                  }}
                  className={cn(
                    "col-span-4 max-lg:col-span-1 flex flex-col gap-3.5 no-underline hover:no-underline text-inherit transition-transform duration-150 hover:scale-[1.02]"
                  )}
                >
                  {item.number && (
                    <div
                      className={cn(
                        "font-archivo font-light text-xs tracking-[0.2em]",
                        isDark ? "text-[rgba(247,244,238,0.5)]" : "text-[#b3aca2]"
                      )}
                    >
                      {item.number}
                    </div>
                  )}
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
                    {item.category && (
                      <div
                        className={cn(
                          "font-archivo text-xs tracking-[0.06em]",
                          isDark ? "text-[rgba(247,244,238,0.55)]" : "text-[#8c867d]"
                        )}
                      >
                        {item.category}
                      </div>
                    )}
                  </div>
                </a>
              )
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
