/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f1117',
        foreground: 'white',
        card: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.09)',
        muted: 'rgba(255,255,255,0.08)',
        'muted-foreground': 'rgba(255,255,255,0.4)',
        primary: '#ff9800',
      },
    },
  },
  plugins: [],
}
