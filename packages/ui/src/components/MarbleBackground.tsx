"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type MarbleBackgroundProps = {
  readonly imageSrc: string;
  readonly className?: string;
};

export function MarbleBackground({ imageSrc, className }: MarbleBackgroundProps) {
  const filterId = React.useId().replace(/:/g, "");

  return (
    <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      {/* SVG Filters for liquid effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Liquid distortion filter */}
          <filter id={`liquid-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.005"
              numOctaves="2"
              seed="1"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.003 0.005;0.006 0.003;0.003 0.005"
                dur="45s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values="22;32;22"
                dur="35s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>

          {/* Stronger liquid filter for dark veins layer */}
          <filter id={`liquid-strong-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0025 0.004"
              numOctaves="2"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.0025 0.004;0.005 0.0025;0.0025 0.004"
                dur="55s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="35"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values="35;50;35"
                dur="40s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      {/* Base marble layer - flowing movement */}
      <motion.div
        className="absolute inset-[-20%] w-[140%] h-[140%]"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `url(#liquid-${filterId})`,
        }}
        animate={{
          x: [0, 14, -10, 7, 0],
          y: [0, -10, 8, -5, 0],
          scale: [1, 1.012, 1.006, 1.015, 1],
        }}
        transition={{
          duration: 60,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Dark veins layer - flowing effect */}
      <motion.div
        className="absolute inset-[-25%] w-[150%] h-[150%] mix-blend-multiply opacity-35"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "110% 110%",
          backgroundPosition: "center",
          filter: `url(#liquid-strong-${filterId}) contrast(1.35) saturate(0.75)`,
        }}
        animate={{
          x: [0, -20, 14, -10, 0],
          y: [0, 14, -20, 16, 0],
          rotate: [0, 0.5, -0.3, 0.25, 0],
        }}
        transition={{
          duration: 75,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Third layer - overlay for depth */}
      <motion.div
        className="absolute inset-[-15%] w-[130%] h-[130%] mix-blend-overlay opacity-25"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "130% 130%",
          backgroundPosition: "center",
          filter: `url(#liquid-strong-${filterId})`,
        }}
        animate={{
          x: [0, 16, -12, 10, 0],
          y: [0, -16, 12, -10, 0],
          scale: [1, 1.02, 0.985, 1.015, 1],
        }}
        transition={{
          duration: 90,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />


      {/* Caustic light effect - subtle pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-12"
        style={{
          background: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.35) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.25) 0%, transparent 40%)",
        }}
        animate={{
          opacity: [0.12, 0.18, 0.08, 0.15, 0.12],
          scale: [1, 1.06, 0.96, 1.04, 1],
        }}
        transition={{
          duration: 25,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatType: "reverse",
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
