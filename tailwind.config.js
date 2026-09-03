/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand -- Indigo. Deliberately NOT a money colour, so green/clay stay
        // signals and never read as brand chrome.
        primary: {
          50: "#EEEDFA",
          100: "#DEDCF3",
          200: "#C7C5EC",
          300: "#A9A6E0",
          400: "#8B87E8",
          500: "#5A56C4",
          600: "#4B47A8",
          700: "#3E3B94",
          800: "#332F8C",
          900: "#2B2942",
          DEFAULT: "#4B47A8",
          dark: "#332F8C",
          light: "#EEEDFA",
        },
        // App background -- warm paper (not pure white, not cold grey)
        cream: "#FAF7F1",
        // Financial: Income -- green, spent ONLY on income
        income: {
          50: "#E4F1EB",
          100: "#CFE6DC",
          200: "#B6DCCC",
          300: "#8FCBB0",
          400: "#4FBF95",
          500: "#1F8A66",
          600: "#1B7A5A",
          700: "#14543F",
          800: "#0F4030",
          900: "#0A2C21",
          950: "#061C15",
          DEFAULT: "#1B7A5A",
        },
        // Financial: Over-budget -- clay. Not for every expense; only the
        // over-limit state.
        expense: {
          50: "#F7E9E3",
          100: "#EBD6CD",
          200: "#EFCBBF",
          300: "#DDA491",
          400: "#C15A3D",
          500: "#B85236",
          600: "#A8492F",
          700: "#7C3521",
          800: "#5E2818",
          900: "#4A1F13",
          950: "#2E130C",
          DEFAULT: "#A8492F",
        },
        // Financial: Caution -- amber, "cutting it close"
        warning: {
          50: "#FBF1DD",
          100: "#EDDCB8",
          200: "#EFD9AF",
          300: "#DFBE7A",
          400: "#C98F2A",
          500: "#B07715",
          600: "#96650F",
          700: "#7A5210",
          800: "#5E3F0C",
          900: "#432C09",
          950: "#2A1B05",
          DEFAULT: "#B07715",
        },
        // Grays: warm stone (not cold slate)
      },

      backgroundColor: {
        app: "#FAF7F1",
      },

      fontFamily: {
        // UI text -- quiet, wide apertures, survives Spanish's extra length
        sans: ["Instrument Sans", "system-ui", "sans-serif"],
        // Money figures + big titles -- holds a wide Argentine number at size
        display: ["Bricolage Grotesque", "Instrument Sans", "system-ui", "sans-serif"],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },

      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },

      // Mixed radii carry hierarchy: control 12 · card 20 · hero 28 · pill full
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "0.875rem",
        xl: "1.25rem",
        "2xl": "1.75rem",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        dropdown: "0 8px 24px rgba(0,0,0,0.10)",
        "inner-light": "inset 0 1px 2px 0 rgb(0 0 0 / 0.04)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
