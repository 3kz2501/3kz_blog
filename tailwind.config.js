/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        jade: {
          DEFAULT: "#00A86B",
          light: "#4AD295",
          dark: "#008F5D",
        },
      },
      fontFamily: {
        sans: [
          "PleckJP",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "PleckJP",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
        mono: [
          "PleckJP",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
