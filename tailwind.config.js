module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scan all JS/JSX files in src/
  ],
  theme: {
    extend: {
      keyframes: {
        'score-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'score-pop': 'score-pop 0.5s ease-out',
      }
    }
  },
  plugins: [],
}