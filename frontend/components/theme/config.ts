export const THEME_CONFIG = {
  storageKey: "desafio-frontend-theme",
  defaultTheme: "system" as const,
  themes: ["light", "dark", "system"] as const,
} as const;

export type Theme = (typeof THEME_CONFIG.themes)[number];
export type ResolvedTheme = "light" | "dark";
