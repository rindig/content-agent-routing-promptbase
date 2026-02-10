import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { HistoricalPanel, SplitScreen } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 5: Closing — The Parallel
 * Duration: 300 frames (10 seconds)
 *
 * SplitScreen: 1952 quote vs 2026 quote → checkmark + blinking "?" →
 * Timeline bar (1952→2026) with sweeping progress dot →
 * Two-line BlurText closing statement.
 */

const BEATS = {
  SPLIT_SCREEN_IN: 0,
  COMPARISON_MARKS: 40,
  PANELS_DIM: 80,
  TIMELINE_BAR: 90,
  PROGRESS_SWEEP: 95,
  LINE_1_IN: 120,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 170,
  LINE_2_STAGGER: 5,
  HOLD_START: 210,
  FADE_OUT: 285,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panels dim and split apart
  const panelsDimOpacity = interpolate(
    frame,
    [BEATS.PANELS_DIM, BEATS.PANELS_DIM + 15],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const panelsShift = interpolate(
    frame,
    [BEATS.PANELS_DIM, BEATS.PANELS_DIM + 15],
    [0, 30],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Checkmark for 1952
  const checkmarkProgress = spring({
    frame: frame - BEATS.COMPARISON_MARKS,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const checkmarkOpacity = interpolate(checkmarkProgress, [0, 1], [0, 1]);

  // Blinking "?" for 2026
  const questionBlink = frame >= BEATS.COMPARISON_MARKS
    ? Math.sin((frame - BEATS.COMPARISON_MARKS) * (Math.PI / 10)) > 0 ? 1 : 0.3
    : 0;
  const questionOpacity = interpolate(
    frame,
    [BEATS.COMPARISON_MARKS, BEATS.COMPARISON_MARKS + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Timeline bar
  const timelineOpacity = interpolate(
    frame,
    [BEATS.TIMELINE_BAR, BEATS.TIMELINE_BAR + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Progress sweep along timeline
  const sweepProgress = interpolate(
    frame,
    [BEATS.PROGRESS_SWEEP, BEATS.PROGRESS_SWEEP + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Closing text glow
  const glowOpacity = frame >= BEATS.LINE_1_IN
    ? 0.05 + 0.05 * Math.sin(frame * 0.08)
    : 0;

  const timelineWidth = 800;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={15}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 24,
        }}
      >
        {/* Split Screen: 1952 vs 2026 */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Top Panel — 1952 */}
          <div
            style={{
              opacity: panelsDimOpacity,
              transform: `translateY(${-panelsShift}px)`,
              backgroundColor: 'rgba(20,14,8,0.5)',
              borderRadius: 12,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              {/* Year badge */}
              <div
                style={{
                  backgroundColor: `${COLORS.historyGold}26`,
                  borderRadius: 16,
                  padding: '4px 16px',
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.historyGold,
                  }}
                >
                  1952
                </span>
              </div>

              {/* Proven wrong checkmark */}
              {frame >= BEATS.COMPARISON_MARKS && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: checkmarkOpacity,
                  }}
                >
                  <svg width={20} height={20} viewBox="0 0 20 20">
                    <path
                      d="M4 10 L8 14 L16 6"
                      fill="none"
                      stroke={COLORS.solutionGreen}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 20,
                      color: COLORS.solutionGreen,
                      textTransform: 'uppercase',
                    }}
                  >
                    PROVEN WRONG
                  </span>
                </div>
              )}
            </div>

            <span
              style={{
                ...TYPOGRAPHY.quote,
                fontSize: 36,
                color: COLORS.historyGold,
              }}
            >
              &ldquo;Computers can only do arithmetic.&rdquo;
            </span>
          </div>

          {/* Bottom Panel — 2026 */}
          <div
            style={{
              opacity: panelsDimOpacity,
              transform: `translateY(${panelsShift}px)`,
              backgroundColor: COLORS.bgSurface,
              borderRadius: 12,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              {/* Year badge */}
              <div
                style={{
                  backgroundColor: `${COLORS.aiPurple}26`,
                  borderRadius: 16,
                  padding: '4px 16px',
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.aiPurple,
                  }}
                >
                  2026
                </span>
              </div>

              {/* Blinking "?" + IN PROGRESS */}
              {frame >= BEATS.COMPARISON_MARKS && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: questionOpacity,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 24,
                      color: COLORS.insightOrange,
                      fontWeight: 700,
                      opacity: questionBlink,
                    }}
                  >
                    ?
                  </span>
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 20,
                      color: COLORS.insightOrange,
                      textTransform: 'uppercase',
                    }}
                  >
                    IN PROGRESS
                  </span>
                </div>
              )}
            </div>

            <span
              style={{
                ...TYPOGRAPHY.quote,
                fontSize: 36,
                color: COLORS.aiPurple,
              }}
            >
              &ldquo;AI can&apos;t be trusted for real work.&rdquo;
            </span>
          </div>
        </div>

        {/* Timeline Bar */}
        {frame >= BEATS.TIMELINE_BAR && (
          <div
            style={{
              width: '100%',
              maxWidth: timelineWidth,
              opacity: timelineOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 22,
                  color: COLORS.historyGold,
                }}
              >
                1952
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 22,
                  color: COLORS.aiPurple,
                }}
              >
                2026
              </span>
            </div>

            {/* Bar + sweeping dot */}
            <div
              style={{
                width: '100%',
                height: 4,
                backgroundColor: COLORS.panelBorder,
                borderRadius: 2,
                position: 'relative',
              }}
            >
              {/* Progress fill */}
              <div
                style={{
                  width: `${sweepProgress * 100}%`,
                  height: '100%',
                  backgroundColor: COLORS.solutionGreen,
                  borderRadius: 2,
                  opacity: 0.5,
                }}
              />

              {/* Sweeping dot */}
              <div
                style={{
                  position: 'absolute',
                  left: `${sweepProgress * 100}%`,
                  top: '50%',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: COLORS.solutionGreen,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 12px ${COLORS.glowGreen}`,
                }}
              />
            </div>

            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                textTransform: 'none',
                letterSpacing: 0,
                textAlign: 'center',
              }}
            >
              74 years to prove compilers right
            </span>
          </div>
        )}

        {/* Closing Statement — Two Lines with BlurText */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            textAlign: 'center',
            maxWidth: 860,
            position: 'relative',
          }}
        >
          {/* Subtle glow behind closing text */}
          <div
            style={{
              position: 'absolute',
              inset: -40,
              backgroundColor: COLORS.insightOrange,
              opacity: glowOpacity,
              filter: 'blur(60px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {frame >= BEATS.LINE_1_IN && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              staggerDelay={BEATS.LINE_1_STAGGER}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              The timeline for proving them wrong
            </BlurText>
          )}

          {frame >= BEATS.LINE_2_IN && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              staggerDelay={BEATS.LINE_2_STAGGER}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.insightOrange}
            >
              keeps getting shorter.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
