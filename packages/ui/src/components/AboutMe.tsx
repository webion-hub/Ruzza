"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "../lib/utils";

type AboutMeProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly body: string;
  readonly imageSrc: string;
  readonly imageAlt?: string;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly enableParallax?: boolean;
  readonly className?: string;
};

export function AboutMe({
  eyebrow = "Chi sono",
  title,
  body,
  imageSrc,
  imageAlt = "",
  titleFont = "cormorant",
  enableParallax = true,
  className,
}: AboutMeProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Separate scroll tracking for the image container
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const bodyY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  // Parallax: image moves slower than scroll, creating depth effect
  const imageYRaw = useTransform(imageScrollProgress, [0, 1], [-70, 70]);
  const imageY = useSpring(imageYRaw, { stiffness: 100, damping: 30, mass: 1 });

  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative z-[3] bg-[#0a0a0a] text-[#f7f4ee] flex flex-col items-center text-center pt-[clamp(50px,8vh,100px)] pb-0 px-5 overflow-visible",
        className
      )}
    >
      {/* Eyebrow */}
      <div className="z-[5] font-archivo text-[13px] tracking-[0.34em] uppercase text-[rgba(247,244,238,0.6)] mb-[clamp(60px,12vh,120px)]">
        {eyebrow}
      </div>

      {/* Title */}
      <motion.h2
        style={enableParallax ? { y: titleY } : undefined}
        className={cn(
          fontClass,
          "z-[3] font-medium text-[clamp(64px,12vw,168px)] leading-[0.86] tracking-[0.02em] uppercase text-[#f7f4ee] text-center pointer-events-none select-none will-change-transform"
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {/* Body */}
      <motion.p
        style={enableParallax ? { y: bodyY } : undefined}
        className="z-[3] max-w-[560px] mt-[clamp(24px,4vh,40px)] mx-auto font-archivo text-[clamp(15px,1.1vw,18px)] leading-[1.8] text-[rgba(247,244,238,0.75)] text-balance will-change-transform"
      >
        {body}
      </motion.p>

      {/* Figure - parallax image container */}
      <motion.div
        ref={imageContainerRef}
        style={enableParallax ? { y: figureY } : undefined}
        className="relative z-[100] w-[min(900px,80vw)] mt-[clamp(24px,4vh,48px)] mb-[-180px] flex justify-center will-change-transform"
      >
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          style={enableParallax ? { y: imageY } : undefined}
          className="w-full h-auto block object-contain will-change-transform"
        />
      </motion.div>
    </section>
  );
}
