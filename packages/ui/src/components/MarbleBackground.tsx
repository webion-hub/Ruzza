import { cn } from "../lib/utils";

type MarbleBackgroundProps = {
  readonly imageSrc: string;
  readonly className?: string;
};

export function MarbleBackground({ imageSrc, className }: MarbleBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      {/* Marble image fixed to the viewport (doesn't scroll) but clipped to this
          container, so it only shows where the container is (hero + collection). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Soft vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(42,39,34,0.1) 100%)",
        }}
      />
    </div>
  );
}
