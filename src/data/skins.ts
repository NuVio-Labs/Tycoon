export type Skin = {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number; // in XP, 0 = von Anfang an freigeschaltet
  // Vorschau-Farben für den Shop (bg, card, accent)
  preview: [string, string, string];
};

export const skins: Skin[] = [
  {
    id: "standard",
    name: "NuVio Gold",
    description: "Das Original. Dunkel, edel, gold — so wie NuVio.",
    icon: "✨",
    price: 0,
    preview: ["#050505", "#111111", "#E0B84A"],
  },
  {
    id: "skin-dark-pro",
    name: "Dark Pro",
    description: "Dunkleres, kontrastreicheres Theme für die Profis.",
    icon: "🌑",
    price: 500,
    preview: ["#000000", "#0B0B0D", "#FFD75E"],
  },
  {
    id: "skin-retro",
    name: "Retro Terminal",
    description: "Grüner Phosphor auf Schwarz. Wie 1985.",
    icon: "💚",
    price: 750,
    preview: ["#010A04", "#04180C", "#2BFF6F"],
  },
  {
    id: "skin-neon",
    name: "Neon City",
    description: "Lila & Pink. Cyberpunk trifft Kinderzimmer.",
    icon: "🌆",
    price: 1000,
    preview: ["#0B0216", "#170B2C", "#FF5EDB"],
  },
  {
    id: "skin-minimal",
    name: "Minimal White",
    description: "Hell, clean, kein Schnickschnack.",
    icon: "⬜",
    price: 1200,
    preview: ["#F4F2EC", "#FFFFFF", "#B8923A"],
  },
];
