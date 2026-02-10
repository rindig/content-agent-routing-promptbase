/**
 * VideoPlaceholder - Minimal animated frame for overlay footage
 * Designed to be layered UNDER footage in CapCut
 */
import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, TYPOGRAPHY } from '../constants';

interface VideoPlaceholderProps {
  label: string;
  duration?: string;
  width?: number;
  height?: number;
  startFrame?: number;
}

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  label,
  duration = '~15 sec',
  width = 1600,
  height = 800,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;

  // Entrance animation
  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  // Scan line animation (slow, every 60 frames)
  const scanLinePosition = ((adjustedFrame % 90) / 90) * 100;

  // Corner bracket pulse
  const pulseOpacity = Math.sin(adjustedFrame * 0.05) * 0.2 + 0.6;

  const bracketSize = 24;
  const bracketColor = `${COLORS.build}`;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.build}40`,
        borderRadius: 12,
        position: 'relative',
        opacity,
        transform: `scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {/* Top Left */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          width: bracketSize,
          height: bracketSize,
          borderTop: `3px solid ${bracketColor}`,
          borderLeft: `3px solid ${bracketColor}`,
          opacity: pulseOpacity,
        }}
      />
      {/* Top Right */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: bracketSize,
          height: bracketSize,
          borderTop: `3px solid ${bracketColor}`,
          borderRight: `3px solid ${bracketColor}`,
          opacity: pulseOpacity,
        }}
      />
      {/* Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          width: bracketSize,
          height: bracketSize,
          borderBottom: `3px solid ${bracketColor}`,
          borderLeft: `3px solid ${bracketColor}`,
          opacity: pulseOpacity,
        }}
      />
      {/* Bottom Right */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          width: bracketSize,
          height: bracketSize,
          borderBottom: `3px solid ${bracketColor}`,
          borderRight: `3px solid ${bracketColor}`,
          opacity: pulseOpacity,
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanLinePosition}%`,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.build}40, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Label (top left) */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 48,
          fontSize: 18,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textDim,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        INSERT: {label}
      </div>

      {/* Duration badge (bottom right) */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 48,
          fontSize: 16,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textDim,
          padding: '6px 12px',
          backgroundColor: `${COLORS.background}80`,
          borderRadius: 6,
        }}
      >
        {duration}
      </div>

      {/* Center icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke={COLORS.textDim} strokeWidth="1.5" />
          <polygon points="10,8 16,12 10,16" fill={COLORS.textDim} />
        </svg>
        <span
          style={{
            fontSize: 14,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            color: COLORS.textDim,
            opacity: 0.6,
          }}
        >
          VIDEO PLACEHOLDER
        </span>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
