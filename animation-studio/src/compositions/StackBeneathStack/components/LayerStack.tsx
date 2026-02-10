import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * LayerStack Component
 *
 * Shows the accumulated layers at the top of the frame as small badges.
 * Each layer lights up when it becomes active, creating a visual breadcrumb
 * of the descent through the stack.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ [Python] → [AST] → [Bytecode] → [C] → [ASM] → [Machine] → [HW] │
 * └─────────────────────────────────────────────────────────────────┘
 */

export type LayerId = 'python' | 'ast' | 'bytecode' | 'c' | 'assembly' | 'machine' | 'hardware';

type Layer = {
  id: LayerId;
  label: string;
  color: string;
};

const LAYERS: Layer[] = [
  { id: 'python', label: 'Python', color: COLORS.accent },
  { id: 'ast', label: 'AST', color: COLORS.syntaxFunction },
  { id: 'bytecode', label: 'Bytecode', color: COLORS.primary },
  { id: 'c', label: 'C', color: COLORS.syntaxKeyword },
  { id: 'assembly', label: 'Assembly', color: COLORS.warning },
  { id: 'machine', label: 'Machine', color: COLORS.danger },
  { id: 'hardware', label: 'Hardware', color: COLORS.cosmicPrimary },
];

type LayerStackProps = {
  activeLayer: LayerId;
  entranceFrame?: number;
  visible?: boolean;
};

export const LayerStack: React.FC<LayerStackProps> = ({
  activeLayer,
  entranceFrame = 0,
  visible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!visible) return null;

  // Find index of active layer
  const activeIndex = LAYERS.findIndex((l) => l.id === activeLayer);

  // Container entrance
  const containerProgress = spring({
    frame: frame - entranceFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const containerOpacity = interpolate(containerProgress, [0, 1], [0, 1]);
  const containerTranslateY = interpolate(containerProgress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${containerTranslateY}px)`,
        opacity: containerOpacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 20px',
        backgroundColor: `${COLORS.surface}CC`,
        borderRadius: 12,
        border: `1px solid ${COLORS.surfaceAlt}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {LAYERS.map((layer, index) => {
        const isActive = layer.id === activeLayer;
        const isPast = index < activeIndex;
        const isFuture = index > activeIndex;

        // Staggered entrance for each badge
        const badgeDelay = entranceFrame + index * 3;
        const badgeProgress = spring({
          frame: frame - badgeDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const badgeScale = interpolate(badgeProgress, [0, 1], [0.8, 1]);
        const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);

        // Active badge pulses slightly
        const activePulse = isActive
          ? 1 + Math.sin((frame - entranceFrame) * 0.1) * 0.02
          : 1;

        return (
          <React.Fragment key={layer.id}>
            {/* Badge */}
            <div
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                backgroundColor: isActive
                  ? layer.color
                  : isPast
                  ? `${layer.color}40`
                  : `${COLORS.surfaceAlt}`,
                border: `1px solid ${isActive ? layer.color : isPast ? `${layer.color}60` : COLORS.textDim}`,
                transform: `scale(${badgeScale * activePulse})`,
                opacity: badgeOpacity * (isFuture ? 0.3 : 1),
                boxShadow: isActive ? `0 0 12px ${layer.color}60` : 'none',
                transition: 'none', // Remotion doesn't use CSS transitions
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : isPast ? layer.color : COLORS.textMuted,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {layer.label}
              </span>
            </div>

            {/* Arrow between badges */}
            {index < LAYERS.length - 1 && (
              <span
                style={{
                  color: isPast ? COLORS.textMuted : COLORS.textDim,
                  fontSize: 12,
                  opacity: badgeOpacity * (isFuture ? 0.2 : 0.5),
                }}
              >
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
