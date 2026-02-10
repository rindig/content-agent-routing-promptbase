import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { ChatWindow, ErrorMessage } from '../../../components';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  TITLE_IN: 5,
  CHAT_IN: 20,
  USER_MSG_1: 20,
  AI_TYPING: 40,
  AI_RESPONSE_1: 50,
  USER_MSG_2: 60,
  AI_RESPONSE_2: 70,
  ERROR_MSG: 85,
  CHAT_DIM: 90,
  RED_X: 95,
  SPREADSHEET_LABEL: 112,
  SPREADSHEET_IN: 115,
  OLD_WAY_TEXT: 145,
  CHAT_FADE_OUT: 175,
  FAILURE_1: 190,
  FAILURE_2: 205,
  FAILURE_3: 220,
  HOLD: 235,
  FADE_OUT: 260,
};

// ── Spreadsheet Mockup ──
const SpreadsheetMockup: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.SPREADSHEET_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const scale = interpolate(enterProgress, [0, 1], [0.95, 1]);

  const cols = 6;
  const rows = 4;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        border: `1.5px solid ${COLORS.solutionGreen}30`,
        borderRadius: 12,
        padding: 16,
        backgroundColor: COLORS.bgSurfaceAlt,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              style={{
                width: 100,
                height: 30,
                backgroundColor: r === 0 ? COLORS.bgSurface : COLORS.bgSurfaceAlt,
                border: `1px solid ${COLORS.panelBorder}`,
                borderRadius: 3,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ── Failure Card (X icon + label) ──
const FailureCard: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const x = interpolate(enterProgress, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${COLORS.errorRed}18`,
        borderRadius: 10,
        padding: '16px 24px',
        width: 700,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      {/* X icon */}
      <svg width={20} height={20} viewBox="0 0 20 20">
        <line x1={4} y1={4} x2={16} y2={16} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
        <line x1={16} y1={4} x2={4} y2={16} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 36,
          color: COLORS.textBody,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ── Scene2_Confusion ──
export const Scene2_Confusion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleProgress = spring({
    frame: Math.max(0, frame - BEATS.TITLE_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [20, 0]);

  // Chat dimming
  const chatDimProgress = interpolate(
    frame,
    [BEATS.CHAT_DIM, BEATS.CHAT_DIM + 20],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Red X
  const showRedX = frame >= BEATS.RED_X;
  const redXProgress = showRedX
    ? spring({
        frame: frame - BEATS.RED_X,
        fps,
        config: SPRING_CONFIGS.snappy,
      })
    : 0;

  // Chat fade out for failure cards
  const chatFadeOut = interpolate(
    frame,
    [BEATS.CHAT_FADE_OUT, BEATS.CHAT_FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Old way text
  const oldWayProgress = spring({
    frame: Math.max(0, frame - BEATS.OLD_WAY_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const oldWayOpacity = interpolate(oldWayProgress, [0, 1], [0, 1]);

  // Spreadsheet label
  const sheetLabelProgress = spring({
    frame: Math.max(0, frame - BEATS.SPREADSHEET_LABEL),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const sheetLabelOpacity = interpolate(sheetLabelProgress, [0, 1], [0, 1]);

  // Phase: before failure cards vs failure cards
  const showFailureCards = frame >= BEATS.CHAT_FADE_OUT;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={260}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 48,
              color: COLORS.insightOrange,
            }}
          >
            The Typical Rollout
          </span>
        </div>

        {/* Chat + Spreadsheet section (fades out for failure cards) */}
        {!showFailureCards && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              opacity: chatFadeOut,
            }}
          >
            {/* Chat Window with dimming overlay */}
            <div
              style={{
                width: '100%',
                opacity: chatDimProgress,
                position: 'relative',
              }}
            >
              <ChatWindow
                messages={[
                  { role: 'user', text: 'How do I use this for our Q3 reports?', delay: 0 },
                  { role: 'ai', text: 'I can help analyze data trends and generate summaries...', delay: 30 },
                  { role: 'user', text: 'But our data is in Salesforce and the custom CRM', delay: 40 },
                  { role: 'ai', text: "I don't have access to those systems. Please paste the data.", delay: 50 },
                ]}
                startFrame={BEATS.CHAT_IN}
                messageStagger={0}
              />

              {/* Red X overlay on chat */}
              {showRedX && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: interpolate(redXProgress, [0, 1], [0, 0.8]),
                  }}
                >
                  <svg width={80} height={80} viewBox="0 0 80 80">
                    <line
                      x1={10}
                      y1={10}
                      x2={70}
                      y2={70}
                      stroke={COLORS.errorRed}
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeDasharray={85}
                      strokeDashoffset={interpolate(redXProgress, [0, 1], [85, 0])}
                    />
                    <line
                      x1={70}
                      y1={10}
                      x2={10}
                      y2={70}
                      stroke={COLORS.errorRed}
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeDasharray={85}
                      strokeDashoffset={interpolate(redXProgress, [0, 1], [85, 0])}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Error message under chat */}
            {frame >= BEATS.ERROR_MSG && (
              <div style={{ width: '100%', maxWidth: 750 }}>
                <ErrorMessage
                  message="Integration: None configured"
                  icon="warning"
                  startFrame={BEATS.ERROR_MSG}
                />
              </div>
            )}

            {/* Spreadsheet section */}
            {frame >= BEATS.SPREADSHEET_LABEL && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 16,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: COLORS.textMuted,
                    opacity: sheetLabelOpacity,
                  }}
                >
                  BACK TO THE SPREADSHEET
                </span>
                <SpreadsheetMockup frame={frame} fps={fps} />
              </div>
            )}

            {/* Old way text */}
            {frame >= BEATS.OLD_WAY_TEXT && (
              <div style={{ opacity: oldWayOpacity, marginTop: 8 }}>
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 40,
                    color: COLORS.textMuted,
                  }}
                >
                  The old way was predictable.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Failure cards phase */}
        {showFailureCards && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginTop: 40,
            }}
          >
            <FailureCard
              text="No training on limitations"
              frame={frame}
              fps={fps}
              startFrame={BEATS.FAILURE_1}
            />
            <FailureCard
              text="No workflow integration"
              frame={frame}
              fps={fps}
              startFrame={BEATS.FAILURE_2}
            />
            <FailureCard
              text="No explanation of strengths"
              frame={frame}
              fps={fps}
              startFrame={BEATS.FAILURE_3}
            />
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
