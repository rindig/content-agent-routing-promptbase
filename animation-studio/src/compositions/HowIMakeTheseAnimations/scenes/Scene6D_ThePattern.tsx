/**
 * Scene 6D: The Pattern
 * [10:10 - 10:30] — 600 frames
 *
 * The pattern distilled: tool emerges -> access -> realization.
 * Ransom note effect, floor rises, current moment for animation.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { PATTERN: 0, COMPONENTS: 120, RANSOM: 240, FLOOR: 360, NOW: 480 };

export const Scene6D_ThePattern: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 100) / 100) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 40, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  // Floor rise
  const floorProgress = interpolate(frame, [PHASE.FLOOR + 30, PHASE.FLOOR + 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Ransom note
  const ransomFonts = ['Georgia, serif', 'Impact, sans-serif', 'Courier New, monospace', 'Trebuchet MS, sans-serif', 'Arial Black, sans-serif', 'Palatino, serif', 'Times New Roman, serif', 'Verdana, sans-serif'];
  const ransomWords = ['The', 'messy', 'period', 'early', 'on', 'is', 'always', 'temporary'];
  const ransomColors = [COLORS.time, COLORS.spec, COLORS.build, COLORS.emphasis, COLORS.refine, COLORS.time, COLORS.possibility, COLORS.spec];

  // Ambient particles
  const particles = Array.from({ length: 10 }).map((_, i) => ({
    x: (i * 200 + frame * (0.2 + i * 0.04)) % 1920,
    y: (i * 150 + Math.sin(frame * 0.02 + i) * 50) % 1080,
    opacity: 0.12 + Math.sin(frame * 0.03 + i * 2) * 0.08,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.emphasis, opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= PATTERN STATEMENT ============= */}
      {frame < PHASE.COMPONENTS + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.COMPONENTS), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.emphasis }}>
            The pattern is always the same
          </div>
          <svg width="500" height="40" viewBox="0 0 500 40" style={{ marginTop: 24 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const dotE = spring({ frame: frame - 30 - i * 6, fps, config: SPRING_CONFIGS.snappy });
              return <circle key={i} cx={25 + i * 40} cy={20} r={8} fill={COLORS.emphasis} opacity={interpolate(dotE, [0, 1], [0, 0.5])} />;
            })}
          </svg>
        </div>
      )}

      {/* ============= COMPONENTS ============= */}
      {frame >= PHASE.COMPONENTS && frame < PHASE.RANSOM + 20 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.COMPONENTS, PHASE.RANSOM) }}>
          {[
            { label: 'Tool emerges', sub: 'Access to execution', color: COLORS.build, icon: '01' },
            { label: 'People with ideas', sub: 'Can realize them', color: COLORS.possibility, icon: '02' },
            { label: 'Not replacing pros', sub: 'Enabling new creators', color: COLORS.emphasis, icon: '03' },
          ].map((item, i) => {
            const e = spring({ frame: frame - PHASE.COMPONENTS - 15 - i * 25, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{ opacity: interpolate(e, [0, 1], [0, 1]), transform: `translateX(${interpolate(e, [0, 1], [60, 0])}px)`, display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: `${item.color}15`, border: `2px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: SIZES.label, color: item.color, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 600 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>{item.label}</div>
                  <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: item.color, marginTop: 4 }}>{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============= RANSOM NOTE ============= */}
      {frame >= PHASE.RANSOM && frame < PHASE.FLOOR + 20 && (
        <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.RANSOM, PHASE.FLOOR), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 30 }}>
            The "ransom note" period
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 900 }}>
            {ransomWords.map((word, i) => {
              const wE = spring({ frame: frame - PHASE.RANSOM - 20 - i * 8, fps, config: SPRING_CONFIGS.bouncy });
              const wobble = Math.sin((frame + i * 40) * 0.06) * 4;
              const sizes = [52, 40, 56, 36, 48, 38, 44, 54];
              return (
                <span key={i} style={{ fontFamily: ransomFonts[i], fontSize: sizes[i], color: ransomColors[i], opacity: interpolate(wE, [0, 1], [0, 1]), transform: `rotate(${wobble}deg)`, display: 'inline-block', padding: '4px 12px', backgroundColor: `${ransomColors[i]}08`, borderRadius: 6 }}>
                  {word}
                </span>
              );
            })}
          </div>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted, marginTop: 24 }}>
            Desktop publishing, circa 1985
          </div>
        </div>
      )}

      {/* ============= FLOOR RISES ============= */}
      {frame >= PHASE.FLOOR && frame < PHASE.NOW + 20 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.FLOOR, PHASE.NOW), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 30 }}>
            Over time, the <span style={{ color: COLORS.possibility, fontWeight: 700 }}>floor rises</span>
          </div>
          <svg width="900" height="360" viewBox="0 0 900 360">
            <line x1={80} y1={320} x2={860} y2={320} stroke={COLORS.textMuted} strokeWidth={2} />
            <line x1={80} y1={320} x2={80} y2={30} stroke={COLORS.textMuted} strokeWidth={2} />
            <text x={470} y={355} textAnchor="middle" fill={COLORS.textMuted} fontSize="22" fontFamily={TYPOGRAPHY.code.fontFamily}>TIME</text>
            <text x={30} y={175} textAnchor="middle" fill={COLORS.textMuted} fontSize="20" fontFamily={TYPOGRAPHY.code.fontFamily} transform="rotate(-90, 30, 175)">QUALITY</text>
            <line x1={80} y1={interpolate(floorProgress, [0, 1], [280, 200])} x2={860} y2={interpolate(floorProgress, [0, 1], [280, 140])} stroke={COLORS.possibility} strokeWidth={4} strokeLinecap="round" />
            {Array.from({ length: 25 }).map((_, i) => {
              const dotX = 100 + i * 30 + Math.sin(i * 2.5) * 12;
              const baseFloor = interpolate(floorProgress, [0, 1], [280, 200]) - (i * 2);
              const dotY = baseFloor - 20 - (Math.abs(Math.sin(i * 1.7)) * 100);
              const dotE = spring({ frame: frame - PHASE.FLOOR - 40 - i * 3, fps, config: SPRING_CONFIGS.snappy });
              return <circle key={i} cx={dotX} cy={Math.max(40, dotY)} r={5} fill={COLORS.emphasis} opacity={interpolate(dotE, [0, 1], [0, 0.5])} />;
            })}
            <text x={470} y={interpolate(floorProgress, [0, 1], [270, 130])} textAnchor="middle" fill={COLORS.possibility} fontSize="22" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600">
              More creators = more good work
            </text>
          </svg>
        </div>
      )}

      {/* ============= CURRENT MOMENT ============= */}
      {frame >= PHASE.NOW && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.NOW, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 40 }}>
            We're in that moment for <span style={{ color: COLORS.emphasis, fontWeight: 700 }}>animation</span>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
            {[
              { label: 'Tools exist', color: COLORS.build },
              { label: 'Quality is good', color: COLORS.refine },
              { label: 'Access expanding', color: COLORS.possibility },
            ].map((item, i) => {
              const checkE = spring({ frame: frame - PHASE.NOW - 30 - i * 15, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{ opacity: interpolate(checkE, [0, 1], [0, 1]), display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', backgroundColor: `${item.color}10`, border: `1px solid ${item.color}30`, borderRadius: 10 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <circle cx={14} cy={14} r={12} fill={`${item.color}20`} stroke={item.color} strokeWidth={2} />
                    <polyline points="8,14 12,18 20,10" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: item.color, fontWeight: 600 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene6D_ThePattern;
