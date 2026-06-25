import { cn } from "../lib/utils";

type AboutMeProps = {
  readonly eyebrow?: string;
  readonly title: string;
  readonly body: string;
  readonly imageSrc: string;
  readonly imageAlt?: string;
  readonly titleFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly className?: string;
};

export function AboutMe({
  eyebrow = "Chi sono",
  title,
  body,
  imageSrc,
  imageAlt = "",
  titleFont = "cormorant",
  className,
}: AboutMeProps) {
  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[titleFont];

  return (
    <section
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
      <h2
        className={cn(
          fontClass,
          "z-[3] font-medium text-[clamp(64px,12vw,168px)] leading-[0.86] tracking-[0.02em] uppercase text-[#f7f4ee] text-center pointer-events-none select-none"
        )}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {/* Body */}
      <p className="z-[3] max-w-[560px] mt-[clamp(24px,4vh,40px)] mx-auto font-archivo text-[clamp(15px,1.1vw,18px)] leading-[1.8] text-[rgba(247,244,238,0.75)] text-balance">
        {body}
      </p>

      {/* Figure */}
      <div className="relative z-[100] w-[min(900px,80vw)] mt-[clamp(24px,4vh,48px)] mb-[-180px] flex justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto block object-contain"
        />
      </div>
    </section>
  );
}
