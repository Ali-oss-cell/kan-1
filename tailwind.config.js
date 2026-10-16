/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f0f0f",
        paper: "#f0f0f0",
        periwinkle: "#92a4ff",
        purple: "#b890f4",
        lavender: "#c4a4ff",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        "brutal-sm": "4px 4px 0 0 #0f0f0f",
        brutal: "8px 8px 0 0 #0f0f0f",
        "brutal-lg": "12px 12px 0 0 #0f0f0f",
        "brutal-periwinkle": "8px 8px 0 0 #92a4ff",
        "brutal-purple": "8px 8px 0 0 #b890f4",
        "brutal-paper": "8px 8px 0 0 #f0f0f0",
        "brutal-lavender": "8px 8px 0 0 #c4a4ff",
      },
      spacing: {
        18: "72px",
        22: "88px",
        30: "120px",
        section: "128px",
        "section-sm": "72px",
      },
      maxWidth: {
        site: "1360px",
      },
      fontFamily: {
        display: [
          "Archivo",
          "Arial Narrow",
          "Nimbus Sans Narrow",
          "Liberation Sans Narrow",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        sans: [
          "Archivo",
          "Helvetica Neue",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Display scale — condensed, heavy, uppercase (see .display in index.css)
        "display-xl": [
          "clamp(64px, 10vw, 152px)",
          { lineHeight: "0.86", letterSpacing: "-0.01em" },
        ],
        "display-lg": [
          "clamp(64px, 9vw, 144px)",
          { lineHeight: "0.88", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(48px, 6.4vw, 96px)",
          { lineHeight: "0.9", letterSpacing: "-0.005em" },
        ],
        "display-sm": ["40px", { lineHeight: "40px", letterSpacing: "0" }],
        "display-xs": ["28px", { lineHeight: "28px", letterSpacing: "0.005em" }],
        "body-lg": ["20px", { lineHeight: "32px" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
        label: ["12px", { lineHeight: "16px", letterSpacing: "0.08em" }],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 64s linear infinite",
        "spin-slow": "spinSlow 24s linear infinite",
        blink: "blink 1.4s steps(1) infinite",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
