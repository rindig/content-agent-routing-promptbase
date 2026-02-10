// AgentDeconstruction color palette
// Theme: Deconstruction, layers revealing truth beneath

export const COLORS = {
  // Backgrounds
  background: '#0A0A0F',
  backgroundLight: '#12121A',
  surface: '#1A1A24',

  // Primary text (high contrast)
  text: '#FFFFFF',
  textPrimary: '#E5E7EB',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',

  // The Three Layers (THE KEY VISUAL IDENTITY)
  ai: '#22C55E',           // Green - AI/Model inference (10%)
  orchestration: '#3B82F6', // Blue - Orchestration/code (30%)
  dataProcessing: '#F59E0B', // Amber - Data processing (60%)

  // Supporting accents
  accent: '#8B5CF6',        // Purple - for "agent" word, AI mystique
  accentBright: '#A855F7',
  highlight: '#EC4899',     // Pink - for key reveals
  error: '#EF4444',         // Red - for errors/glitches

  // Protocol/Historical timeline
  usb: '#6B7280',           // Gray - older tech
  http: '#3B82F6',          // Blue
  lsp: '#8B5CF6',           // Purple
  mcp: '#22C55E',           // Green - current

  // Code/JSON
  code: '#1E293B',
  codeText: '#E2E8F0',
  json: '#FDE68A',          // Yellow for JSON highlight

  // Ethics Engine specific
  ethicsInterface: '#0F172A',
  ethicsAccent: '#6366F1',  // Indigo
  ethicsSuccess: '#10B981',
  ethicsWarning: '#FBBF24',
};

// Layer colors with opacity variants
export const LAYER_COLORS = {
  ai: {
    solid: COLORS.ai,
    bg: `${COLORS.ai}20`,
    border: `${COLORS.ai}60`,
    glow: `${COLORS.ai}40`,
  },
  orchestration: {
    solid: COLORS.orchestration,
    bg: `${COLORS.orchestration}20`,
    border: `${COLORS.orchestration}60`,
    glow: `${COLORS.orchestration}40`,
  },
  dataProcessing: {
    solid: COLORS.dataProcessing,
    bg: `${COLORS.dataProcessing}20`,
    border: `${COLORS.dataProcessing}60`,
    glow: `${COLORS.dataProcessing}40`,
  },
};
