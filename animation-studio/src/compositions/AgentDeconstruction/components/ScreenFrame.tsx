import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

/**
 * ScreenFrame - A styled monitor/screen frame for video insertion
 *
 * The inner area is a placeholder where real screen recordings
 * can be composited in post-production (CapCut, etc.)
 *
 * Features:
 * - Monitor-style bezel with subtle glow
 * - "ETHICS ENGINE v2.4" header label
 * - Status indicators and decorative elements
 * - Ambient scanning line animation
 * - Explode/deconstruct capability
 */

type ScreenFrameProps = {
  startFrame?: number;
  explodeProgress?: number; // 0-1, how much the frame separates
  showStatusBar?: boolean;
  width?: number;
  height?: number;
};

export const ScreenFrame: React.FC<ScreenFrameProps> = ({
  startFrame = 0,
  explodeProgress = 0,
  showStatusBar = true,
  width = 1200,
  height = 700,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Scan line position (loops continuously)
  const scanLineY = ((frame - startFrame) % 180) / 180;

  // Pulse animation for status dot
  const pulseScale = 1 + Math.sin((frame - startFrame) * 0.1) * 0.15;

  // Corner bracket positions for deconstruction
  const cornerOffset = explodeProgress * 40;

  // Inner content area dimensions (where video goes)
  const innerWidth = width - 40;
  const innerHeight = height - 80; // Account for header

  return (
    <div
      style={{
        width,
        position: 'relative',
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(baseProgress, [0, 1], [0.95, 1])})`,
      }}
    >
      {/* Ambient glow behind frame */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          left: -30,
          right: -30,
          bottom: -30,
          background: `radial-gradient(ellipse at center, ${COLORS.ethicsAccent}15 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: interpolate(explodeProgress, [0, 0.3], [0.6, 0]),
        }}
      />

      {/* Main frame container */}
      <div
        style={{
          backgroundColor: COLORS.ethicsInterface,
          borderRadius: 12,
          border: `2px solid ${COLORS.ethicsAccent}50`,
          boxShadow: `
            0 0 40px ${COLORS.ethicsAccent}20,
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 ${COLORS.ethicsAccent}20
          `,
          overflow: 'hidden',
          transform: `translateY(${explodeProgress * -10}px)`,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: `1px solid ${COLORS.ethicsAccent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `linear-gradient(180deg, ${COLORS.ethicsAccent}08 0%, transparent 100%)`,
            transform: `translateY(${explodeProgress * -20}px)`,
            opacity: interpolate(explodeProgress, [0, 0.5], [1, 0.5]),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Status dot with pulse */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: COLORS.ethicsSuccess,
                boxShadow: `0 0 12px ${COLORS.ethicsSuccess}`,
                transform: `scale(${pulseScale})`,
              }}
            />
            <span
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 16,
                color: COLORS.textPrimary,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              ETHICS ENGINE v2.4
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 12,
                color: COLORS.textMuted,
              }}
            >
              Model: Claude-3.5-Sonnet
            </span>
            {/* Window controls (decorative) */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B40',
                  border: '1px solid #F59E0B60',
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#22C55E40',
                  border: '1px solid #22C55E60',
                }}
              />
            </div>
          </div>
        </div>

        {/* Main content area - VIDEO PLACEHOLDER */}
        <div
          style={{
            height: innerHeight,
            position: 'relative',
            backgroundColor: '#0A0A12',
            overflow: 'hidden',
          }}
        >
          {/* Scan line effect */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${scanLineY * 100}%`,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.ethicsAccent}30, transparent)`,
              opacity: interpolate(explodeProgress, [0, 0.3], [0.5, 0]),
              pointerEvents: 'none',
            }}
          />

          {/* Corner brackets (tech aesthetic) */}
          {/* Top-left */}
          <div
            style={{
              position: 'absolute',
              top: 16 - cornerOffset,
              left: 16 - cornerOffset,
              width: 40,
              height: 40,
              borderTop: `2px solid ${COLORS.ethicsAccent}40`,
              borderLeft: `2px solid ${COLORS.ethicsAccent}40`,
              opacity: interpolate(baseProgress, [0.5, 1], [0, 0.8]),
            }}
          />
          {/* Top-right */}
          <div
            style={{
              position: 'absolute',
              top: 16 - cornerOffset,
              right: 16 - cornerOffset,
              width: 40,
              height: 40,
              borderTop: `2px solid ${COLORS.ethicsAccent}40`,
              borderRight: `2px solid ${COLORS.ethicsAccent}40`,
              opacity: interpolate(baseProgress, [0.5, 1], [0, 0.8]),
            }}
          />
          {/* Bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: 16 - cornerOffset,
              left: 16 - cornerOffset,
              width: 40,
              height: 40,
              borderBottom: `2px solid ${COLORS.ethicsAccent}40`,
              borderLeft: `2px solid ${COLORS.ethicsAccent}40`,
              opacity: interpolate(baseProgress, [0.5, 1], [0, 0.8]),
            }}
          />
          {/* Bottom-right */}
          <div
            style={{
              position: 'absolute',
              bottom: 16 - cornerOffset,
              right: 16 - cornerOffset,
              width: 40,
              height: 40,
              borderBottom: `2px solid ${COLORS.ethicsAccent}40`,
              borderRight: `2px solid ${COLORS.ethicsAccent}40`,
              opacity: interpolate(baseProgress, [0.5, 1], [0, 0.8]),
            }}
          />

          {/* Center placeholder indicator (subtle, for editing reference) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              opacity: 0.15,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 14,
                color: COLORS.textMuted,
                letterSpacing: 2,
              }}
            >
              VIDEO INSERT AREA
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 11,
                color: COLORS.textDim,
                marginTop: 8,
              }}
            >
              {innerWidth} × {innerHeight}
            </div>
          </div>

          {/* Subtle grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(${COLORS.ethicsAccent}05 1px, transparent 1px),
                linear-gradient(90deg, ${COLORS.ethicsAccent}05 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              opacity: interpolate(explodeProgress, [0, 0.3], [0.5, 0]),
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Status bar */}
        {showStatusBar && (
          <div
            style={{
              padding: '10px 24px',
              borderTop: `1px solid ${COLORS.ethicsAccent}20`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transform: `translateY(${explodeProgress * 20}px)`,
              opacity: interpolate(explodeProgress, [0, 0.5], [1, 0.5]),
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 11,
                color: COLORS.textDim,
              }}
            >
              Assessment in progress • 847 items • 3 personas
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 11,
                  color: COLORS.ethicsSuccess,
                }}
              >
                ● CONNECTED
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 11,
                  color: COLORS.textDim,
                }}
              >
                90% reliability
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating data points (ambient movement) */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + (frame - startFrame) * 0.005;
        const radius = 380 + Math.sin(i * 1.5) * 40;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.3;
        const delay = startFrame + 30 + i * 15;

        const dotProgress = spring({
          frame: frame - delay,
          fps,
          config: SPRING_CONFIGS.gentle,
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: COLORS.ethicsAccent,
              opacity: interpolate(dotProgress, [0, 1], [0, 0.4]) *
                interpolate(explodeProgress, [0, 0.5], [1, 0]),
              transform: `translate(${x}px, ${y}px)`,
              boxShadow: `0 0 8px ${COLORS.ethicsAccent}`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ScreenFrame;
