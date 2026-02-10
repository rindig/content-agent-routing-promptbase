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

// ── Frame markers (relative to scene start) ──
const BEATS = {
  FADE_OUT_PREV: 0,
  ICONS_IN: 30,
  ICON_STAGGER: 5,
  LINE_1_IN: 50,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 90,
  LINE_2_STAGGER: 4,
  HOLD_START: 130,
  FADE_OUT: 195,
};

// ── Icon data ──
interface IconDef {
  label: string;
  year: string;
  color: string;
}

const ICONS: IconDef[] = [
  { label: 'Mad Libs', year: '1953', color: COLORS.historyGold },
  { label: 'AST', year: '1970s', color: COLORS.techBlue },
  { label: 'Prompt', year: '2024', color: COLORS.aiPurple },
];

// ── Mini icon component ──
const MiniIcon: React.FC<{
  icon: IconDef;
  index: number;
  frame: number;
  fps: number;
}> = ({ icon, index, frame, fps }) => {
  const iconStart = BEATS.ICONS_IN + index * BEATS.ICON_STAGGER;
  const relFrame = frame - iconStart;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Gentle pulse during hold
  const holdFrame = frame - BEATS.HOLD_START;
  const pulseScale =
    holdFrame >= 0
      ? 1 + 0.05 * Math.sin((holdFrame / 40) * Math.PI * 2)
      : 1;

  // Icon shapes
  const renderIcon = () => {
    const size = 80;
    const strokeWidth = 2;

    if (icon.label === 'Mad Libs') {
      // Card shape
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <rect
            x={12}
            y={16}
            width={56}
            height={48}
            rx={6}
            fill="none"
            stroke={icon.color}
            strokeWidth={strokeWidth}
          />
          {/* Lines representing text */}
          <line x1={22} y1={30} x2={58} y2={30} stroke={icon.color} strokeWidth={1.5} opacity={0.5} />
          <line x1={22} y1={40} x2={48} y2={40} stroke={icon.color} strokeWidth={1.5} opacity={0.5} />
          <line x1={22} y1={50} x2={52} y2={50} stroke={icon.color} strokeWidth={1.5} opacity={0.5} />
          {/* Blank indicator */}
          <rect x={34} y={37} width={24} height={7} rx={2} fill="none" stroke={icon.color} strokeWidth={1} strokeDasharray="3 2" />
        </svg>
      );
    }

    if (icon.label === 'AST') {
      // Tree shape
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          {/* Root */}
          <circle cx={40} cy={20} r={8} fill="none" stroke={icon.color} strokeWidth={strokeWidth} />
          {/* Children */}
          <circle cx={22} cy={48} r={6} fill="none" stroke={icon.color} strokeWidth={strokeWidth} />
          <circle cx={58} cy={48} r={6} fill="none" stroke={icon.color} strokeWidth={strokeWidth} />
          {/* Leaves */}
          <rect x={10} y={62} width={10} height={7} rx={2} fill="none" stroke={icon.color} strokeWidth={1.5} strokeDasharray="3 2" />
          <rect x={28} y={62} width={10} height={7} rx={2} fill="none" stroke={icon.color} strokeWidth={1.5} strokeDasharray="3 2" />
          <rect x={52} y={62} width={10} height={7} rx={2} fill="none" stroke={icon.color} strokeWidth={1.5} strokeDasharray="3 2" />
          {/* Lines */}
          <line x1={40} y1={28} x2={22} y2={42} stroke={icon.color} strokeWidth={1.5} opacity={0.6} />
          <line x1={40} y1={28} x2={58} y2={42} stroke={icon.color} strokeWidth={1.5} opacity={0.6} />
          <line x1={22} y1={54} x2={15} y2={62} stroke={icon.color} strokeWidth={1} opacity={0.4} />
          <line x1={22} y1={54} x2={33} y2={62} stroke={icon.color} strokeWidth={1} opacity={0.4} />
          <line x1={58} y1={54} x2={57} y2={62} stroke={icon.color} strokeWidth={1} opacity={0.4} />
        </svg>
      );
    }

    // System prompt icon
    return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <rect
          x={10}
          y={12}
          width={60}
          height={56}
          rx={6}
          fill="none"
          stroke={icon.color}
          strokeWidth={strokeWidth}
        />
        {/* Header bar */}
        <line x1={10} y1={24} x2={70} y2={24} stroke={icon.color} strokeWidth={1} opacity={0.4} />
        {/* Dots in header */}
        <circle cx={18} cy={18} r={2} fill={icon.color} opacity={0.5} />
        <circle cx={26} cy={18} r={2} fill={icon.color} opacity={0.5} />
        <circle cx={34} cy={18} r={2} fill={icon.color} opacity={0.5} />
        {/* Code lines */}
        <line x1={18} y1={34} x2={62} y2={34} stroke={icon.color} strokeWidth={1.5} opacity={0.4} />
        <line x1={18} y1={44} x2={52} y2={44} stroke={icon.color} strokeWidth={1.5} opacity={0.4} />
        <line x1={18} y1={54} x2={58} y2={54} stroke={icon.color} strokeWidth={1.5} opacity={0.4} />
        {/* Blank slots */}
        <rect x={38} y={31} width={20} height={7} rx={2} fill="none" stroke={icon.color} strokeWidth={1} strokeDasharray="3 2" />
      </svg>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale * pulseScale})`,
      }}
    >
      {renderIcon()}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: icon.color,
        }}
      >
        {icon.year}
      </span>
    </div>
  );
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Fade out from previous content ──
  const prevFadeOpacity = interpolate(
    frame,
    [0, 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Final fade out ──
  const endFadeOpacity = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background={COLORS.bg}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 60,
          opacity: endFadeOpacity,
        }}
      >
        {/* Three icons row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 80,
          }}
        >
          {ICONS.map((icon, i) => (
            <MiniIcon
              key={i}
              icon={icon}
              index={i}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        {/* Closing text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            maxWidth: 860,
            paddingLeft: 54,
            paddingRight: 54,
          }}
        >
          {/* Line 1 */}
          {frame >= BEATS.LINE_1_IN && (
            <div style={{ textAlign: 'center' }}>
              <BlurText
                startFrame={BEATS.LINE_1_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={BEATS.LINE_1_STAGGER}
                blurAmount={10}
                distance={30}
                fontSize={44}
              >
                {"We've been doing this since 1953."}
              </BlurText>
            </div>
          )}

          {/* Line 2 with highlight */}
          {frame >= BEATS.LINE_2_IN && (
            <div style={{ textAlign: 'center' }}>
              <BlurText
                startFrame={BEATS.LINE_2_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={BEATS.LINE_2_STAGGER}
                blurAmount={10}
                distance={30}
                fontSize={44}
              >
                We just called it writing templates.
              </BlurText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
