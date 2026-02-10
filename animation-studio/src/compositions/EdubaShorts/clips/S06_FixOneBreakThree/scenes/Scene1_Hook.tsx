import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ChatWindow } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 1: The Hook — "Fix One, Break Three"
 * Duration: 90 frames (3 seconds)
 *
 * Chat window with "Fix the login timeout bug" → green checkmark → 3 red error notifications
 */

const BEATS = {
  SCENE_IN: 0,
  CHAT_IN: 5,
  TYPING_INDICATOR: 15,
  AI_RESPONSE: 30,
  CHECKMARK_DRAW: 40,
  CHECKMARK_DIM: 55,
  BUG_1_IN: 50,
  BUG_2_IN: 58,
  BUG_3_IN: 66,
  CHECKMARK_FADE: 70,
  CHAT_DIM: 70,
  HOLD: 85,
};

// Bug notification component (inline for this scene, reused in Scene 4)
const BugNotification: React.FC<{
  message: string;
  startFrame: number;
  index: number;
  dimmed?: boolean;
}> = ({ message, startFrame, index, dimmed = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entrance = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const translateX = interpolate(entrance, [0, 1], [100, 0]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, dimmed ? 0.7 : 1]);

  // Pulsing red dot
  const dotOpacity = 0.6 + 0.4 * Math.sin(relativeFrame * 0.21);

  return (
    <div
      style={{
        backgroundColor: 'rgba(239,68,68,0.1)',
        border: `1px solid ${COLORS.errorRed}`,
        borderRadius: 10,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        marginTop: index > 0 ? 10 : 0,
        width: '100%',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: COLORS.errorRed,
          opacity: dotOpacity,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 26,
          color: COLORS.textBody,
        }}
      >
        {message}
      </span>
    </div>
  );
};

// SVG Checkmark component
const Checkmark: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const drawProgress = interpolate(relativeFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade after CHECKMARK_FADE
  const fadeOpacity = interpolate(
    frame,
    [BEATS.CHECKMARK_DIM, BEATS.CHECKMARK_FADE, BEATS.CHECKMARK_FADE + 10],
    [1, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const pathLength = 40;
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: -10,
        opacity: fadeOpacity,
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle
          cx={20}
          cy={20}
          r={16}
          fill="none"
          stroke={COLORS.solutionGreen}
          strokeWidth={2}
          opacity={0.3}
        />
        <path
          d="M12 20 L18 26 L28 14"
          fill="none"
          stroke={COLORS.solutionGreen}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  );
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chat window dim after bugs appear
  const chatDimOpacity = interpolate(
    frame,
    [BEATS.CHAT_DIM, BEATS.CHAT_DIM + 15],
    [1, 0.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Chat shifts left slightly when bugs appear
  const chatShiftX = interpolate(
    frame,
    [BEATS.CHAT_DIM, BEATS.CHAT_DIM + 15],
    [0, -10],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={82}
      fadeOutDuration={8}
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
        {/* Chat Window */}
        <div
          style={{
            width: '100%',
            opacity: chatDimOpacity,
            transform: `translateX(${chatShiftX}px)`,
            position: 'relative',
          }}
        >
          <ChatWindow
            messages={[
              { role: 'user', text: 'Fix the login timeout bug', delay: 0 },
              {
                role: 'ai',
                text: 'Fixed! Updated the auth handler and session config.',
                delay: BEATS.AI_RESPONSE - BEATS.CHAT_IN,
              },
            ]}
            startFrame={BEATS.CHAT_IN}
            messageStagger={25}
          />

          {/* Green checkmark near AI response */}
          <Checkmark startFrame={BEATS.CHECKMARK_DRAW} />
        </div>

        {/* Bug Notifications */}
        <div style={{ width: '100%' }}>
          <BugNotification
            message="TypeError: session.user is undefined"
            startFrame={BEATS.BUG_1_IN}
            index={0}
          />
          <BugNotification
            message="CORS policy blocked /api/auth"
            startFrame={BEATS.BUG_2_IN}
            index={1}
          />
          <BugNotification
            message="500: Database connection reset"
            startFrame={BEATS.BUG_3_IN}
            index={2}
          />
        </div>
      </div>
    </SceneContainer>
  );
};
