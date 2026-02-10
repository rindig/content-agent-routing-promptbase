/**
 * Scene 6A: Zoom Out
 * [9:00 - 9:15] — 450 frames
 *
 * "I want to zoom out for a moment because I think what's happening here
 *  is part of a larger pattern."
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

export const Scene6A_ZoomOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom out effect - previous content shrinks
  const zoomScale = interpolate(frame, [0, 120], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoomOpacity = interpolate(frame, [0, 120], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pattern text
  const patternEntrance = spring({ frame: frame - 120, fps, config: SPRING_CONFIGS.gentle });
  const patternOpacity = frame >= 120 ? interpolate(patternEntrance, [0, 1], [0, 1]) : 0;
  const patternFade = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Section header
  const headerEntrance = spring({ frame: frame - 300, fps, config: SPRING_CONFIGS.gentle });
  const headerOpacity = frame >= 300 ? interpolate(headerEntrance, [0, 1], [0, 1]) : 0;

  // Pattern dots
  const dots = Array.from({ length: 8 }).map((_, i) => ({
    x: 660 + (i % 4) * 160,
    y: 400 + Math.floor(i / 4) * 160,
    delay: i * 15,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Previous content shrinking away */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${zoomScale})`, opacity: zoomOpacity }}>
        <div style={{ width: 200, height: 120, backgroundColor: COLORS.surface, borderRadius: 12, border: `1px solid ${COLORS.refine}40` }} />
      </div>

      {/* "A larger pattern" */}
      {frame >= 120 && frame < 330 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: patternOpacity * patternFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Part of a <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>larger pattern</span>
          </div>
        </div>
      )}

      {/* Repeating pattern dots */}
      {frame >= 150 && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="1920" height="1080">
          {dots.map((dot, i) => {
            const dotEntrance = spring({ frame: frame - 150 - dot.delay, fps, config: SPRING_CONFIGS.snappy });
            const opacity = interpolate(dotEntrance, [0, 1], [0, 0.15]) * patternFade;
            return (
              <circle key={i} cx={dot.x} cy={dot.y} r={40} fill={COLORS.emphasis} opacity={opacity} />
            );
          })}
        </svg>
      )}

      {/* Section header: THE BIGGER PICTURE */}
      {frame >= 300 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: headerOpacity, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.emphasis, letterSpacing: '0.08em' }}>
            THE BIGGER PICTURE
          </div>
          <svg width="300" height="4" style={{ marginTop: 12 }}>
            <line x1={0} y1={2} x2={300 * spring({ frame: frame - 320, fps, config: SPRING_CONFIGS.snappy })} y2={2} stroke={COLORS.emphasis} strokeWidth={3} strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 20 }}>
            Historical perspective
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene6A_ZoomOut;
