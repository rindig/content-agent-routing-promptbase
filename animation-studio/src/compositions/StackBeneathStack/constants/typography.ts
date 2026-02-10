// Typography configuration for "The Stack Beneath the Stack" video
export const TYPOGRAPHY = {
  // Code - use for all code blocks
  code: {
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    weights: {
      regular: 400,
      medium: 500,
    },
  },

  // Titles and headers
  display: {
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: {
      bold: 700,
      black: 900,
    },
  },

  // Body text and labels
  body: {
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
  },

  // Historical quotes (Ada Lovelace, etc.)
  quote: {
    fontFamily: 'Playfair Display, Georgia, serif',
    weights: {
      regular: 400,
      italic: 400,
    },
  },
} as const;
