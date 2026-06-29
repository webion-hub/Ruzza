import { cn } from "../lib/utils";

type MarbleBackgroundProps = {
  readonly imageSrc: string;
  readonly className?: string;
  /** Ambient "liquid veins" motion. On by default; disable to render a static image. */
  readonly animate?: boolean;
};

export function MarbleBackground({
  imageSrc,
  className,
  animate = true,
}: MarbleBackgroundProps) {
  // Both layers are pinned to the viewport (background-attachment: fixed) and
  // clipped to this container's box, so the marble only shows behind the hero +
  // collection and never scrolls — exactly like the original static background.
  const layerStyle = {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  } as const;

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      {/* Base marble image — stays perfectly still. */}
      <div className="absolute inset-0" style={layerStyle} />

      {/* Dark-vein layer: the same image, multiply-blended so only the dark veins
          tint the base (white areas multiply to a no-op). It stays fixed like the
          base, but its `background-position` drifts by ~1% on a slow loop, so the
          dark veins gently flow like liquid while the light marble stays put.
          Only background-position animates — geometry/layout never change. */}
      {animate && (
        <div
          aria-hidden
          className="marble-liquid absolute inset-0"
          style={{
            ...layerStyle,
            mixBlendMode: "multiply",
            filter: "contrast(1.4) brightness(1.05)",
            opacity: 0.62,
          }}
        />
      )}

      {/* Soft vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(42,39,34,0.1) 100%)",
        }}
      />

      <style>{`
        @keyframes marbleLiquid {
          0%   { background-position: 50% 50%; }
          25%  { background-position: 55% 46%; }
          50%  { background-position: 45.5% 55%; }
          75%  { background-position: 54% 52.5%; }
          100% { background-position: 50% 50%; }
        }
        .marble-liquid {
          animation: marbleLiquid 24s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .marble-liquid { animation: none; }
        }
      `}</style>
    </div>
  );
}
