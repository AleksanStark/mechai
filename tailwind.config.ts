import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-deep": "#0D0B08",
        "bg-dark": "#161109",
        "bg-card": "#201910",
        "bg-card2": "#271F13",
        "mech-orange": "#E8792A",
        "orange-dim": "#C4612A",
        "mech-amber": "#F0A050",
        steel: "#3D5F7A",
        "steel-lt": "#5A7F9E",
        "mech-cyan": "#00D8FF",
        "cyan-dim": "#0099BB",
        "mech-red": "#FF2222",
        cream: "#EAE2D2",
        "cream-dim": "#B0A890",
        tan: "#8A7A5A",
      },
      fontFamily: {
        rye: ["Rye", "serif"],
        mono: ['"Share Tech Mono"', "monospace"],
        barlow: ["Barlow", "sans-serif"],
        condensed: ['"Barlow Condensed"', "sans-serif"],
      },
      clipPath: {
        btn: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
        stat: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      },
    },
  },
  plugins: [],
} satisfies Config;
