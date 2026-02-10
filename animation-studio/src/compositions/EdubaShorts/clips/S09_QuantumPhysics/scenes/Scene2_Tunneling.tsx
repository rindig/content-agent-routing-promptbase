import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GradientText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── S09 extended palette ──
const S09_COLORS = {
  electronGlow: '#A78BFA',
  barrierGray: '#4B5563',
  ghostElectron: 'rgba(167,139,250,0.35)',
  quantumGlow: 'rgba(139,92,246,0.2)',
};

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  CHANNEL_IN: 10,
  BARRIER_IN: 15,
  BARRIER_LABEL: 20,
  ELECTRON_IN: 25,
  ELECTRON_LABEL: 30,
  ELECTRON_APPROACH: 50,
  ELECTRON_PRESS: 70,
  TUNNEL_START: 80,
  GHOST_APPEARS: 85,
  BARRIER_RIPPLE: 90,
  GHOST_SOLIDIFY: 100,
  QT_TEXT_IN: 120,
  HERE_THERE_TEXT: 130,
  ANNOTATION_LEFT: 150,
  ANNOTATION_RIGHT: 155,
  DASHED_LINE: 160,
  HOLD: 180,
};

// ── Electron probability cloud ──
const ElectronCloud: React.FC<{
  frame: number;
  fps: number;
  opacity: number;
  scale?: number;
  dotCount?: number;
  dotOpacityRange?: [number, number];
}> = ({
  frame,
  opacity,
  scale = 1,
  dotCount = 6,
  dotOpacityRange = [0.3, 0.7],
}) => {
  const pulseRadius = 35 + 10 * Math.sin(frame * 0.07);

  // Jittering dots inside the cloud
  const dots = Array.from({ length: dotCount }, (_, i) => {
    const speed = 0.08 + i * 0.015;
    const phase = (i * Math.PI * 2) / dotCount;
    const amplitude = 15;
    const x = Math.sin(frame * speed + phase) * amplitude;
    const y = Math.cos(frame * speed * 0.8 + phase) * amplitude;
    const dotOpacity =
      dotOpacityRange[0] +
      (dotOpacityRange[1] - dotOpacityRange[0]) *
        ((Math.sin(frame * 0.1 + i) + 1) / 2);

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: 3,
          height: 3,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          opacity: dotOpacity,
          transform: `translate(${x}px, ${y}px)`,
          top: '50%',
          left: '50%',
          marginTop: -1.5,
          marginLeft: -1.5,
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: 'relative',
        width: pulseRadius * 2,
        height: pulseRadius * 2,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Radial gradient cloud */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S09_COLORS.electronGlow}CC 0%, ${S09_COLORS.electronGlow}44 40%, transparent 70%)`,
        }}
      />
      {dots}
    </div>
  );
};

// ── Scene2_Tunneling ──
export const Scene2_Tunneling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Channel lines ──
  const channelProgress = spring({
    frame: frame - BEATS.CHANNEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const channelOpacity = interpolate(channelProgress, [0, 1], [0, 1]);

  // ── Barrier ──
  const barrierProgress = spring({
    frame: frame - BEATS.BARRIER_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const barrierScaleY = interpolate(barrierProgress, [0, 1], [0, 1]);

  // Barrier label
  const barrierLabelProgress = spring({
    frame: frame - BEATS.BARRIER_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // ── Electron entrance ──
  const electronEnterProgress = spring({
    frame: frame - BEATS.ELECTRON_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const electronOpacity = interpolate(electronEnterProgress, [0, 1], [0, 0.8]);

  // Electron label
  const electronLabelProgress = spring({
    frame: frame - BEATS.ELECTRON_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // ── Electron approach ──
  const approachRelFrame = frame - BEATS.ELECTRON_APPROACH;
  const approachDuration = BEATS.ELECTRON_PRESS - BEATS.ELECTRON_APPROACH;
  const approachProgress =
    approachRelFrame >= 0
      ? interpolate(approachRelFrame, [0, approachDuration], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.ease),
        })
      : 0;
  const electronX = interpolate(approachProgress, [0, 1], [-200, 0]);

  // ── Electron press ──
  const pressRelFrame = frame - BEATS.ELECTRON_PRESS;
  const pressDuration = BEATS.TUNNEL_START - BEATS.ELECTRON_PRESS;
  const pressProgress =
    pressRelFrame >= 0
      ? interpolate(pressRelFrame, [0, pressDuration], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;
  const electronScaleX = interpolate(pressProgress, [0, 1], [1.0, 0.7]);
  const electronScaleY = interpolate(pressProgress, [0, 1], [1.0, 1.2]);

  // Barrier contact glow
  const contactGlow =
    pressRelFrame >= 0
      ? interpolate(pressRelFrame, [0, pressDuration], [0, 0.15], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // ── Tunneling: original dims, ghost appears ──
  const tunnelRelFrame = frame - BEATS.TUNNEL_START;
  const originalDim =
    tunnelRelFrame >= 0
      ? interpolate(tunnelRelFrame, [0, 20], [0.8, 0.3], {
          extrapolateRight: 'clamp',
        })
      : frame >= BEATS.ELECTRON_IN
      ? electronOpacity
      : 0;

  // Ghost electron
  const ghostRelFrame = frame - BEATS.GHOST_APPEARS;
  const ghostInitialOpacity =
    ghostRelFrame >= 0
      ? interpolate(ghostRelFrame, [0, 20], [0, 0.35], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // Ghost solidify
  const solidifyRelFrame = frame - BEATS.GHOST_SOLIDIFY;
  const ghostFinalOpacity =
    solidifyRelFrame >= 0
      ? interpolate(solidifyRelFrame, [0, 20], [ghostInitialOpacity, 0.7], {
          extrapolateRight: 'clamp',
        })
      : ghostInitialOpacity;

  // ── Barrier ripple ──
  const rippleRelFrame = frame - BEATS.BARRIER_RIPPLE;
  const barrierRippleX =
    rippleRelFrame >= 0 && rippleRelFrame < 15
      ? Math.sin(rippleRelFrame * 0.8) * 3
      : 0;
  const barrierTintPurple =
    rippleRelFrame >= 0 && rippleRelFrame < 20
      ? interpolate(rippleRelFrame, [0, 10, 20], [0, 0.4, 0], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // ── "Quantum Tunneling" text ──
  const qtTextProgress = spring({
    frame: frame - BEATS.QT_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const qtTextOpacity = interpolate(qtTextProgress, [0, 1], [0, 1]);
  const qtTextY = interpolate(qtTextProgress, [0, 1], [20, 0]);

  // ── "here to there" text ──
  const herethereProgress = spring({
    frame: frame - BEATS.HERE_THERE_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const herethereOpacity = interpolate(herethereProgress, [0, 1], [0, 1]);

  // ── Annotation: HERE ──
  const hereProgress = spring({
    frame: frame - BEATS.ANNOTATION_LEFT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const hereOpacity = interpolate(hereProgress, [0, 1], [0, 1]);

  // ── Annotation: THERE ──
  const thereProgress = spring({
    frame: frame - BEATS.ANNOTATION_RIGHT,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const thereOpacity = interpolate(thereProgress, [0, 1], [0, 1]);
  const thereScale = interpolate(thereProgress, [0, 1], [0.5, 1]);

  // ── Dashed line ──
  const dashedRelFrame = frame - BEATS.DASHED_LINE;
  const dashedProgress =
    dashedRelFrame >= 0
      ? interpolate(dashedRelFrame, [0, 20], [1, 0], {
          extrapolateRight: 'clamp',
        })
      : 1;

  // ── Background quantum glow breathing ──
  const holdRelFrame = frame - BEATS.HOLD;
  const bgGlowRadius =
    holdRelFrame >= 0
      ? 300 + 30 * Math.sin(holdRelFrame * 0.05)
      : 300;

  // ── Ghost pulse during hold ──
  const ghostPulse =
    frame >= BEATS.HOLD
      ? 0.6 + 0.1 * Math.sin((frame - BEATS.HOLD) * 0.08)
      : ghostFinalOpacity;

  // Determine actual electron display opacity
  const displayElectronOpacity =
    frame >= BEATS.TUNNEL_START
      ? originalDim
      : frame >= BEATS.ELECTRON_IN
      ? electronOpacity
      : 0;

  // Display ghost opacity
  const displayGhostOpacity =
    frame >= BEATS.HOLD ? ghostPulse : ghostFinalOpacity;

  // Layout: center of content zone
  const channelY = 800; // vertical center area for the channel diagram
  const channelGap = 200; // gap between top and bottom channel lines
  const barrierCenterX = 540; // horizontal center

  return (
    <SceneContainer background="#0B1120" fadeIn fadeInDuration={15}>
      {/* Background quantum glow */}
      <div
        style={{
          position: 'absolute',
          top: channelY,
          left: barrierCenterX,
          width: bgGlowRadius,
          height: bgGlowRadius,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S09_COLORS.quantumGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
          opacity: frame >= BEATS.HOLD ? 0.6 : 0.3,
        }}
      />

      {/* Channel lines */}
      {channelOpacity > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: channelY - channelGap / 2 - 2,
            left: 100,
            opacity: channelOpacity,
          }}
          width={700}
          height={channelGap + 4}
        >
          <line
            x1={0}
            y1={2}
            x2={700}
            y2={2}
            stroke={COLORS.textMuted}
            strokeWidth={2}
          />
          <line
            x1={0}
            y1={channelGap + 2}
            x2={700}
            y2={channelGap + 2}
            stroke={COLORS.textMuted}
            strokeWidth={2}
          />
        </svg>
      )}

      {/* Gate barrier */}
      <div
        style={{
          position: 'absolute',
          left: barrierCenterX - 10,
          top: channelY - channelGap / 2,
          width: 20,
          height: channelGap,
          backgroundColor: barrierTintPurple > 0
            ? `color-mix(in srgb, ${S09_COLORS.barrierGray} ${Math.round((1 - barrierTintPurple) * 100)}%, ${COLORS.aiPurple})`
            : S09_COLORS.barrierGray,
          borderRadius: 4,
          transformOrigin: 'bottom center',
          transform: `scaleY(${barrierScaleY}) translateX(${barrierRippleX}px)`,
          opacity: barrierScaleY > 0 ? 1 : 0,
        }}
      >
        {/* Contact glow on left edge */}
        {contactGlow > 0 && (
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: 0,
              bottom: 0,
              width: 10,
              background: `linear-gradient(to right, transparent, ${S09_COLORS.electronGlow})`,
              opacity: contactGlow,
            }}
          />
        )}
      </div>

      {/* Barrier label */}
      {barrierLabelProgress > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX,
            top: channelY - channelGap / 2 - 50,
            transform: 'translateX(-50%)',
            opacity: interpolate(barrierLabelProgress, [0, 1], [0, 1]),
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: COLORS.textMuted,
            textAlign: 'center' as const,
            whiteSpace: 'nowrap' as const,
          }}
        >
          GATE BARRIER
        </div>
      )}

      {/* Original electron (left side) */}
      {displayElectronOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX - 70 + electronX,
            top: channelY - 40,
            transform: `scaleX(${electronScaleX}) scaleY(${electronScaleY})`,
            transformOrigin: 'center',
          }}
        >
          <ElectronCloud
            frame={frame}
            fps={fps}
            opacity={displayElectronOpacity}
            dotCount={6}
          />
        </div>
      )}

      {/* Electron label */}
      {electronLabelProgress > 0.01 && frame < BEATS.QT_TEXT_IN && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX - 150 + (frame >= BEATS.ELECTRON_APPROACH ? electronX : -200),
            top: channelY + channelGap / 2 + 30,
            opacity: interpolate(electronLabelProgress, [0, 1], [0, 1]) *
              (frame >= BEATS.TUNNEL_START ? 0 : 1),
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: S09_COLORS.electronGlow,
            textAlign: 'center' as const,
            width: 160,
          }}
        >
          ELECTRON
        </div>
      )}

      {/* Ghost electron (right side) */}
      {displayGhostOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX + 30,
            top: channelY - 40,
          }}
        >
          <ElectronCloud
            frame={frame}
            fps={fps}
            opacity={displayGhostOpacity}
            dotCount={3}
            dotOpacityRange={[0.15, 0.4]}
          />
        </div>
      )}

      {/* "Quantum Tunneling" gradient text */}
      {qtTextOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: channelY + channelGap / 2 + 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: qtTextOpacity,
            transform: `translateY(${qtTextY}px)`,
          }}
        >
          <GradientText
            colors={[COLORS.aiPurple, '#C4B5FD', '#E0D7FF']}
            direction="diagonal"
            fontSize={56}
            fontWeight={700}
            duration={90}
            yoyo
          >
            QUANTUM TUNNELING
          </GradientText>

          {/* "here to there" */}
          {herethereOpacity > 0 && (
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.textBody,
                opacity: herethereOpacity,
                textAlign: 'center',
              }}
            >
              'here' to 'there'
            </div>
          )}
        </div>
      )}

      {/* Annotation: HERE (left) */}
      {hereOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX - 180,
            top: channelY - channelGap / 2 - 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            opacity: hereOpacity,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 28,
              color: COLORS.textMuted,
            }}
          >
            HERE
          </div>
          {/* Arrow pointing down */}
          <svg width={20} height={30}>
            <line
              x1={10}
              y1={0}
              x2={10}
              y2={24}
              stroke={COLORS.textMuted}
              strokeWidth={2}
            />
            <polygon
              points="4,20 10,28 16,20"
              fill={COLORS.textMuted}
            />
          </svg>
        </div>
      )}

      {/* Annotation: THERE (right) */}
      {thereOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: barrierCenterX + 80,
            top: channelY - channelGap / 2 - 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            opacity: thereOpacity,
            transform: `scale(${thereScale})`,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 28,
              color: COLORS.insightOrange,
            }}
          >
            THERE
          </div>
          {/* Arrow pointing down */}
          <svg width={20} height={30}>
            <line
              x1={10}
              y1={0}
              x2={10}
              y2={24}
              stroke={COLORS.insightOrange}
              strokeWidth={2}
            />
            <polygon
              points="4,20 10,28 16,20"
              fill={COLORS.insightOrange}
            />
          </svg>
        </div>
      )}

      {/* Dashed line through barrier */}
      {dashedRelFrame >= 0 && (
        <svg
          style={{
            position: 'absolute',
            left: barrierCenterX - 180,
            top: channelY,
          }}
          width={360}
          height={4}
        >
          <line
            x1={0}
            y1={2}
            x2={360}
            y2={2}
            stroke={COLORS.aiPurple}
            strokeWidth={2}
            strokeDasharray="8 4"
            strokeDashoffset={dashedProgress * 360}
          />
        </svg>
      )}
    </SceneContainer>
  );
};
