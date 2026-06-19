import type { Config } from "tailwindcss";

/**
 * CareNexus Design System — Blue Sky Palette
 *
 * Primary brand:   #2563EB  (rich blue, buttons / active states)
 * Sky accent:      #6ABFF3  (light sky blue, chart fills, card icons)
 * Page bg:         #EFF4FB  (soft blue-white canvas — matches reference)
 * Card/surface:    #FFFFFF  (pure white cards on the canvas)
 * Text:            #081C44  (deep navy — reference "Black" token)
 * Secondary text:  #6B7B9C
 * Muted text:      #9BACC8
 *
 * Semantic:
 *   success  #9AE072  (light-green from palette)
 *   warning  #EEE260  (yellow from palette)
 *   danger   #F87171  (soft red)
 *   info     #6985FF  (royal-blue from palette)
 */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Primary (brand blue) ─────────────────────────── */
        primary: {
          DEFAULT:  "#2563EB",
          hover:    "#1D4ED8",
          light:    "rgba(37,99,235,0.12)",
          muted:    "rgba(37,99,235,0.07)",
          bg:       "rgba(37,99,235,0.05)",
        },

        /* ── Page canvas ─────────────────────────────────── */
        background: "#EFF4FB",

        /* ── Sky / light-blue accent ─────────────────────── */
        sky: {
          DEFAULT: "#6ABFF3",
          light:   "#C5E4F8",
          muted:   "rgba(106,191,243,0.15)",
          bg:      "rgba(106,191,243,0.08)",
        },

        /* ── Royal blue (info / secondary brand) ─────────── */
        royal: {
          DEFAULT: "#6985FF",
          light:   "rgba(105,133,255,0.15)",
        },

        /* ── Neutral ink (text) ──────────────────────────── */
        ink: {
          DEFAULT: "#081C44",
          soft:    "#1E3A5F",
        },

        /* ── Surfaces ─────────────────────────────────────── */
        surface: {
          DEFAULT: "#F0F5FF",
          white:   "#FFFFFF",
          card:    "#FFFFFF",
          overlay: "rgba(8,28,68,0.03)",
        },

        /* ── Text scale ───────────────────────────────────── */
        text: {
          primary:   "#081C44",
          secondary: "#6B7B9C",
          muted:     "#9BACC8",
        },

        /* ── Borders ─────────────────────────────────────── */
        border: {
          DEFAULT: "rgba(37,99,235,0.12)",
          light:   "rgba(37,99,235,0.07)",
          card:    "rgba(37,99,235,0.10)",
        },

        /* ── Semantic ─────────────────────────────────────── */
        success:  "#9AE072",
        warning:  "#EEE260",
        danger:   "#F87171",
        info:     "#6985FF",
      },

      /* ── Typography ───────────────────────────────────── */
      fontFamily: {
        sans: [
          "var(--font-inter)",       /* Plus Jakarta Sans loaded as --font-inter */
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "var(--font-fraunces)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        display: [
          "var(--font-fraunces)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },

      /* ── Border radius ────────────────────────────────── */
      borderRadius: {
        DEFAULT: "10px",
        sm:  "6px",
        md:  "10px",
        lg:  "14px",
        xl:  "18px",
        "2xl": "22px",
        "3xl": "28px",
      },

      /* ── Box shadows ──────────────────────────────────── */
      boxShadow: {
        card:   "0 2px 12px rgba(37,99,235,0.06), 0 1px 3px rgba(37,99,235,0.04)",
        "card-hover": "0 6px 24px rgba(37,99,235,0.10), 0 2px 6px rgba(37,99,235,0.06)",
        btn:    "0 2px 8px rgba(37,99,235,0.28)",
        "btn-hover":  "0 4px 14px rgba(37,99,235,0.36)",
        sidebar: "2px 0 16px rgba(37,99,235,0.06)",
        topbar:  "0 2px 12px rgba(37,99,235,0.05)",
      },

      /* ── Background images (gradients) ────────────────── */
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2563EB 0%, #6ABFF3 100%)",
        "sky-gradient":   "linear-gradient(180deg, #6ABFF3 0%, #C5E4F8 100%)",
        "chart-bar":      "linear-gradient(180deg, #2563EB 0%, #6ABFF3 100%)",
        "sidebar-active": "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(106,191,243,0.10) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
