"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type NavLink = {
  readonly label: string;
  readonly href: string;
  readonly isActive?: boolean;
};

type NavDropdownItem = {
  readonly label: string;
  readonly href: string;
  readonly isViewAll?: boolean;
};

type NavDropdown = {
  readonly label: string;
  readonly items: readonly NavDropdownItem[];
};

type HeaderProps = {
  readonly logoSrc: string;
  readonly logoAlt?: string;
  readonly links?: readonly NavLink[];
  readonly dropdowns?: readonly NavDropdown[];
  readonly telegramHref?: string;
  readonly telegramLabel?: string;
  readonly searchPlaceholder?: string;
  readonly cartAriaLabel?: string;
  readonly searchAriaLabel?: string;
  readonly onSearch?: (query: string) => void;
  readonly onCartClick?: () => void;
  readonly theme?: "light" | "dark";
  readonly className?: string;
};

export function Header({
  logoSrc,
  logoAlt = "Ruzza",
  links = [],
  dropdowns = [],
  telegramHref = "#",
  telegramLabel = "Canale Telegram",
  searchPlaceholder = "Cerca nel catalogo...",
  cartAriaLabel = "Carrello",
  searchAriaLabel = "Cerca",
  onSearch,
  onCartClick,
  theme = "light",
  className,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setSearchQuery("");
      onSearch?.("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "fixed top-[clamp(12px,1.9vw,26px)] left-0 right-0 z-[1500] flex justify-center px-[clamp(12px,2vw,28px)]",
        className
      )}
      data-theme={theme}
    >
      <div
        className={cn(
          "relative inline-flex items-center gap-[clamp(6px,0.8vw,13px)] px-[clamp(8px,0.8vw,13px)] py-[clamp(6px,0.55vw,9px)] rounded-full",
          "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:backdrop-blur-[20px] before:saturate-150 before:-z-10",
          isDark
            ? "before:bg-[rgba(22,21,24,0.42)] before:border before:border-[rgba(255,255,255,0.14)] before:shadow-[0_14px_44px_-16px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "before:bg-[rgba(250,249,246,0.5)] before:border before:border-[rgba(255,255,255,0.5)] before:shadow-[0_12px_40px_-16px_rgba(40,36,30,0.3),inset_0_1px_0_rgba(255,255,255,0.65)]"
        )}
      >
        {/* Logo */}
        <a href="#" className="flex-shrink-0 block leading-none" aria-label={logoAlt}>
          <img
            src={logoSrc}
            alt={logoAlt}
            className={cn(
              "w-[clamp(36px,2.9vw,50px)] h-[clamp(36px,2.9vw,50px)] object-contain transition-[filter] duration-[250ms]",
              isDark && "invert brightness-[1.6]"
            )}
          />
        </a>

        {/* Nav Links */}
        <nav
          className={cn(
            "flex items-center gap-[clamp(2px,0.35vw,7px)] max-w-[1000px] transition-all duration-[350ms]",
            isSearchOpen && "max-w-0 opacity-0 pointer-events-none overflow-hidden -translate-x-2.5"
          )}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "font-archivo font-normal text-[clamp(11px,0.92vw,15px)] tracking-[0.03em] px-[18px] py-2 rounded inline-flex items-center gap-[5px] whitespace-nowrap no-underline transition-all duration-[180ms]",
                isDark ? "text-[#f2efe9] hover:bg-[rgba(255,255,255,0.08)]" : "text-[#2a2722] hover:bg-[rgba(42,39,34,0.06)]",
                link.isActive && (isDark ? "font-medium bg-[rgba(255,255,255,0.12)]" : "font-medium bg-[rgba(42,39,34,0.08)]")
              )}
            >
              {link.label}
            </a>
          ))}

          {/* Dropdowns */}
          {dropdowns.map((dropdown) => (
            <div
              key={dropdown.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(dropdown.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className={cn(
                  "font-archivo font-normal text-[clamp(11px,0.92vw,15px)] tracking-[0.03em] px-[18px] py-2 rounded inline-flex items-center gap-[5px] whitespace-nowrap bg-transparent border-0 cursor-pointer transition-all duration-[180ms]",
                  isDark ? "text-[#f2efe9] hover:bg-[rgba(255,255,255,0.08)]" : "text-[#2a2722] hover:bg-[rgba(42,39,34,0.06)]"
                )}
              >
                {dropdown.label}
                <svg
                  className={cn(
                    "w-[0.62em] h-[0.62em] flex-shrink-0 opacity-70 transition-transform duration-[220ms]",
                    openDropdown === dropdown.label && "rotate-180"
                  )}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2.5 4.5 6 8l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                style={{
                  display: openDropdown === dropdown.label ? 'flex' : 'none',
                }}
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[220px] flex-col p-2 rounded-[14px] backdrop-blur-[24px] saturate-150 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.4)]",
                  "before:content-[''] before:absolute before:bottom-full before:left-0 before:right-0 before:h-[14px]",
                  isDark
                    ? "bg-[rgba(28,27,30,0.72)] border border-[rgba(255,255,255,0.14)]"
                    : "bg-[rgba(252,251,248,0.72)] border border-[rgba(255,255,255,0.55)]"
                )}
              >
                {dropdown.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "font-archivo text-[clamp(11px,0.88vw,14px)] tracking-[0.02em] no-underline py-[9px] px-3 rounded-[9px] transition-all duration-[160ms]",
                      isDark
                        ? "text-[#f2efe9] hover:bg-[rgba(255,255,255,0.12)] hover:pl-4"
                        : "text-[#2a2722] hover:bg-[rgba(42,39,34,0.08)] hover:pl-4",
                      item.isViewAll && cn(
                        "mt-1 pt-3 font-medium",
                        isDark ? "border-t border-[rgba(255,255,255,0.12)]" : "border-t border-[rgba(42,39,34,0.1)]"
                      )
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Search Input (expanded) */}
        <form
          role="search"
          autoComplete="off"
          className={cn(
            "flex-[0_0_0] w-0 min-w-0 p-0 h-[clamp(30px,2.4vw,38px)] flex items-center gap-2.5 rounded-full opacity-0 pointer-events-none overflow-hidden transition-all duration-[350ms]",
            isDark ? "bg-[rgba(255,255,255,0.08)]" : "bg-[rgba(42,39,34,0.06)]",
            isSearchOpen && "flex-[1_1_auto] w-auto opacity-100 pointer-events-auto px-[clamp(12px,1vw,18px)] ml-[clamp(6px,0.8vw,13px)]"
          )}
          onSubmit={(e) => e.preventDefault()}
        >
          <svg
            className={cn("w-[17px] h-[17px] flex-shrink-0 opacity-60", isDark ? "text-[#f2efe9]" : "text-[#2a2722]")}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Escape" && handleSearchToggle()}
            className={cn(
              "flex-[1_1_auto] min-w-0 w-full appearance-none bg-transparent border-0 outline-none font-archivo text-[clamp(12px,0.95vw,15px)] tracking-[0.01em]",
              isDark ? "text-[#f2efe9] placeholder:text-[#f2efe9]/45" : "text-[#2a2722] placeholder:text-[#2a2722]/45"
            )}
          />
        </form>

        {/* Divider */}
        <div
          className={cn(
            "w-px self-stretch my-[clamp(4px,0.5vw,8px)] mx-[clamp(2px,0.3vw,5px)] transition-opacity duration-[200ms]",
            isDark ? "bg-[rgba(255,255,255,0.16)]" : "bg-[rgba(42,39,34,0.14)]",
            isSearchOpen && "opacity-0"
          )}
        />

        {/* Actions */}
        <div
          className={cn(
            "flex items-center gap-[clamp(2px,0.35vw,6px)] flex-shrink-0 max-w-[460px] transition-all duration-[350ms]",
            isSearchOpen && "max-w-0 opacity-0 pointer-events-none overflow-hidden"
          )}
        >
          {/* Search Button */}
          <button
            type="button"
            aria-label={searchAriaLabel}
            onClick={handleSearchToggle}
            className={cn(
              "appearance-none border-0 bg-transparent cursor-pointer w-[clamp(30px,2.4vw,38px)] h-[clamp(30px,2.4vw,38px)] grid place-items-center rounded-full transition-colors duration-[180ms]",
              isDark ? "text-[#f2efe9] hover:bg-[rgba(255,255,255,0.12)]" : "text-[#2a2722] hover:bg-[rgba(42,39,34,0.08)]"
            )}
          >
            <svg className="w-[46%] h-[46%]" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            aria-label={cartAriaLabel}
            onClick={onCartClick}
            className={cn(
              "appearance-none border-0 bg-transparent cursor-pointer w-[clamp(30px,2.4vw,38px)] h-[clamp(30px,2.4vw,38px)] grid place-items-center rounded-full transition-colors duration-[180ms]",
              isDark ? "text-[#f2efe9] hover:bg-[rgba(255,255,255,0.12)]" : "text-[#2a2722] hover:bg-[rgba(42,39,34,0.08)]"
            )}
          >
            <svg className="w-[46%] h-[46%]" viewBox="0 0 24 24" fill="none">
              <path d="M7 8h10l-1 12H8L7 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9.5 9V6.5a2.5 2.5 0 0 1 5 0V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Telegram Button */}
          <a
            href={telegramHref}
            className={cn(
              "appearance-none cursor-pointer border-0 ml-[clamp(1px,0.2vw,4px)] inline-flex items-center gap-1.5 font-archivo font-medium text-[clamp(9px,0.74vw,12px)] tracking-[0.07em] uppercase py-[clamp(7px,0.7vw,11px)] px-[clamp(11px,1.05vw,16px)] rounded-full whitespace-nowrap no-underline transition-all duration-[180ms] hover:-translate-y-px",
              isDark
                ? "bg-[#f2efe9] text-[#1a1a1d] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
                : "bg-[#2a2722] text-[#f4f1ea] hover:shadow-[0_8px_20px_-8px_rgba(40,36,30,0.6)]"
            )}
          >
            <svg className="w-[1.05em] h-[1.05em]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.5 3.5 2.8 10.9c-1.1.4-1.1 1.6-.2 1.9l4.7 1.5 1.8 5.6c.2.7.7.9 1.3.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.7l3.2-15.1c.2-1-.5-1.7-1.5-1.6Zm-3.6 4-7.6 6.9-.3 3.4-1.5-4.7 9-5.9c.4-.3.9.2.4.3Z" />
            </svg>
            {telegramLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
