import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type TimelineEra = {
  id: string;
  decade: string;
  label: string;
  detail: string;
  color: string;
  icon?: string; // Emoji or symbol
};

const ERAS: TimelineEra[] = [
  {
    id: 'assembly',
    decade: '1950s',
    label: 'Assembly',
    detail: '"Computers can only do arithmetic"',
    color: '#64748b',
    icon: '⚙️',
  },
  {
    id: 'fortran',
    decade: '1960s',
    label: 'FORTRAN / COBOL',
    detail: 'High-level languages emerge',
    color: '#059669',
    icon: '📊',
  },
  {
    id: 'c',
    decade: '1970s',
    label: 'C / Unix',
    detail: 'Portable system programming',
    color: '#0891b2',
    icon: '🔧',
  },
  {
    id: 'oop',
    decade: '1980s',
    label: 'Object-Oriented',
    detail: 'Abstraction through objects',
    color: '#7c3aed',
    icon: '📦',
  },
  {
    id: 'gc',
    decade: '1990s',
    label: 'Garbage Collection',
    detail: 'Memory management abstracted',
    color: '#c026d3',
    icon: '🗑️',
  },
  {
    id: 'web',
    decade: '2000s',
    label: 'Web / VMs',
    detail: 'Platform independence',
    color: '#ea580c',
    icon: '🌐',
  },
  {
    id: 'cloud',
    decade: '2010s',
    label: 'Cloud / Containers',
    detail: 'Infrastructure as code',
    color: '#0284c7',
    icon: '☁️',
  },
  {
    id: 'llm',
    decade: '2020s',
    label: 'LLMs / Semantic',
    detail: 'Natural language as interface',
    color: '#f59e0b',
    icon: '🧠',
  },
];

type AbstractionTimelineProps = {
  startFrame?: number;
  /** Frames between each era appearing */
  eraDelay?: number;
  /** Highlight the final (LLM) era */
  highlightLLM?: boolean;
  /** Show skeptic quotes */
  showSkepticQuotes?: boolean;
  style?: React.CSSProperties;
};

export const AbstractionTimeline: React.FC<AbstractionTimelineProps> = ({
  startFrame = 0,
  eraDelay = 60,
  highlightLLM = true,
  showSkepticQuotes = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline line animation
  const lineProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 100, stiffness: 30, mass: 2 },
  });

  const visibleEras = ERAS.filter((_, i) => {
    const eraStart = startFrame + i * eraDelay;
    return frame >= eraStart;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 60px',
        ...style,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 40,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: 50,
          opacity: interpolate(lineProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Every Layer Was Once Unreliable
      </div>

      {/* Timeline container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: 1600,
          paddingTop: 20,
        }}
      >
        {/* Timeline line */}
        <div
          style={{
            position: 'absolute',
            top: 35,
            left: '2%',
            right: '2%',
            height: 4,
            backgroundColor: COLORS.backgroundLight,
            borderRadius: 2,
          }}
        >
          {/* Animated fill */}
          <div
            style={{
              width: `${interpolate(lineProgress, [0, 1], [0, 100])}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${COLORS.accentSecondary} 0%, ${COLORS.accent} 50%, ${COLORS.warning} 100%)`,
              borderRadius: 2,
              boxShadow: `0 0 15px ${COLORS.accent}50`,
            }}
          />
        </div>

        {/* Era markers */}
        {ERAS.map((era, i) => {
          const eraStart = startFrame + i * eraDelay;
          const eraProgress = spring({
            frame: frame - eraStart,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const isLLM = era.id === 'llm';
          const isHighlighted = isLLM && highlightLLM;

          // Pulse animation for LLM era
          const pulseScale = isHighlighted
            ? 1 + Math.sin((frame - eraStart) * 0.1) * 0.05
            : 1;

          return (
            <div
              key={era.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: `${100 / ERAS.length}%`,
                opacity: interpolate(eraProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(eraProgress, [0, 1], [30, 0])}px) scale(${pulseScale})`,
              }}
            >
              {/* Dot marker */}
              <div
                style={{
                  width: isHighlighted ? 24 : 16,
                  height: isHighlighted ? 24 : 16,
                  borderRadius: '50%',
                  backgroundColor: era.color,
                  border: `3px solid ${isHighlighted ? '#fff' : era.color}`,
                  boxShadow: isHighlighted
                    ? `0 0 20px ${era.color}, 0 0 40px ${era.color}50`
                    : `0 0 10px ${era.color}50`,
                  marginBottom: 16,
                  zIndex: 1,
                }}
              />

              {/* Icon */}
              {era.icon && (
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 8,
                    filter: isHighlighted ? 'none' : 'grayscale(30%)',
                  }}
                >
                  {era.icon}
                </div>
              )}

              {/* Decade */}
              <div
                style={{
                  fontSize: 16,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: era.color,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {era.decade}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: isHighlighted ? 20 : 18,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: isHighlighted ? 700 : 600,
                  color: isHighlighted ? era.color : COLORS.textPrimary,
                  textAlign: 'center',
                  marginBottom: 8,
                  textShadow: isHighlighted ? `0 0 20px ${era.color}50` : 'none',
                }}
              >
                {era.label}
              </div>

              {/* Detail */}
              <div
                style={{
                  fontSize: 13,
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  fontStyle: showSkepticQuotes && era.detail.startsWith('"') ? 'italic' : 'normal',
                  maxWidth: 140,
                }}
              >
                {era.detail}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Compact version for side-by-side comparisons
 */
export const TimelineCompact: React.FC<{
  startFrame?: number;
  showAll?: boolean;
}> = ({ startFrame = 0, showAll = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const visibleCount = showAll ? ERAS.length : Math.min(Math.floor((frame - startFrame) / 30), ERAS.length);

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 20,
      }}
    >
      {ERAS.slice(0, visibleCount).map((era, i) => (
        <div
          key={era.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            backgroundColor: `${era.color}15`,
            borderLeft: `4px solid ${era.color}`,
            borderRadius: '0 8px 8px 0',
          }}
        >
          <span style={{ fontSize: 18 }}>{era.icon}</span>
          <span
            style={{
              fontSize: 14,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              color: era.color,
              minWidth: 50,
            }}
          >
            {era.decade}
          </span>
          <span
            style={{
              fontSize: 16,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              color: COLORS.textPrimary,
            }}
          >
            {era.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AbstractionTimeline;
