/**
 * Scene 5B: What Happens in Edit
 * [7:35 - 8:00] — 750 frames
 *
 * "Voiceover sync, timing adjustments, music."
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { EDIT_TASKS: 0, EASIER_BY_HAND: 180, SCRUBBING: 360, WHY_MATTERS: 540 };

export const Scene5B_EditWork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tasks = [
    { icon: '~', label: 'Voiceover sync', desc: 'Align audio waveform to visuals', color: COLORS.emphasis },
    { icon: '↔', label: 'Timing adjustments', desc: 'Nudge clips frame by frame', color: COLORS.build },
    { icon: '♪', label: 'Music', desc: 'Audio track with beats', color: COLORS.spec },
  ];

  const handEntrance = spring({ frame: frame - PHASE.EASIER_BY_HAND, fps, config: SPRING_CONFIGS.gentle });
  const handOpacity = frame >= PHASE.EASIER_BY_HAND ? interpolate(handEntrance, [0, 1], [0, 1]) : 0;
  const handFade = interpolate(frame, [PHASE.SCRUBBING - 30, PHASE.SCRUBBING], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const scrubEntrance = spring({ frame: frame - PHASE.SCRUBBING, fps, config: SPRING_CONFIGS.gentle });
  const scrubOpacity = frame >= PHASE.SCRUBBING ? interpolate(scrubEntrance, [0, 1], [0, 1]) : 0;
  const scrubFade = interpolate(frame, [PHASE.WHY_MATTERS - 30, PHASE.WHY_MATTERS], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const whyEntrance = spring({ frame: frame - PHASE.WHY_MATTERS, fps, config: SPRING_CONFIGS.gentle });
  const whyOpacity = frame >= PHASE.WHY_MATTERS ? interpolate(whyEntrance, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Edit tasks */}
      {frame < PHASE.EASIER_BY_HAND + 15 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {tasks.map((task, i) => {
            const entrance = spring({ frame: frame - 20 - i * 30, fps, config: SPRING_CONFIGS.snappy });
            const opacity = interpolate(entrance, [0, 1], [0, 1]);
            const x = interpolate(entrance, [0, 1], [40, 0]);
            return (
              <div key={i} style={{ opacity, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.surface, border: `2px solid ${task.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: task.color, fontFamily: TYPOGRAPHY.code.fontFamily }}>
                  {task.icon}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>{task.label}</div>
                  <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>{task.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Easier by hand */}
      {frame >= PHASE.EASIER_BY_HAND && frame < PHASE.SCRUBBING + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: handOpacity * handFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Some things are just{' '}
            <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>easier by hand</span>
          </div>
          <svg width="200" height="60" viewBox="0 0 200 60" style={{ marginTop: 24 }}>
            {/* Hand cursor dragging */}
            <rect x="40" y="20" width="120" height="20" rx="4" fill={`${COLORS.build}30`} stroke={COLORS.build} strokeWidth="1.5" />
            <circle cx={70 + Math.sin(frame * 0.05) * 30} cy="30" r="8" fill={COLORS.emphasis} opacity={0.8} />
          </svg>
        </div>
      )}

      {/* Scrubbing example */}
      {frame >= PHASE.SCRUBBING && frame < PHASE.WHY_MATTERS + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: scrubOpacity * scrubFade }}>
          <svg width="600" height="120" viewBox="0 0 600 120">
            {/* Waveform */}
            {Array.from({ length: 60 }).map((_, i) => {
              const h = 10 + Math.abs(Math.sin(i * 0.4)) * 40;
              return <rect key={i} x={10 + i * 9.5} y={60 - h / 2} width={6} height={h} rx={2} fill={COLORS.emphasis} opacity={0.3 + Math.abs(Math.sin(i * 0.4)) * 0.4} />;
            })}
            {/* Playhead */}
            <line x1={200 + Math.sin(frame * 0.03) * 100} y1="10" x2={200 + Math.sin(frame * 0.03) * 100} y2="110" stroke={COLORS.textBright} strokeWidth="2" opacity={0.7} />
            {/* Visual frame indicator */}
            <rect x={200 + Math.sin(frame * 0.03) * 100 - 25} y="0" width="50" height="20" rx="4" fill={COLORS.build} opacity={0.8} />
            <text x={200 + Math.sin(frame * 0.03) * 100} y="14" textAnchor="middle" fill="white" fontSize="10" fontFamily={TYPOGRAPHY.code.fontFamily}>frame</text>
          </svg>
          <div style={{ fontSize: 18, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, textAlign: 'center', marginTop: 16 }}>
            Finding the exact frame where the word <span style={{ color: COLORS.emphasis }}>lands</span>
          </div>
        </div>
      )}

      {/* Why this matters */}
      {frame >= PHASE.WHY_MATTERS && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: whyOpacity, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Some things need <span style={{ color: COLORS.refine, fontWeight: 600 }}>human feel</span>
          </div>
          <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 12 }}>
            Precision that's hard to describe in a spec
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene5B_EditWork;
