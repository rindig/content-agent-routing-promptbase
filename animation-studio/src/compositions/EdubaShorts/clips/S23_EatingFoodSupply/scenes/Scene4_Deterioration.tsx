import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  CARD_SHRINK: 0,
  CODE_IN: 0,
  ARROW: 30,
  DETERIORATION: 60,
  ARROW_RED: 100,
  WARNING: 100,
  TEXT_BLOCK: 140,
  CRACKS: 180,
  DIM: 240,
};

// ── Crack lines data (SVG paths for fracture effect) ──
const CRACK_PATHS = [
  'M 430 0 L 445 40 L 435 80 L 450 120',
  'M 540 0 L 530 35 L 545 70 L 535 105',
  'M 480 0 L 470 50 L 485 90 L 475 130',
  'M 510 20 L 525 60 L 515 100',
  'M 460 10 L 450 55 L 465 95',
];

// ── Mini project health card (shrunk version from Scene 3) ──
const MiniProjectCard: React.FC<{
  frame: number;
  fps: number;
  contributors: number;
  openIssues: number;
}> = ({ frame, fps, contributors, openIssues }) => {
  // Shrink animation from full to mini
  const shrinkProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.6]);

  return (
    <div
      style={{
        width: 860,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        border: `1px solid ${COLORS.panelBorder}`,
        padding: '16px 24px',
        transform: `scale(${scale})`,
        boxShadow: `0 0 20px ${COLORS.glowRed}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 26,
            color: COLORS.errorRed,
          }}
        >
          data-tools/core-lib
        </span>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 18,
            color: COLORS.errorRed,
            textTransform: 'uppercase',
          }}
        >
          CRITICAL
        </span>
      </div>

      {/* Compact metrics row */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 16,
              color: COLORS.textDim,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            Contributors
          </span>
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 28,
              color: COLORS.errorRed,
            }}
          >
            {contributors}
          </div>
        </div>
        <div>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 16,
              color: COLORS.textDim,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            Open issues
          </span>
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 28,
              color: COLORS.errorRed,
            }}
          >
            {openIssues}
          </div>
        </div>
        <div>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 16,
              color: COLORS.textDim,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            Monthly commits
          </span>
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 28,
              color: COLORS.errorRed,
            }}
          >
            78
          </div>
        </div>
        <div>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 16,
              color: COLORS.textDim,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            Sponsors
          </span>
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 28,
              color: COLORS.errorRed,
            }}
          >
            3
          </div>
        </div>
      </div>

      {/* Crack overlay on card */}
      {frame >= BEATS.CRACKS && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 860 200"
          preserveAspectRatio="none"
        >
          {CRACK_PATHS.slice(0, 3).map((path, i) => {
            const crackRel = frame - BEATS.CRACKS - i * 5;
            if (crackRel < 0) return null;
            const crackProgress = interpolate(crackRel, [0, 20], [0, 1], {
              extrapolateRight: 'clamp',
            });
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1.5}
                strokeDasharray={200}
                strokeDashoffset={200 * (1 - crackProgress)}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

// ── Code panel (AI generating code) ──
const AICodePanel: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const scale = interpolate(enterProgress, [0, 1], [0.96, 1]);

  // Typewriter for code
  const codeLines = [
    'from core_lib import transform',
    'result = transform(data, config)',
  ];
  const charsPerFrame = 0.67;

  return (
    <div
      style={{
        width: 860,
        backgroundColor: COLORS.codeBg,
        borderRadius: 12,
        padding: '16px 24px 20px',
        opacity,
        transform: `scale(${scale})`,
        border: `1px solid ${COLORS.panelBorder}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: `1px solid ${COLORS.panelBorder}`,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 18,
            color: COLORS.aiPurple,
            marginLeft: 10,
            textTransform: 'none',
            letterSpacing: 1,
          }}
        >
          AI Copilot
        </span>
      </div>

      {/* Code lines */}
      {codeLines.map((line, i) => {
        const lineStart = 10 + i * 15;
        const lineRelFrame = relFrame - lineStart;
        if (lineRelFrame < 0) return <div key={i} style={{ minHeight: 32 }} />;
        const visibleChars = Math.min(
          Math.floor(lineRelFrame * charsPerFrame),
          line.length
        );
        const visibleText = line.slice(0, visibleChars);

        // Color keywords
        const colored = visibleText.replace(
          /(from|import)/g,
          (match) => match
        );

        return (
          <div key={i} style={{ minHeight: 32, marginBottom: 4 }}>
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 26,
                lineHeight: 1.6,
              }}
            >
              {visibleText.split(' ').map((token, j) => {
                const isKeyword = ['from', 'import'].includes(token);
                const isLib = ['core_lib', 'transform'].includes(token);
                return (
                  <React.Fragment key={j}>
                    <span
                      style={{
                        color: isKeyword
                          ? COLORS.aiPurple
                          : isLib
                          ? COLORS.techBlue
                          : COLORS.codeText,
                      }}
                    >
                      {token}
                    </span>
                    {j < visibleText.split(' ').length - 1 && ' '}
                  </React.Fragment>
                );
              })}
            </span>
          </div>
        );
      })}

      {/* Crack overlay on code panel */}
      {frame >= BEATS.CRACKS + 15 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 860 140"
          preserveAspectRatio="none"
        >
          {CRACK_PATHS.slice(2, 5).map((path, i) => {
            const crackRel = frame - BEATS.CRACKS - 15 - i * 5;
            if (crackRel < 0) return null;
            const crackProgress = interpolate(crackRel, [0, 20], [0, 1], {
              extrapolateRight: 'clamp',
            });
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1.5}
                strokeDasharray={200}
                strokeDashoffset={200 * (1 - crackProgress)}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

// ── Extraction arrow with color transition ──
const ExtractionPipe: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const arrowStart = BEATS.ARROW;
  const relFrame = frame - arrowStart;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Color interpolation: techBlue → errorRed
  const redShift = frame >= BEATS.ARROW_RED
    ? interpolate(frame - BEATS.ARROW_RED, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
      })
    : 0;

  // Pulse opacity
  const pulse = frame >= arrowStart + 15
    ? interpolate(
        Math.sin(((frame - arrowStart - 15) / 20) * Math.PI * 2),
        [-1, 1],
        [0.5, 1]
      )
    : drawProgress;

  // Arrow flow animation
  const flowOffset = relFrame > 15 ? (relFrame - 15) * 0.8 : 0;

  // Blend colors
  const r = Math.round(interpolate(redShift, [0, 1], [59, 239]));
  const g = Math.round(interpolate(redShift, [0, 1], [130, 68]));
  const b = Math.round(interpolate(redShift, [0, 1], [246, 68]));
  const arrowColor = `rgb(${r}, ${g}, ${b})`;

  // Warning icon
  const warningVisible = frame >= BEATS.WARNING;
  const warningProgress = warningVisible
    ? spring({ frame: frame - BEATS.WARNING, fps, config: SPRING_CONFIGS.bouncy })
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 90,
        opacity: pulse,
      }}
    >
      <svg width={44} height={90}>
        {/* Dashed line going up */}
        <line
          x1={22}
          y1={85}
          x2={22}
          y2={10}
          stroke={arrowColor}
          strokeWidth={3}
          strokeDasharray="8 4"
          strokeDashoffset={drawProgress < 1 ? 75 * (1 - drawProgress) : -flowOffset}
          opacity={drawProgress}
        />
        {/* Arrowhead */}
        <polygon
          points="14,18 22,4 30,18"
          fill={arrowColor}
          opacity={drawProgress}
        />
      </svg>

      {/* Warning triangle */}
      {warningVisible && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(24px, -50%) scale(${warningProgress})`,
            opacity: warningProgress,
          }}
        >
          <span
            style={{
              fontSize: 32,
              color: COLORS.insightOrange,
              textShadow: `0 0 10px ${COLORS.glowGold}`,
            }}
          >
            ⚠
          </span>
        </div>
      )}
    </div>
  );
};

// ── Scene4_Deterioration ──
export const Scene4_Deterioration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Live-declining contributors
  const contributorsDeclining = frame >= BEATS.DETERIORATION
    ? Math.round(
        interpolate(
          frame - BEATS.DETERIORATION,
          [0, 40],
          [94, 87],
          { extrapolateRight: 'clamp' }
        )
      )
    : 94;

  // Live-increasing issues
  const issuesIncreasing = frame >= BEATS.DETERIORATION
    ? Math.round(
        interpolate(
          frame - BEATS.DETERIORATION,
          [0, 40],
          [567, 612],
          { extrapolateRight: 'clamp' }
        )
      )
    : 567;

  // Text block entrance
  const textRelFrame = frame - BEATS.TEXT_BLOCK;
  const textLine1Progress = textRelFrame >= 0
    ? spring({ frame: textRelFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const textLine2Progress = textRelFrame >= 10
    ? spring({ frame: textRelFrame - 10, fps, config: SPRING_CONFIGS.gentle })
    : 0;

  // Dim everything except text
  const dimProgress = frame >= BEATS.DIM
    ? interpolate(frame - BEATS.DIM, [0, 30], [1, 0.15], {
        extrapolateRight: 'clamp',
      })
    : 1;

  const textDimProgress = frame >= BEATS.DIM
    ? interpolate(frame - BEATS.DIM, [0, 30], [1, 1], {
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
          gap: 0,
        }}
      >
        {/* Top half: AI code panel */}
        <div style={{ opacity: dimProgress }}>
          <AICodePanel frame={frame} fps={fps} startFrame={BEATS.CODE_IN} />
        </div>

        {/* Extraction arrow */}
        <div style={{ opacity: dimProgress }}>
          <ExtractionPipe frame={frame} fps={fps} />
        </div>

        {/* Bottom half: Mini project card */}
        <div style={{ opacity: dimProgress }}>
          <MiniProjectCard
            frame={frame}
            fps={fps}
            contributors={contributorsDeclining}
            openIssues={issuesIncreasing}
          />
        </div>

        {/* Central text block */}
        {textRelFrame >= 0 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              textAlign: 'center',
              padding: '0 54px',
              opacity: textDimProgress,
              zIndex: 10,
            }}
          >
            {/* Line 1 */}
            <div
              style={{
                opacity: interpolate(textLine1Progress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(textLine1Progress, [0, 1], [20, 0])}px)`,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 48,
                  color: COLORS.errorRed,
                }}
              >
                The foundation is cracking
              </span>
            </div>

            {/* Line 2 */}
            <div
              style={{
                opacity: interpolate(textLine2Progress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(textLine2Progress, [0, 1], [20, 0])}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.textMuted,
                }}
              >
                and we keep building on top of it
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
