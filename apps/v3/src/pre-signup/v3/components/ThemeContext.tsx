import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ThemeColors {
  "brand-black": string;
  "brand-dark": string;
  "brand-light": string;
  "brand-blue": string;
  "brand-orange": string;
  "brand-pink": string;
  "brand-yellow": string;
  "brand-peach": string;
}

export interface CtaColor {
  name: string;
  bg: string;
  text: string;
}

export interface Theme {
  id: string;
  name: string;
  preview: string;
  colors: ThemeColors;
  recommendedCta: CtaColor;
}

// CTA Colors Options independent of themes
export const ctaOptions: CtaColor[] = [
  { name: "Orange", bg: "#FEC29F", text: "#131718" },
  { name: "Green", bg: "#A8D5BA", text: "#0F1A0A" },
  { name: "Cyan", bg: "#00F0FF", text: "#0D0E15" },
  { name: "Yellow", bg: "#facc15", text: "#131718" },
  { name: "Pink", bg: "#FF007F", text: "#FFFFFF" },
  { name: "White", bg: "#FFFFFF", text: "#131718" },
  { name: "Black", bg: "#131718", text: "#FFFFFF" },
];

export const paletteThemes: Theme[] = [
  // === PASTEL PALETTES (soft, elegant tones) ===
  {
    id: "p1",
    name: "Original",
    preview: "linear-gradient(135deg, #D1E6F6, #FEC29F, #F7C6D1, #FDE68A)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#0B0D0E",
      "brand-dark": "#15181A",
      "brand-light": "#FAFAF6",
      "brand-blue": "#D1E6F6", // Soft blue
      "brand-orange": "#E8956E",
      "brand-pink": "#F7C6D1", // Soft pink
      "brand-yellow": "#E8C94A",
      "brand-peach": "#F3D9C4", // Soft peach
    },
  },
  {
    id: "p2",
    name: "Blossom",
    preview: "linear-gradient(135deg, #FBBCB0, #C8DEC2, #D4C4F0, #FDE68A)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#1A0A0A",
      "brand-dark": "#2D1515",
      "brand-light": "#FFF9F7",
      "brand-blue": "#FBBCB0", // Coral pink
      "brand-orange": "#D06B50",
      "brand-pink": "#C8DEC2", // Sage green
      "brand-yellow": "#9B82C8",
      "brand-peach": "#D4C4F0", // Lavender
    },
  },
  {
    id: "p3",
    name: "Meadow",
    preview: "linear-gradient(135deg, #C8DEC2, #FAD6A5, #B8D4E8, #F0C6D8)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#0A1F15",
      "brand-dark": "#163A2B",
      "brand-light": "#FCFAF5",
      "brand-blue": "#C8DEC2", // Mint green
      "brand-orange": "#C0854B",
      "brand-pink": "#FAD6A5", // Warm honey
      "brand-yellow": "#5A9AB5",
      "brand-peach": "#B8D4E8", // Sky blue
    },
  },
  {
    id: "p4",
    name: "Dusk",
    preview: "linear-gradient(135deg, #C5D0F0, #F0C6C6, #C0E8D8, #F0D88A)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#0D0E1A",
      "brand-dark": "#1A1C30",
      "brand-light": "#F5F6FC",
      "brand-blue": "#C5D0F0", // Periwinkle
      "brand-orange": "#C87070",
      "brand-pink": "#F0C6C6", // Blush
      "brand-yellow": "#4AAA8A",
      "brand-peach": "#C0E8D8", // Seafoam
    },
  },
  // === SOLID PALETTES (rich, vibrant tones) ===
  {
    id: "p5",
    name: "Carnival",
    preview: "linear-gradient(135deg, #FF8A65, #4DB6AC, #BA68C8, #FFD54F)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#1A0800",
      "brand-dark": "#2D1200",
      "brand-light": "#FFF8F0",
      "brand-blue": "#FFB088", // Tangerine
      "brand-orange": "#E06030",
      "brand-pink": "#80CBC4", // Teal
      "brand-yellow": "#9C27B0",
      "brand-peach": "#BA68C8", // Orchid purple (section bg kept light via opacity)
    },
  },
  {
    id: "p6",
    name: "Tropics",
    preview: "linear-gradient(135deg, #4DD0E1, #F06292, #AED581, #FFB74D)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#002025",
      "brand-dark": "#003840",
      "brand-light": "#F0FDFF",
      "brand-blue": "#B2EBF2", // Turquoise
      "brand-orange": "#E91E63",
      "brand-pink": "#F8BBD0", // Flamingo pink
      "brand-yellow": "#689F38",
      "brand-peach": "#C5E1A5", // Lime green
    },
  },
  {
    id: "p7",
    name: "Autumn",
    preview: "linear-gradient(135deg, #FFAB91, #A1887F, #FFD54F, #81C784)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#1A0E05",
      "brand-dark": "#3E2723",
      "brand-light": "#FFF8F0",
      "brand-blue": "#FFCCBC", // Terra rosa
      "brand-orange": "#BF360C",
      "brand-pink": "#D7CCC8", // Warm taupe
      "brand-yellow": "#F9A825",
      "brand-peach": "#FFE082", // Golden amber
    },
  },
  {
    id: "p8",
    name: "Nordic",
    preview: "linear-gradient(135deg, #90CAF9, #CE93D8, #80CBC4, #FFF176)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#0A1628",
      "brand-dark": "#102040",
      "brand-light": "#F0F5FF",
      "brand-blue": "#BBDEFB", // Ice blue
      "brand-orange": "#5C6BC0",
      "brand-pink": "#E1BEE7", // Soft violet
      "brand-yellow": "#26A69A",
      "brand-peach": "#B2DFDB", // Jade mist
    },
  },
];

export const monochromeThemes: Theme[] = [
  {
    id: "m1",
    name: "Graphite",
    preview: "linear-gradient(135deg, #374151, #6B7280, #9CA3AF, #D1D5DB)",
    recommendedCta: ctaOptions[5], // White
    colors: {
      "brand-black": "#111827",
      "brand-dark": "#1F2937",
      "brand-light": "#F9FAFB",
      "brand-blue": "#D1D5DB", // Grey-300
      "brand-orange": "#6B7280",
      "brand-pink": "#E5E7EB", // Grey-200
      "brand-yellow": "#9CA3AF",
      "brand-peach": "#E5E7EB", // Grey-200
    },
  },
  {
    id: "m2",
    name: "Sapphire",
    preview: "linear-gradient(135deg, #1E3A8A, #3B82F6, #93C5FD, #BFDBFE)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#0C1629",
      "brand-dark": "#1E3A8A",
      "brand-light": "#EFF6FF",
      "brand-blue": "#BFDBFE", // Blue-200
      "brand-orange": "#60A5FA",
      "brand-pink": "#DBEAFE", // Blue-100
      "brand-yellow": "#93C5FD",
      "brand-peach": "#DBEAFE", // Blue-100
    },
  },
  {
    id: "m3",
    name: "Emerald",
    preview: "linear-gradient(135deg, #065F46, #10B981, #6EE7B7, #A7F3D0)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#022C22",
      "brand-dark": "#065F46",
      "brand-light": "#ECFDF5",
      "brand-blue": "#A7F3D0", // Green-200
      "brand-orange": "#34D399",
      "brand-pink": "#D1FAE5", // Green-100
      "brand-yellow": "#6EE7B7",
      "brand-peach": "#D1FAE5", // Green-100
    },
  },
  {
    id: "m4",
    name: "Rose",
    preview: "linear-gradient(135deg, #9F1239, #F43F5E, #FDA4AF, #FECDD3)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#4C0519",
      "brand-dark": "#881337",
      "brand-light": "#FFF1F2",
      "brand-blue": "#FECDD3", // Rose-200
      "brand-orange": "#FB7185",
      "brand-pink": "#FFE4E6", // Rose-100
      "brand-yellow": "#FDA4AF",
      "brand-peach": "#FFE4E6", // Rose-100
    },
  },
  {
    id: "m5",
    name: "Bronze",
    preview: "linear-gradient(135deg, #92400E, #D97706, #FCD34D, #FDE68A)",
    recommendedCta: ctaOptions[6], // Black
    colors: {
      "brand-black": "#451A03",
      "brand-dark": "#78350F",
      "brand-light": "#FFFBEB",
      "brand-blue": "#FDE68A", // Amber-200
      "brand-orange": "#F59E0B",
      "brand-pink": "#FEF3C7", // Amber-100
      "brand-yellow": "#FCD34D",
      "brand-peach": "#FEF3C7", // Amber-100
    },
  },
  {
    id: "m6",
    name: "Orchid",
    preview: "linear-gradient(135deg, #6B21A8, #9333EA, #C084FC, #E9D5FF)",
    recommendedCta: ctaOptions[5], // White
    colors: {
      "brand-black": "#3B0764",
      "brand-dark": "#581C87",
      "brand-light": "#FAF5FF",
      "brand-blue": "#E9D5FF", // Purple-200
      "brand-orange": "#A855F7",
      "brand-pink": "#F3E8FF", // Purple-100
      "brand-yellow": "#C084FC",
      "brand-peach": "#F3E8FF", // Purple-100
    },
  },
];

interface ThemeContextType {
  mode: "palette" | "monochrome";
  setMode: (mode: "palette" | "monochrome") => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  ctaColor: CtaColor;
  setCtaColor: (color: CtaColor) => void;
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
}

const ThemeCtx = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"palette" | "monochrome">("palette");
  const [currentTheme, setCurrentTheme] = useState<Theme>(paletteThemes[0]);
  const [ctaColor, setCtaColor] = useState<CtaColor>(
    paletteThemes[0].recommendedCta,
  );
  const [isOpen, setIsOpen] = useState(false);

  // When theme changes, update CSS vars
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(currentTheme.colors)) {
      root.style.setProperty(`--color-${key}`, value as string);
    }
  }, [currentTheme]);

  // When CTA color changes, update CTA CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-brand-cta", ctaColor.bg);
    root.style.setProperty("--color-brand-cta-text", ctaColor.text);
  }, [ctaColor]);

  const handleSetTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    setCtaColor(theme.recommendedCta); // Auto-apply recommended CTA
  };

  const handleSetMode = (newMode: "palette" | "monochrome") => {
    setMode(newMode);
    if (newMode === "palette") {
      handleSetTheme(paletteThemes[0]);
    } else {
      handleSetTheme(monochromeThemes[0]);
    }
  };

  const togglePanel = () => setIsOpen((prev) => !prev);
  const closePanel = () => setIsOpen(false);

  return (
    <ThemeCtx.Provider
      value={{
        mode,
        setMode: handleSetMode,
        currentTheme,
        setTheme: handleSetTheme,
        ctaColor,
        setCtaColor,
        isOpen,
        togglePanel,
        closePanel,
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
};
