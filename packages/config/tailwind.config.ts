import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        ruzza: {
          // Background
          "bg-light": "#f6f4f0",
          "bg-dark": "#0c0b0a",
          "bg-dark-alt": "#0d0c0e",
          "bg-hero": "#121113",

          // Ink (Text)
          ink: "#2a2722",
          "ink-light": "#f7f4ee",
          "ink-light-alt": "#f2efe9",
          "ink-soft": "#f0ece4",

          // Accent
          gold: "#b78a4a",
          error: "#c0563f",

          // Sections
          gallery: "#ffffff",
          "chi-sono": "#0a0a0a",
        },
      },
      fontFamily: {
        title: ["Libre Baskerville", "Cormorant Garamond", "Georgia", "serif"],
        "title-alt": ["Cormorant Garamond", "Georgia", "serif"],
        archivo: ["Archivo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "ruzza-nav-light": "0 12px 40px -16px rgba(40, 36, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.65)",
        "ruzza-nav-dark": "0 14px 44px -16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        "ruzza-menu": "0 18px 50px -16px rgba(0, 0, 0, 0.4)",
        "ruzza-button": "0 8px 20px -8px rgba(40, 36, 30, 0.6)",
        "ruzza-card": "0 1px 2px rgba(0, 0, 0, 0.04)",
      },
      transitionTimingFunction: {
        "ruzza-smooth": "cubic-bezier(0.2, 0.7, 0.2, 1)",
        "ruzza-bounce": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "cue-bob": "cueBob 2.2s ease-in-out infinite",
      },
      keyframes: {
        cueBob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
    },
  },
};

export default config;
