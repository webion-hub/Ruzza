/**
 * Ruzza Design Tokens
 * Schema colori estratto dal design originale
 */

export const colors = {
  // Background
  background: {
    light: "#f6f4f0",
    dark: "#0c0b0a",
    darkAlt: "#0d0c0e",
    hero: "#121113",
  },

  // Ink (Text)
  ink: {
    primary: "#2a2722",
    light: "#f7f4ee",
    lightAlt: "#f2efe9",
    lightSoft: "#f0ece4",
  },

  // Ink Soft (Muted text)
  inkSoft: {
    dark: "rgba(42, 39, 34, 0.62)",
    light: "rgba(244, 241, 234, 0.62)",
    lightAlt: "rgba(244, 241, 234, 0.66)",
  },

  // Accent
  accent: {
    gold: "#b78a4a",
    error: "#c0563f",
  },

  // Nav Glass
  nav: {
    light: {
      bg: "rgba(250, 249, 246, 0.5)",
      border: "rgba(255, 255, 255, 0.5)",
      hover: "rgba(42, 39, 34, 0.06)",
      hoverStrong: "rgba(42, 39, 34, 0.08)",
      divider: "rgba(42, 39, 34, 0.14)",
    },
    dark: {
      bg: "rgba(22, 21, 24, 0.42)",
      border: "rgba(255, 255, 255, 0.14)",
      hover: "rgba(255, 255, 255, 0.08)",
      hoverStrong: "rgba(255, 255, 255, 0.12)",
      divider: "rgba(255, 255, 255, 0.16)",
    },
  },

  // Menu
  menu: {
    light: {
      bg: "rgba(252, 251, 248, 0.72)",
      border: "rgba(255, 255, 255, 0.55)",
      rule: "rgba(42, 39, 34, 0.1)",
    },
    dark: {
      bg: "rgba(28, 27, 30, 0.72)",
      border: "rgba(255, 255, 255, 0.14)",
      rule: "rgba(255, 255, 255, 0.12)",
    },
  },

  // Telegram Button
  telegram: {
    light: {
      bg: "#2a2722",
      fg: "#f4f1ea",
    },
    dark: {
      bg: "#f2efe9",
      fg: "#1a1a1d",
    },
  },

  // Sections
  section: {
    gallery: "#ffffff",
    chiSono: "#0a0a0a",
    footer: "rgba(13, 12, 14, 0.9)",
  },

  // Marble Palettes
  marble: {
    carrara: ["#f6f4f0", "#a7a198", "#7d776d"],
    calacatta: ["#f4f1e9", "#b3a896", "#857a66"],
    grigio: ["#eceae6", "#8d9097", "#585b62"],
    nero: ["#17171b", "#5b5b66", "#070708"],
    verde: ["#e6ebe7", "#4f8073", "#2c4f44"],
  },
} as const;

export const fonts = {
  title: "'Libre Baskerville', 'Cormorant Garamond', Georgia, serif",
  titleAlt: "'Cormorant Garamond', Georgia, serif",
  body: "'Archivo', system-ui, sans-serif",
} as const;

export const spacing = {
  headerTop: "clamp(12px, 1.9vw, 26px)",
  sectionPadding: "clamp(64px, 9vh, 120px)",
  containerWidth: "min(1280px, 92vw)",
} as const;

export const shadows = {
  nav: {
    light: "0 12px 40px -16px rgba(40, 36, 30, 0.3)",
    dark: "0 14px 44px -16px rgba(0, 0, 0, 0.55)",
  },
  menu: "0 18px 50px -16px rgba(0, 0, 0, 0.4)",
  button: "0 8px 20px -8px rgba(40, 36, 30, 0.6)",
  card: "0 1px 2px rgba(0, 0, 0, 0.04)",
} as const;

export const transitions = {
  fast: "0.18s ease",
  normal: "0.22s ease",
  slow: "0.35s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
