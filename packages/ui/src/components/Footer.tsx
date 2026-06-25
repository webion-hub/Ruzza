"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type FooterLink = {
  readonly label: string;
  readonly href: string;
};

type FooterColumn = {
  readonly title: string;
  readonly content: React.ReactNode;
};

type FooterProps = {
  readonly columns: readonly FooterColumn[];
  readonly copyrightText: string;
  readonly legalLinks?: readonly FooterLink[];
  readonly wordmark?: string;
  readonly wordmarkFont?: "libre-baskerville" | "cormorant" | "archivo";
  readonly children?: React.ReactNode;
  readonly className?: string;
};

export function Footer({
  columns,
  copyrightText,
  legalLinks = [],
  wordmark,
  wordmarkFont = "libre-baskerville",
  children,
  className,
}: FooterProps) {
  const fontClass = {
    "libre-baskerville": "font-['Libre_Baskerville']",
    cormorant: "font-['Cormorant_Garamond']",
    archivo: "font-archivo",
  }[wordmarkFont];

  return (
    <footer
      className={cn(
        "relative z-[1] bg-[#0a0a0a] text-[#f7f4ee] pt-[250px] pb-[110px] px-20 font-archivo max-lg:pt-[200px] max-lg:pb-[72px] max-lg:px-[clamp(22px,6vw,40px)]",
        className
      )}
    >
      <div className="w-full">
        {/* Newsletter or Custom Content */}
        {children}

        {/* Rule */}
        <div className="h-px bg-[rgba(247,244,238,0.15)] my-20 max-lg:my-14" />

        {/* Columns */}
        <div
          className={cn(
            "grid gap-10",
            columns.length === 3 && "grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1",
            columns.length === 2 && "grid-cols-2 max-sm:grid-cols-1",
            columns.length === 4 && "grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1"
          )}
        >
          {columns.map((column) => (
            <div key={column.title} >
              <div className="m-0 mb-8 font-archivo text-[13px] font-semibold tracking-[0.16em] uppercase text-[#f7f4ee]">
                {column.title}
              </div>
              <div className="[&_p]:m-0 [&_p]:mb-6 [&_p]:text-[15px] [&_p]:leading-[1.5] [&_p]:text-[rgba(247,244,238,0.55)] [&_p:last-child]:mb-0 [&_a]:text-[rgba(247,244,238,0.72)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a]:duration-[180ms] hover:[&_a]:text-[#f7f4ee]">
                {column.content}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center gap-6 mt-[72px] pt-[30px] border-t border-[rgba(247,244,238,0.1)] max-lg:flex-col max-lg:items-start max-lg:gap-4">
          <div className="font-archivo text-xs tracking-[0.1em] uppercase text-[rgba(247,244,238,0.55)]">
            {copyrightText}
          </div>
          {legalLinks.length > 0 && (
            <div className="flex gap-7">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-archivo text-xs tracking-[0.1em] uppercase text-[rgba(247,244,238,0.55)] no-underline transition-colors duration-[180ms] hover:text-[#f7f4ee]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Wordmark - inside content container to align with content */}
        {wordmark && (
          <div
            className={cn(
              fontClass,
              "w-full mt-16 -mb-[2vw] font-normal leading-[0.82] select-none pointer-events-none flex justify-between",
              "bg-gradient-to-b from-[rgba(247,244,238,0.16)] via-[rgba(247,244,238,0.04)] to-transparent bg-clip-text text-transparent"
            )}
            style={{ fontSize: "clamp(90px, 25vw, 450px)" }}
          >
            {wordmark.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

// Helper components for footer content
type FooterContactProps = {
  readonly phone?: string;
  readonly phoneLabel?: string;
  readonly email?: string;
  readonly emailLabel?: string;
};

export function FooterContact({ phone, phoneLabel = "Telefono", email, emailLabel = "Email" }: FooterContactProps) {
  return (
    <>
      {phone && (
        <p>
          {phoneLabel}
          <br />
          <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
        </p>
      )}
      {email && (
        <p>
          {emailLabel}
          <br />
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </>
  );
}

type FooterStoreProps = {
  readonly hours: string;
  readonly hoursLabel?: string;
  readonly address: string;
};

export function FooterStore({ hours, hoursLabel, address }: FooterStoreProps) {
  return (
    <>
      {hoursLabel && <p>{hoursLabel}<br />{hours}</p>}
      {!hoursLabel && <p>{hours}</p>}
      <p style={{ whiteSpace: "pre-line" }}>{address}</p>
    </>
  );
}

type FooterSocialProps = {
  readonly links: readonly FooterLink[];
};

export function FooterSocial({ links }: FooterSocialProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="w-max text-[rgba(247,244,238,0.72)] no-underline font-archivo text-[15px] transition-colors duration-[180ms] hover:text-[#f7f4ee]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
