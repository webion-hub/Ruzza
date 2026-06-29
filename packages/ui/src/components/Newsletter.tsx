"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type NewsletterProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly emailLabel?: string;
  readonly emailPlaceholder?: string;
  readonly privacyLabel: string;
  readonly privacyLinkText?: string;
  readonly privacyLinkHref?: string;
  readonly submitLabel?: string;
  readonly requiredIndicator?: string;
  readonly onSubmit?: (email: string, acceptedPrivacy: boolean) => void;
  readonly className?: string;
};

export function Newsletter({
  title,
  subtitle,
  emailLabel = "La tua email",
  emailPlaceholder = "",
  privacyLabel,
  privacyLinkText = "informativa sulla privacy",
  privacyLinkHref = "#",
  submitLabel = "Registrati",
  requiredIndicator = "*",
  onSubmit,
  className,
}: NewsletterProps) {
  const [email, setEmail] = React.useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, acceptedPrivacy);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-[clamp(40px,6vw,120px)] items-start max-lg:grid-cols-1 max-lg:gap-10", className)}>
      {/* Left Column */}
      <div className="w-full max-w-[560px]">
        <h2 className="m-0 text-[clamp(26px,2.4vw,42px)] font-medium tracking-[0.06em] uppercase leading-[1.05] text-[#f7f4ee] text-balance">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-7 max-w-[38ch] w-full text-[clamp(16px,1.2vw,20px)] leading-[1.5] text-[rgba(247,244,238,0.62)]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Column - Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[520px] text-left"
      >
        <label
          htmlFor="newsletter-email"
          className="font-archivo text-[13px] tracking-[0.12em] uppercase text-[rgba(247,244,238,0.7)]"
        >
          {emailLabel} <span className="text-[#c0563f]">{requiredIndicator}</span>
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          required
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-3.5 w-full bg-transparent border-0 border-b border-[rgba(247,244,238,0.3)] py-2 font-archivo text-base text-[#f7f4ee] outline-none transition-colors duration-[200ms] focus:border-[rgba(247,244,238,0.7)]"
        />

        <label className="flex gap-3.5 items-start mt-[30px] max-w-full cursor-pointer">
          <input
            type="checkbox"
            required
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className={cn(
              "appearance-none w-5 h-5 flex-shrink-0 mt-px border border-[rgba(247,244,238,0.4)] bg-transparent cursor-pointer grid place-items-center transition-all duration-[180ms]",
              "checked:bg-[#f7f4ee] checked:border-[#f7f4ee]",
              "checked:after:content-[''] checked:after:w-[5px] checked:after:h-[10px] checked:after:border-[#14130f] checked:after:border-solid checked:after:border-[0_2px_2px_0] checked:after:rotate-45 checked:after:-translate-y-px"
            )}
          />
          <span className="font-archivo text-sm leading-[1.5] text-[rgba(247,244,238,0.62)]">
            {privacyLabel}{" "}
            <a
              href={privacyLinkHref}
              className="text-[rgba(247,244,238,0.62)] underline underline-offset-[3px]"
            >
              {privacyLinkText}
            </a>
            .<span className="whitespace-nowrap">&nbsp;<span className="text-[#c0563f]">{requiredIndicator}</span></span>
          </span>
        </label>

        <button
          type="submit"
          className="self-start mt-[34px] cursor-pointer appearance-none border-0 bg-[#f7f4ee] text-[#14130f] font-archivo font-semibold text-xs tracking-[0.16em] uppercase py-[18px] px-[clamp(28px,4vw,42px)] rounded-full transition-opacity duration-[180ms] hover:opacity-[0.85]"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
