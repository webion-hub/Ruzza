import { cn } from "../lib/utils";

type MarbleBackgroundProps = {
  readonly imageSrc: string;
  readonly className?: string;
};

export function MarbleBackground({ imageSrc, className }: MarbleBackgroundProps) {
  return (
    <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      {/* Static marble background - optimized for performance */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
