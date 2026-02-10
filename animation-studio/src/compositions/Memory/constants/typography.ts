export const TYPOGRAPHY = {
  // Code - monospace
  code: {
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
  },

  // Titles and headers - clean sans
  display: {
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
  },

  // Body text - readable sans
  body: {
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
  },

  // Quotes - elegant serif
  quote: {
    fontFamily: 'Playfair Display, Georgia, serif',
  },

  // Handwritten feel for Mad Libs
  handwritten: {
    fontFamily: 'Caveat, Patrick Hand, cursive',
  },
};

// Size minimums (enforced by AnimatedText, but good reference)
export const SIZES = {
  hero: { min: 64, default: 72 },
  title: { min: 48, default: 56 },
  body: { min: 40, default: 48 },
  code: { min: 28, default: 32 },
  label: { min: 24, default: 28 },
};
