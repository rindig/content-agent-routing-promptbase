import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  POETRY_SHRINK: 0,
  MATH_NODE: 30,
  MATH_CONNECTIONS: 60,
  MATH_SIGNALS: 100,
  SPARSE_LABEL: 140,
  ANSWER_ATTEMPT: 140,
  SIDE_BY_SIDE: 180,
  HOLD: 210,
};

// ── Poetry constellation data (simplified for ghost version) ──
const POETRY_NODES = [
  { label: 'waves', angle: 0, radius: 70 },
  { label: 'tide', angle: 72, radius: 68 },
  { label: 'shore', angle: 144, radius: 72 },
  { label: 'salt', angle: 216, radius: 65 },
  { label: 'deep', angle: 288, radius: 74 },
  { label: 'moon', angle: 30, radius: 120 },
  { label: 'silver', angle: 90, radius: 125 },
  { label: 'night', angle: 150, radius: 118 },
  { label: 'breath', angle: 210, radius: 128 },
  { label: 'remember', angle: 260, radius: 115 },
  { label: 'song', angle: 330, radius: 122 },
];

// Math constellation -- sparse
const MATH_NODES = [
  { label: 'x', angle: 0, radius: 140, connected: true },
  { label: '16', angle: 120, radius: 150, connected: true },
  { label: '=', angle: 240, radius: 135, connected: true },
];

const DISCONNECTED_ANSWER = { label: '5,552', angle: 60, radius: 220 };

// Convert polar to XY relative to a center
const toXY = (cx: number, cy: number, angle: number, radius: number) => ({
  x: cx + radius * Math.cos((angle * Math.PI) / 180),
  y: cy + radius * Math.sin((angle * Math.PI) / 180),
});

// ── Poetry Ghost (shrunken, dim) ──
const PoetryGhost: React.FC<{
  frame: number;
  fps: number;
  cx: number;
  cy: number;
}> = ({ frame, fps, cx, cy }) => {
  // Poetry web shrinks and dims
  const shrinkProgress = spring({
    frame: Math.max(0, frame - BEATS.POETRY_SHRINK),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.4]);
  const opacity = interpolate(shrinkProgress, [0, 1], [1, 0.3]);

  // Signal dots for the poetry web (stays active)
  const showSignals = frame >= BEATS.MATH_SIGNALS;

  return (
    <g
      opacity={opacity}
      transform={`translate(${cx}, ${cy}) scale(${scale})`}
    >
      {/* Center node */}
      <circle cx={0} cy={0} r={20} fill={COLORS.aiPurple} opacity={0.6} />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={12}
        fontFamily={TYPOGRAPHY.code.fontFamily}
      >
        ocean
      </text>

      {/* Constellation nodes and lines */}
      {POETRY_NODES.map((node, i) => {
        const pos = toXY(0, 0, node.angle, node.radius);
        return (
          <g key={i}>
            <line
              x1={0}
              y1={0}
              x2={pos.x}
              y2={pos.y}
              stroke={COLORS.aiPurple}
              strokeWidth={1}
              opacity={0.5}
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={i < 5 ? 10 : 6}
              fill={COLORS.aiPurple}
              opacity={i < 5 ? 0.5 : 0.25}
            />
            {/* Signal dots */}
            {showSignals && i < 6 && (
              <circle
                cx={
                  pos.x *
                  (((frame - BEATS.MATH_SIGNALS + i * 8) % 30) / 30)
                }
                cy={
                  pos.y *
                  (((frame - BEATS.MATH_SIGNALS + i * 8) % 30) / 30)
                }
                r={2}
                fill="#FFFFFF"
                opacity={0.7}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

// ── Flickering wrong answers ──
const FLICKER_ANSWERS = ['5,228', '5,412', '5,552', '5,228'];

// ── Scene3_MathVoid ──
export const Scene3_MathVoid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const poetryCX = 540;
  const poetryCY = 480;
  const mathCX = 540;
  const mathCY = 1200;

  // Math center node entrance
  const mathCenterProgress = spring({
    frame: Math.max(0, frame - BEATS.MATH_NODE),
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const mathCenterScale = interpolate(mathCenterProgress, [0, 1], [0, 1]);
  const mathCenterOpacity = interpolate(mathCenterProgress, [0, 1], [0, 1]);

  // Sparse label
  const sparseLabelProgress = spring({
    frame: Math.max(0, frame - BEATS.SPARSE_LABEL),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const sparseLabelOpacity = interpolate(
    sparseLabelProgress,
    [0, 1],
    [0, 1]
  );

  // Side-by-side labels
  const sideBySideProgress = spring({
    frame: Math.max(0, frame - BEATS.SIDE_BY_SIDE),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const sideBySideOpacity = interpolate(
    sideBySideProgress,
    [0, 1],
    [0, 1]
  );

  // Flickering answer
  const flickerRelFrame = frame - BEATS.ANSWER_ATTEMPT;
  const flickerIndex =
    flickerRelFrame >= 0
      ? Math.min(
          FLICKER_ANSWERS.length - 1,
          Math.floor(flickerRelFrame / 3)
        )
      : -1;
  const currentFlicker =
    flickerIndex >= 0 ? FLICKER_ANSWERS[flickerIndex] : '';
  const flickerSettled = flickerRelFrame >= FLICKER_ANSWERS.length * 3;

  // Disconnected node drift
  const driftX =
    frame >= BEATS.MATH_CONNECTIONS + 18
      ? 3 * Math.sin((frame * Math.PI) / 60)
      : 0;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          width={1080}
          height={1920}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Poetry ghost (upper portion) */}
          <PoetryGhost
            frame={frame}
            fps={fps}
            cx={poetryCX}
            cy={poetryCY}
          />

          {/* Vertical divider (appears at SIDE_BY_SIDE) */}
          {frame >= BEATS.SIDE_BY_SIDE && (
            <line
              x1={540}
              y1={700}
              x2={540}
              y2={740}
              stroke={COLORS.textMuted}
              strokeWidth={1}
              opacity={sideBySideOpacity * 0.5}
            />
          )}

          {/* Math center node */}
          {frame >= BEATS.MATH_NODE && (
            <g>
              {/* Dim glow (notably weaker) */}
              <circle
                cx={mathCX}
                cy={mathCY}
                r={60}
                fill={COLORS.errorRed}
                opacity={0.1 * mathCenterOpacity}
              />
              {/* Node circle */}
              <circle
                cx={mathCX}
                cy={mathCY}
                r={48}
                fill={COLORS.errorRed}
                stroke="#FFFFFF"
                strokeWidth={2}
                opacity={mathCenterOpacity}
                transform={`translate(${mathCX * (1 - mathCenterScale)}, ${
                  mathCY * (1 - mathCenterScale)
                }) scale(${mathCenterScale})`}
                style={{
                  transformOrigin: `${mathCX}px ${mathCY}px`,
                }}
              />
              <text
                x={mathCX}
                y={mathCY + 7}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={24}
                fontFamily={TYPOGRAPHY.code.fontFamily}
                opacity={mathCenterOpacity}
              >
                347
              </text>
            </g>
          )}

          {/* Math connection nodes — sparse */}
          {MATH_NODES.map((node, i) => {
            const nodeProgress = spring({
              frame: Math.max(
                0,
                frame - (BEATS.MATH_CONNECTIONS + i * 6)
              ),
              fps,
              config: SPRING_CONFIGS.gentle,
            });

            if (nodeProgress <= 0) return null;

            const pos = toXY(
              mathCX,
              mathCY,
              node.angle,
              node.radius
            );

            // Line — thin, dashed, low opacity
            const dx = pos.x - mathCX;
            const dy = pos.y - mathCY;
            const lineLength = Math.sqrt(dx * dx + dy * dy);

            return (
              <g key={`math-${i}`} opacity={nodeProgress}>
                <line
                  x1={mathCX}
                  y1={mathCY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={COLORS.errorRed}
                  strokeWidth={1}
                  strokeDasharray="6,6"
                  opacity={0.2}
                  strokeDashoffset={lineLength * (1 - nodeProgress)}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={16}
                  fill={COLORS.errorRed}
                  opacity={0.4}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={20}
                  fontFamily={TYPOGRAPHY.code.fontFamily}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Disconnected "5,552" node — no line, drifts */}
          {frame >= BEATS.MATH_CONNECTIONS + 18 && (
            <g
              opacity={interpolate(
                spring({
                  frame: Math.max(
                    0,
                    frame - (BEATS.MATH_CONNECTIONS + 18)
                  ),
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 0.5]
              )}
            >
              {(() => {
                const pos = toXY(
                  mathCX,
                  mathCY,
                  DISCONNECTED_ANSWER.angle,
                  DISCONNECTED_ANSWER.radius
                );
                return (
                  <>
                    <circle
                      cx={pos.x + driftX}
                      cy={pos.y}
                      r={16}
                      fill={COLORS.errorRed}
                      opacity={0.2}
                    />
                    <text
                      x={pos.x + driftX}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fill={COLORS.textMuted}
                      fontSize={18}
                      fontFamily={TYPOGRAPHY.code.fontFamily}
                    >
                      5,552
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Fizzling signals in math web (sparse, slow) */}
          {frame >= BEATS.MATH_SIGNALS &&
            MATH_NODES.slice(0, 2).map((node, i) => {
              const pos = toXY(
                mathCX,
                mathCY,
                node.angle,
                node.radius
              );
              const sigFrame = frame - BEATS.MATH_SIGNALS;
              const cycleDuration = 60;
              const t = (sigFrame % cycleDuration) / cycleDuration;
              // Signal fizzles out at 30%
              const fizzle = t < 0.3;
              const x = mathCX + (pos.x - mathCX) * t;
              const y = mathCY + (pos.y - mathCY) * t;
              const opacity = fizzle
                ? interpolate(t, [0, 0.1, 0.25, 0.3], [0, 0.6, 0.3, 0])
                : 0;

              return (
                <circle
                  key={`msig-${i}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#FFFFFF"
                  opacity={opacity}
                />
              );
            })}
        </svg>

        {/* Sparse label */}
        {frame >= BEATS.SPARSE_LABEL && (
          <div
            style={{
              position: 'absolute',
              top: mathCY - 300,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: sparseLabelOpacity,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.errorRed,
              }}
            >
              SPARSE — NOT A LANGUAGE PATTERN
            </span>
          </div>
        )}

        {/* AI attempts to generate answer */}
        {frame >= BEATS.ANSWER_ATTEMPT && (
          <div
            style={{
              position: 'absolute',
              top: mathCY + 120,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 32,
                color: COLORS.textBody,
              }}
            >
              347 x 16 ={' '}
            </span>
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 32,
                color: flickerSettled
                  ? COLORS.errorRed
                  : COLORS.textBody,
                fontWeight: flickerSettled ? 700 : 400,
              }}
            >
              {currentFlicker}
            </span>
          </div>
        )}

        {/* Side-by-side labels */}
        {frame >= BEATS.SIDE_BY_SIDE && (
          <>
            {/* Poetry label: "Language problem" */}
            <div
              style={{
                position: 'absolute',
                top: poetryCY + 200,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: sideBySideOpacity,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.solutionGreen }}>
                ✓
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 32,
                  color: COLORS.aiPurple,
                }}
              >
                Language problem
              </span>
            </div>

            {/* Math label: "Not a language problem" */}
            <div
              style={{
                position: 'absolute',
                top: mathCY + 180,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: sideBySideOpacity,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.errorRed }}>
                ✕
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 32,
                  color: COLORS.errorRed,
                }}
              >
                Not a language problem
              </span>
            </div>
          </>
        )}
      </div>
    </SceneContainer>
  );
};
