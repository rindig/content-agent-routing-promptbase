import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SYSTEMS_DIM: 0,
  DIAGNOSTIC_PANEL: 10,
  PASS_1: 40,
  PASS_2: 60,
  PASS_3: 80,
  PASS_4: 100,
  MONOLITH_HEADER: 120,
  FAIL_1: 130,
  FAIL_2: 150,
  FAIL_3: 170,
  CONCLUSION_LINE_1: 190,
  CONCLUSION_LINE_2: 210,
  GLITCH_FLASH: 210,
  FADE_OUT: 250,
  SCENE_END: 300,
};

// ── Typewriter text helper ──
const TypewriterLine: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  color: string;
  charsPerFrame?: number;
  fontSize?: number;
}> = ({ text, frame, startFrame, color, charsPerFrame = 1.5, fontSize = 28 }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const charsVisible = Math.min(
    Math.floor(relFrame / (1 / charsPerFrame)),
    text.length
  );
  const visibleText = text.slice(0, charsVisible);
  const showCursor = charsVisible < text.length;

  return (
    <div
      style={{
        ...TYPOGRAPHY.code,
        fontSize,
        color,
        lineHeight: 1.6,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span>{visibleText}</span>
      {showCursor && (
        <span
          style={{
            color: COLORS.textMuted,
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
          }}
        >
          {'\u2588'}
        </span>
      )}
    </div>
  );
};

// ── Status indicator ──
const StatusIndicator: React.FC<{
  status: 'PASS' | 'FAIL';
  frame: number;
  startFrame: number;
  fps: number;
}> = ({ status, frame, startFrame, fps }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const flashProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const glowOpacity = interpolate(
    flashProgress,
    [0, 0.5, 1],
    [0, 0.8, 0.4]
  );

  const color = status === 'PASS' ? COLORS.solutionGreen : COLORS.errorRed;

  return (
    <span
      style={{
        ...TYPOGRAPHY.code,
        fontSize: 28,
        color,
        textShadow: `0 0 ${8 * glowOpacity}px ${color}`,
      }}
    >
      [{status}]
    </span>
  );
};

// ── Diagnostic line (status + typewriter text) ──
interface DiagnosticLine {
  status: 'PASS' | 'FAIL';
  text: string;
  startFrame: number;
  color: string;
}

const PASS_LINES: DiagnosticLine[] = [
  { status: 'PASS', text: ' Data layer: independent', startFrame: BEATS.PASS_1, color: COLORS.solutionGreen },
  { status: 'PASS', text: ' Business logic: isolated', startFrame: BEATS.PASS_2, color: COLORS.solutionGreen },
  { status: 'PASS', text: ' API contracts: stable', startFrame: BEATS.PASS_3, color: COLORS.solutionGreen },
  { status: 'PASS', text: ' Model: swappable', startFrame: BEATS.PASS_4, color: COLORS.solutionGreen },
];

const FAIL_LINES: DiagnosticLine[] = [
  { status: 'FAIL', text: ' No layer separation', startFrame: BEATS.FAIL_1, color: COLORS.errorRed },
  { status: 'FAIL', text: ' Model deeply coupled', startFrame: BEATS.FAIL_2, color: COLORS.errorRed },
  { status: 'FAIL', text: ' Swap = total rebuild', startFrame: BEATS.FAIL_3, color: COLORS.errorRed },
];

// ── Main Scene ──
export const Scene4_Diagnosis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel entrance
  const panelRelFrame = frame - BEATS.DIAGNOSTIC_PANEL;
  const panelProgress =
    panelRelFrame >= 0
      ? spring({
          frame: panelRelFrame,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);
  const panelScale = interpolate(panelProgress, [0, 1], [0.97, 1]);

  // Fade out
  const fadeOutProgress =
    frame >= BEATS.FADE_OUT
      ? interpolate(
          frame,
          [BEATS.FADE_OUT, BEATS.SCENE_END],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  // Show monolith section header
  const showMonolithHeader = frame >= BEATS.MONOLITH_HEADER;
  const monolithHeaderProgress = showMonolithHeader
    ? spring({
        frame: frame - BEATS.MONOLITH_HEADER,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          opacity: fadeOutProgress,
        }}
      >
        {/* Diagnostic terminal panel */}
        {panelRelFrame >= 0 && (
          <div
            style={{
              width: 900,
              backgroundColor: COLORS.codeBg,
              borderRadius: 12,
              padding: '28px 32px',
              opacity: panelOpacity,
              transform: `scale(${panelScale})`,
              border: `1px solid ${COLORS.panelBorder}`,
              maxHeight: 1400,
              overflow: 'hidden',
            }}
          >
            {/* Terminal dots */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
            </div>

            {/* System Diagnostic Header */}
            <TypewriterLine
              text="SYSTEM DIAGNOSTIC"
              frame={frame}
              startFrame={BEATS.DIAGNOSTIC_PANEL}
              color={COLORS.solutionGreen}
              charsPerFrame={2}
              fontSize={30}
            />
            <div
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: COLORS.textDim,
                marginBottom: 16,
              }}
            >
              {'\u2500'.repeat(30)}
            </div>

            {/* PASS lines */}
            {PASS_LINES.map((line, i) => (
              <div
                key={`pass-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <StatusIndicator
                  status={line.status}
                  frame={frame}
                  startFrame={line.startFrame}
                  fps={fps}
                />
                <TypewriterLine
                  text={line.text}
                  frame={frame}
                  startFrame={line.startFrame + 2}
                  color={line.color}
                />
              </div>
            ))}

            {/* Monolith section divider */}
            {showMonolithHeader && (
              <div
                style={{
                  marginTop: 24,
                  marginBottom: 12,
                  opacity: interpolate(monolithHeaderProgress, [0, 1], [0, 1]),
                }}
              >
                <TypewriterLine
                  text="MONOLITH DIAGNOSTIC"
                  frame={frame}
                  startFrame={BEATS.MONOLITH_HEADER}
                  color={COLORS.errorRed}
                  charsPerFrame={2}
                  fontSize={30}
                />
                <div
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 28,
                    color: COLORS.textDim,
                    marginBottom: 16,
                  }}
                >
                  {'\u2500'.repeat(30)}
                </div>
              </div>
            )}

            {/* FAIL lines */}
            {FAIL_LINES.map((line, i) => (
              <div
                key={`fail-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <StatusIndicator
                  status={line.status}
                  frame={frame}
                  startFrame={line.startFrame}
                  fps={fps}
                />
                <TypewriterLine
                  text={line.text}
                  frame={frame}
                  startFrame={line.startFrame + 2}
                  color={line.color}
                />
              </div>
            ))}

            {/* Conclusion */}
            {frame >= BEATS.CONCLUSION_LINE_1 && (
              <div
                style={{
                  marginTop: 28,
                  borderTop: `1px solid ${COLORS.panelBorder}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.code,
                      fontSize: 28,
                      color: COLORS.textDim,
                    }}
                  >
                    CONCLUSION:
                  </span>
                  <TypewriterLine
                    text=" The model isn't the problem."
                    frame={frame}
                    startFrame={BEATS.CONCLUSION_LINE_1}
                    color={COLORS.insightOrange}
                    charsPerFrame={1.5}
                  />
                </div>

                {frame >= BEATS.CONCLUSION_LINE_2 && (
                  <div
                    style={{
                      marginLeft: 150,
                    }}
                  >
                    <GlitchText
                      startFrame={BEATS.GLITCH_FLASH}
                      intensity={0.3}
                      speed={6}
                      enableShadows
                      color={COLORS.textPrimary}
                      fontSize={30}
                    >
                      The architecture is.
                    </GlitchText>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
