import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  ZOOM_START: 0,
  PATTERN_NODES: 20,
  BADGES_IN: 40,
  BADGE_EXPAND: 70,
  ERA_BADGE: 100,
  DIAGRAM_IN: 130,
  SUBTITLE_IN: 170,
};

const FEATURE_BADGES = [
  { label: 'Autocomplete', example: '=SU \u2192 =SUM()' },
  { label: 'Autofill', example: 'Mon, Tue \u2192 Wed, Thu, Fri' },
  { label: 'Flash Fill', example: 'John Smith \u2192 John' },
];

const PATTERN_CHARS = ['S', 'U', 'M'];

export const Scene2_PatternZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom effect: scale up from 1.0 to 2.5 for first 20 frames, then back down
  const zoomProgress = interpolate(
    frame,
    [BEATS.ZOOM_START, BEATS.ZOOM_START + 19, BEATS.PATTERN_NODES + 1, BEATS.PATTERN_NODES + 15],
    [1.0, 2.5, 2.5, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const zoomOpacity = interpolate(
    frame,
    [BEATS.ZOOM_START, BEATS.ZOOM_START + 5, BEATS.PATTERN_NODES + 1, BEATS.PATTERN_NODES + 10],
    [1, 0.6, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pattern nodes animation
  const nodesOpacity = interpolate(
    frame,
    [BEATS.PATTERN_NODES, BEATS.PATTERN_NODES + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Dim nodes when badges expand
  const nodesDim = interpolate(
    frame,
    [BEATS.BADGES_IN, BEATS.BADGES_IN + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Era badge
  const eraProgress = spring({
    frame: frame - BEATS.ERA_BADGE,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const eraScale = interpolate(eraProgress, [0, 1], [0.8, 1]);
  const eraOpacity = interpolate(eraProgress, [0, 1], [0, 1]);

  // Era glow pulse
  const eraGlowOpacity = frame >= BEATS.ERA_BADGE
    ? 0.06 + 0.04 * Math.sin((frame - BEATS.ERA_BADGE) * 0.08)
    : 0;

  // Diagram entrance
  const diagramProgress = spring({
    frame: frame - BEATS.DIAGRAM_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Badges dim when diagram appears
  const badgesDim = interpolate(
    frame,
    [BEATS.DIAGRAM_IN, BEATS.DIAGRAM_IN + 10],
    [1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 32,
          position: 'relative',
        }}
      >
        {/* Zoom effect - abstract SUM text that scales */}
        {frame < BEATS.BADGES_IN && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${zoomProgress})`,
              opacity: zoomOpacity,
              ...TYPOGRAPHY.code,
              fontSize: 48,
              color: COLORS.techBlue,
              letterSpacing: 8,
            }}
          >
            =SUM()
          </div>
        )}

        {/* Pattern nodes - S, U, M as circles with connecting lines */}
        {frame >= BEATS.PATTERN_NODES && frame < BEATS.BADGES_IN && (
          <div
            style={{
              opacity: nodesOpacity * nodesDim,
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              marginBottom: 40,
            }}
          >
            {PATTERN_CHARS.map((char, i) => {
              const nodeDelay = i * 5;
              const nodeProgress = spring({
                frame: frame - BEATS.PATTERN_NODES - nodeDelay,
                fps,
                config: SPRING_CONFIGS.bouncy,
              });
              const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);

              return (
                <React.Fragment key={char}>
                  {i > 0 && (
                    <svg width="40" height="4" style={{ opacity: nodeProgress }}>
                      <line
                        x1="0" y1="2" x2="40" y2="2"
                        stroke={COLORS.techBlue}
                        strokeWidth={2}
                        strokeDasharray="6,4"
                      />
                    </svg>
                  )}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: COLORS.techBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `scale(${nodeScale})`,
                      boxShadow: `0 0 16px ${COLORS.glowBlue}`,
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.code,
                        fontSize: 24,
                        color: COLORS.textPrimary,
                        fontWeight: 700,
                      }}
                    >
                      {char}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Era badge - "Since the 1990s" */}
        {frame >= BEATS.ERA_BADGE && (
          <div
            style={{
              opacity: eraOpacity,
              transform: `scale(${eraScale})`,
              backgroundColor: `rgba(201,162,39,0.1)`,
              borderRadius: 24,
              padding: '12px 32px',
              position: 'relative',
              marginBottom: 20,
            }}
          >
            {/* Warm glow behind */}
            <div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: 44,
                background: `radial-gradient(ellipse at center, rgba(201,162,39,${eraGlowOpacity}) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 36,
                color: COLORS.historyGold,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Since the 1990s
            </span>
          </div>
        )}

        {/* Feature badges */}
        {frame >= BEATS.BADGES_IN && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'center',
              opacity: badgesDim,
              width: '100%',
              maxWidth: 900,
            }}
          >
            {FEATURE_BADGES.map((badge, i) => {
              const badgeDelay = i * 10;
              const badgeProgress = spring({
                frame: frame - BEATS.BADGES_IN - badgeDelay,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
              const badgeY = interpolate(badgeProgress, [0, 1], [20, 0]);

              // Badge expansion
              const expandProgress = spring({
                frame: frame - BEATS.BADGE_EXPAND - badgeDelay,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const showExample = frame >= BEATS.BADGE_EXPAND + badgeDelay;

              // Typewriter for example text
              const exampleFrame = frame - BEATS.BADGE_EXPAND - badgeDelay - 10;
              const exampleChars = Math.max(0, Math.min(badge.example.length, Math.floor(exampleFrame / 2)));
              const currentExample = badge.example.slice(0, exampleChars);

              return (
                <div
                  key={badge.label}
                  style={{
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeY}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {/* Label badge */}
                  <div
                    style={{
                      backgroundColor: COLORS.bgSurface,
                      borderRadius: 20,
                      padding: '10px 24px',
                      border: `1px solid ${COLORS.techBlue}30`,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 26,
                        color: COLORS.techBlue,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Arrow + example */}
                  {showExample && (
                    <div
                      style={{
                        opacity: interpolate(expandProgress, [0, 1], [0, 1]),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: COLORS.textDim, fontSize: 24 }}>{'\u2192'}</span>
                      <span
                        style={{
                          ...TYPOGRAPHY.code,
                          fontSize: 22,
                          color: COLORS.codeText,
                        }}
                      >
                        {currentExample}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pattern Engine Diagram: INPUT -> [PATTERN ENGINE] -> PREDICTION */}
        {frame >= BEATS.DIAGRAM_IN && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              marginTop: 20,
            }}
          >
            {/* INPUT box */}
            {(() => {
              const box1Progress = spring({
                frame: frame - BEATS.DIAGRAM_IN,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              return (
                <div
                  style={{
                    opacity: interpolate(box1Progress, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(box1Progress, [0, 1], [0.8, 1])})`,
                    backgroundColor: COLORS.bgSurfaceAlt,
                    borderRadius: 12,
                    padding: '14px 20px',
                    border: `1px solid ${COLORS.panelBorder}`,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 36,
                      color: COLORS.textBody,
                    }}
                  >
                    INPUT
                  </span>
                </div>
              );
            })()}

            {/* Arrow 1 */}
            {(() => {
              const arrow1Progress = spring({
                frame: frame - BEATS.DIAGRAM_IN - 15,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              return (
                <div
                  style={{
                    opacity: interpolate(arrow1Progress, [0, 1], [0, 1]),
                    padding: '0 8px',
                  }}
                >
                  <svg width="40" height="24">
                    <line x1="0" y1="12" x2="30" y2="12" stroke={COLORS.textMuted} strokeWidth={2} />
                    <polygon points="28,6 40,12 28,18" fill={COLORS.textMuted} />
                  </svg>
                </div>
              );
            })()}

            {/* PATTERN ENGINE box */}
            {(() => {
              const box2Progress = spring({
                frame: frame - BEATS.DIAGRAM_IN - 15,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              const glowPulse = frame >= BEATS.DIAGRAM_IN + 15
                ? 0.15 + 0.1 * Math.sin((frame - BEATS.DIAGRAM_IN - 15) * 0.08)
                : 0;
              return (
                <div
                  style={{
                    opacity: interpolate(box2Progress, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(box2Progress, [0, 1], [0.8, 1])})`,
                    backgroundColor: COLORS.bgSurfaceAlt,
                    borderRadius: 12,
                    padding: '14px 20px',
                    border: `2px solid ${COLORS.techBlue}`,
                    boxShadow: `0 0 20px rgba(59,130,246,${glowPulse})`,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 30,
                      color: COLORS.techBlue,
                      fontWeight: 600,
                    }}
                  >
                    PATTERN{'\n'}ENGINE
                  </span>
                </div>
              );
            })()}

            {/* Arrow 2 */}
            {(() => {
              const arrow2Progress = spring({
                frame: frame - BEATS.DIAGRAM_IN - 30,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              return (
                <div
                  style={{
                    opacity: interpolate(arrow2Progress, [0, 1], [0, 1]),
                    padding: '0 8px',
                  }}
                >
                  <svg width="40" height="24">
                    <line x1="0" y1="12" x2="30" y2="12" stroke={COLORS.textMuted} strokeWidth={2} />
                    <polygon points="28,6 40,12 28,18" fill={COLORS.textMuted} />
                  </svg>
                </div>
              );
            })()}

            {/* PREDICTION box */}
            {(() => {
              const box3Progress = spring({
                frame: frame - BEATS.DIAGRAM_IN - 30,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              return (
                <div
                  style={{
                    opacity: interpolate(box3Progress, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(box3Progress, [0, 1], [0.8, 1])})`,
                    backgroundColor: COLORS.bgSurfaceAlt,
                    borderRadius: 12,
                    padding: '14px 16px',
                    border: `1px solid ${COLORS.panelBorder}`,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 32,
                      color: COLORS.textBody,
                    }}
                  >
                    PREDICTION
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {/* Subtitle */}
        {frame >= BEATS.SUBTITLE_IN && (
          <div
            style={{
              maxWidth: 860,
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            <BlurText
              startFrame={0}
              animateBy="words"
              staggerDelay={2}
              fontSize={40}
              fontWeight={400}
              color={COLORS.textBody}
              direction="bottom"
            >
              It watches what you type, identifies the pattern, and guesses what comes next.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
