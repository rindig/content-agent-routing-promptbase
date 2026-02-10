import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type CodeDataBoundaryProps = {
  startFrame?: number;
  /** Show breach animation (buffer overflow concept) */
  showBreach?: boolean;
  breachFrame?: number;
  style?: React.CSSProperties;
};

export const CodeDataBoundary: React.FC<CodeDataBoundaryProps> = ({
  startFrame = 0,
  showBreach = false,
  breachFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(containerProgress, [0, 1], [0, 1]);

  // Breach animation
  const breachProgress = showBreach
    ? spring({
        frame: frame - breachFrame,
        fps,
        config: { damping: 10, stiffness: 100, mass: 1 },
      })
    : 0;

  const breachX = interpolate(breachProgress, [0, 1], [0, 120]);
  const warningOpacity = interpolate(breachProgress, [0.3, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulsing barrier
  const barrierPulse = showBreach && breachProgress > 0.3
    ? Math.sin(frame / 3) * 0.5 + 0.5
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        opacity,
        ...style,
      }}
    >
      {/* CODE section */}
      <div
        style={{
          width: 320,
          padding: 40,
          backgroundColor: COLORS.accentSecondary + '20',
          borderRadius: '16px 0 0 16px',
          border: `2px solid ${COLORS.accentSecondary}40`,
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: COLORS.accentSecondary,
          }}
        >
          CODE
        </div>

        {/* Code icons/symbols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['{ }', 'fn()', 'if/else', 'loop'].map((symbol, i) => {
            const delay = startFrame + 30 + i * 8;
            const p = spring({
              frame: frame - delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={symbol}
                style={{
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)`,
                  padding: '8px 20px',
                  backgroundColor: COLORS.accentSecondary + '30',
                  borderRadius: 8,
                  fontSize: 20,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: COLORS.accentSecondary,
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>
      </div>

      {/* BARRIER */}
      <div
        style={{
          width: 8,
          backgroundColor: showBreach && breachProgress > 0.3
            ? `rgba(239, 68, 68, ${0.5 + barrierPulse * 0.5})`
            : COLORS.warning,
          boxShadow: showBreach && breachProgress > 0.3
            ? `0 0 20px rgba(239, 68, 68, ${barrierPulse})`
            : `0 0 15px ${COLORS.warning}50`,
          position: 'relative',
        }}
      >
        {/* Security barrier icon */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: COLORS.background,
            border: `3px solid ${showBreach && breachProgress > 0.3 ? '#ef4444' : COLORS.warning}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 20,
          }}
        >
          {showBreach && breachProgress > 0.3 ? '⚠' : '🔒'}
        </div>
      </div>

      {/* DATA section */}
      <div
        style={{
          width: 320,
          padding: 40,
          backgroundColor: COLORS.success + '15',
          borderRadius: '0 16px 16px 0',
          border: `2px solid ${COLORS.success}30`,
          borderLeft: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: COLORS.success,
          }}
        >
          DATA
        </div>

        {/* Data icons/symbols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['42', '"hello"', '[1,2,3]', '{...}'].map((symbol, i) => {
            const delay = startFrame + 30 + i * 8;
            const p = spring({
              frame: frame - delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={symbol}
                style={{
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(p, [0, 1], [20, 0])}px)`,
                  padding: '8px 20px',
                  backgroundColor: COLORS.success + '25',
                  borderRadius: 8,
                  fontSize: 20,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: COLORS.success,
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>

        {/* Breach arrow */}
        {showBreach && (
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: '50%',
              transform: `translateX(${breachX}px) translateY(-50%)`,
              opacity: breachProgress,
            }}
          >
            <div
              style={{
                width: 80,
                height: 30,
                backgroundColor: '#ef4444',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              OVERFLOW
            </div>
          </div>
        )}
      </div>

      {/* Warning overlay */}
      {showBreach && (
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: warningOpacity,
            backgroundColor: '#ef444420',
            border: '2px solid #ef4444',
            borderRadius: 12,
            padding: '12px 24px',
            fontSize: 20,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 600,
            color: '#ef4444',
          }}
        >
          ⚠ SECURITY BOUNDARY VIOLATED
        </div>
      )}
    </div>
  );
};

export default CodeDataBoundary;
