// Color palette for "The Stack Beneath the Stack" video
export const COLORS = {
  // Base
  background: '#0A0A0F',      // Near-black with slight blue tint
  surface: '#12121A',          // Slightly lighter for code blocks
  surfaceAlt: '#1A1A24',       // Even lighter for nested elements

  // Primary palette
  primary: '#3B82F6',          // Blue - highlights, links, emphasis
  accent: '#10B981',           // Green - Python code, success states
  warning: '#F59E0B',          // Amber - errors, problems, caution
  danger: '#EF4444',           // Red - critical errors

  // Text
  text: '#E5E7EB',             // Primary text (off-white)
  textMuted: '#6B7280',        // Secondary text (gray)
  textDim: '#4B5563',          // Tertiary text (darker gray)

  // Syntax highlighting
  syntaxKeyword: '#3B82F6',    // Blue
  syntaxString: '#10B981',     // Green
  syntaxNumber: '#F59E0B',     // Amber
  syntaxComment: '#6B7280',    // Gray
  syntaxFunction: '#A78BFA',   // Purple

  // Historical/Loom section (warmer palette)
  warmBackground: '#1A1814',   // Sepia-tinted dark
  warmAccent: '#D97706',       // Warm amber
  warmText: '#FEF3C7',         // Cream

  // Quantum section (cosmic palette)
  cosmicBackground: '#0F0A1A', // Deep purple-black
  cosmicPrimary: '#8B5CF6',    // Purple
  cosmicAccent: '#EC4899',     // Pink
  cosmicGlow: '#C4B5FD',       // Light purple glow
} as const;

export type ColorKey = keyof typeof COLORS;
