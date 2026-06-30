import { cn } from "../lib/utils";

type HeroProps = {
  readonly title: string;
  readonly eyebrow?: string;
  readonly tagline?: string;
  readonly description?: string;
  readonly showRule?: boolean;
  readonly scrollCueText?: string;
  readonly scrollCueBadge?: string;
  readonly scrollCueAriaLabel?: string;
  readonly onScrollCueClick?: () => void;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly titleSize?: "default" | "small" | "xs";
  readonly theme?: "light" | "dark";
  readonly className?: string;
};

export function Hero({
  title,
  eyebrow,
  tagline,
  description,
  showRule = true,
  scrollCueText = "Nuovi arrivi",
  scrollCueBadge,
  scrollCueAriaLabel = "Scopri i nuovi arrivi",
  onScrollCueClick,
  titleFont = "libre-baskerville",
  titleSize = "default",
  theme = "light",
  className,
}: HeroProps) {
  const isDark = theme === "dark";

  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  const titleSizeClass = {
    default: "text-[clamp(56px,16vw,340px)]",
    small: "text-[clamp(48px,12vw,200px)]",
    xs: "text-[clamp(40px,9vw,150px)]",
  }[titleSize];

  return (
    <section
      className={cn(
        "relative z-[2] min-h-screen min-h-[100svh] flex flex-col items-center justify-center text-center px-[6vw] bg-transparent",
        className
      )}
    >
      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center">
        <h1
          className={cn(
            fontClass,
            "hero-rise font-light leading-[0.92] text-balance",
            titleSizeClass,
            "[font-kerning:none] [font-feature-settings:'kern'_0,'liga'_0]",
            "[text-rendering:geometricPrecision]",
            isDark ? "text-[#f7f4ee]" : "text-[#2a2722]"
          )}
          style={{animationDelay: "0.05s"}}
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
        </h1>

        {showRule && (
          <div
            className={cn(
              "hero-line w-[clamp(160px,26vw,420px)] h-px opacity-70 origin-center",
              isDark ? "bg-[rgba(244,241,234,0.6)]" : "bg-[rgba(42,39,34,0.62)]"
            )}
            style={{animationDelay: "0.28s"}}
          />
        )}

        {eyebrow && (
          <div
            className={cn(
              fontClass,
              "hero-rise font-normal text-[clamp(12px,1.1vw,22px)] tracking-[0.42em] uppercase mt-[clamp(14px,1.8vw,28px)] pl-[0.42em]",
              isDark ? "text-[rgba(244,241,234,0.62)]" : "text-[rgba(42,39,34,0.62)]"
            )}
            style={{animationDelay: "0.42s"}}
          >
            {eyebrow}
          </div>
        )}

        {tagline && (
          <div
            className={cn(
              "hero-rise font-archivo font-medium text-[clamp(12px,1.1vw,18px)] tracking-[0.2em] uppercase mt-[clamp(40px,5vw,80px)]",
              isDark ? "text-[#f7f4ee]" : "text-[#2a2722]"
            )}
            style={{animationDelay: "0.55s"}}
          >
            {tagline}
          </div>
        )}

        {description && (
          <p
            className={cn(
              "hero-rise font-archivo font-normal text-[clamp(13px,1vw,17px)] leading-[1.7] max-w-[90vw] sm:max-w-[600px] mt-[clamp(16px,1.5vw,24px)] px-4 sm:px-0",
              isDark ? "text-[rgba(244,241,234,0.7)]" : "text-[rgba(42,39,34,0.7)]"
            )}
            style={{animationDelay: "0.65s"}}
          >
            {description}
          </p>
        )}
      </div>

      {/* Scroll Cue */}
      {scrollCueText && (
        <div className="absolute bottom-[clamp(18px,3.4vh,42px)] left-0 right-0 flex justify-center">
          <button
            type="button"
            aria-label={scrollCueAriaLabel}
            onClick={onScrollCueClick}
            className={cn(
              "appearance-none bg-transparent border-0 cursor-pointer flex flex-col items-center gap-2.5 font-archivo text-[clamp(9px,0.78vw,12px)] uppercase transition-colors duration-200",
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
              className="w-[22px] h-[22px]"
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
          </button>
        </div>
      )}

      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroLine {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 0.7; transform: scaleX(1); }
        }
        .hero-rise { animation: heroRise 0.7s cubic-bezier(0.22,0.7,0.2,1) both; }
        .hero-line { animation: heroLine 0.85s cubic-bezier(0.22,0.7,0.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise, .hero-line { animation: none; }
        }
      `}</style>
    </section>
  );
}
