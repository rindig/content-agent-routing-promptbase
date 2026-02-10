/**
 * Scene 9A: What Changed
 * [12:30 - 12:50] — 600 frames
 *
 * Before: years of AE, money to hire. Now: a process, free tools,
 * a way of thinking. Barriers -> doors.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { BEFORE: 0, NOW: 180, BRIDGE: 360, TRANSITION: 540 };

export const Scene9A_WhatChanged: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 100) / 100) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.possibility}12, transparent)`, pointerEvents: 'none' }} />

      {/* ============= BEFORE ============= */}
      {frame < PHASE.NOW + 20 && (
        <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.NOW), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 40 }}>
            Used to require:
          </div>
          <div style={{ display: 'flex', gap: 60, justifyContent: 'center' }}>
            {[
              { label: 'Years of After Effects', sub: 'Skill barrier', color: COLORS.time },
              { label: 'Money to hire', sub: 'Financial barrier', color: COLORS.time },
            ].map((item, i) => {
              const e = spring({ frame: frame - 30 - i * 25, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{
                  opacity: interpolate(e, [0, 1], [0, 1]),
                  padding: '28px 36px', backgroundColor: `${item.color}08`,
                  border: `2px solid ${item.color}25`, borderRadius: 14, textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Wall icon */}
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom: 16 }}>
                    <rect x={10} y={10} width={80} height={80} fill={`${item.color}10`} stroke={item.color} strokeWidth={2.5} rx={4} />
                    {/* Brick pattern */}
                    <line x1={10} y1={35} x2={90} y2={35} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                    <line x1={10} y1={60} x2={90} y2={60} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                    <line x1={50} y1={10} x2={50} y2={35} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                    <line x1={30} y1={35} x2={30} y2={60} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                    <line x1={70} y1={35} x2={70} y2={60} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                    <line x1={50} y1={60} x2={50} y2={90} stroke={item.color} strokeWidth={1.5} opacity={0.25} />
                  </svg>
                  <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted, marginTop: 8 }}>{item.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============= NOW ============= */}
      {frame >= PHASE.NOW && frame < PHASE.BRIDGE + 20 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.NOW, PHASE.BRIDGE), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 40 }}>
            Now requires:
          </div>
          {[
            { label: 'A process', sub: 'Learnable', color: COLORS.possibility },
            { label: 'Freely available tools', sub: 'Accessible', color: COLORS.build },
            { label: 'A way of thinking', sub: 'Transferable', color: COLORS.refine },
          ].map((item, i) => {
            const e = spring({ frame: frame - PHASE.NOW - 15 - i * 20, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{
                opacity: interpolate(e, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(e, [0, 1], [40, 0])}px)`,
                display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
              }}>
                {/* Door icon */}
                <svg width="48" height="60" viewBox="0 0 48 60">
                  <rect x={4} y={4} width={40} height={52} rx={4} fill={`${item.color}15`} stroke={item.color} strokeWidth={2} />
                  <circle cx={34} cy={30} r={3} fill={item.color} />
                </svg>
                <div>
                  <span style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: item.color }}>{item.label}</span>
                  <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginLeft: 16 }}>-- {item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============= BRIDGE ============= */}
      {frame >= PHASE.BRIDGE && frame < PHASE.TRANSITION + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.BRIDGE, PHASE.TRANSITION), textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 30 }}>
            {['Specs', 'Constraints', 'Separation of Concerns'].map((item, i) => {
              const e = spring({ frame: frame - PHASE.BRIDGE - 10 - i * 12, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{
                  opacity: interpolate(e, [0, 1], [0, 1]),
                  padding: '12px 24px', backgroundColor: COLORS.surface,
                  border: `2px solid ${COLORS.emphasis}30`, borderRadius: 10,
                }}>
                  <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.emphasis, fontWeight: 600 }}>{item}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            From <span style={{ color: COLORS.build, fontWeight: 600 }}>software engineering</span>
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 12 }}>
            Applies to <span style={{ color: COLORS.refine, fontWeight: 600 }}>creative work</span>
          </div>
        </div>
      )}

      {/* ============= TRANSITION ============= */}
      {frame >= PHASE.TRANSITION && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: spring({ frame: frame - PHASE.TRANSITION, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center',
        }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Skills <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>transfer</span>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene9A_WhatChanged;
