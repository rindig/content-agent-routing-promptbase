/**
 * Scene 5D: Time Clarification
 * [8:30 - 9:00] — 900 frames
 *
 * "When I say under an hour, I mean the animation."
 * The real question: where do you want your creative energy?
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { SCOPE: 0, TIME_VIS: 150, CONTROL_POINTS: 300, REAL_QUESTION: 450, ANSWER: 600, TRANSITION: 750 };

export const Scene5D_TimeClarification: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { opacity: (frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0) * (frame < next + 15 ? exit : 0) };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scope clarification */}
      {frame < PHASE.TIME_VIS + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', ...fade(0, PHASE.TIME_VIS), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility }}>
            {'< 1 HOUR'}
          </div>
          <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 16 }}>
            = the <span style={{ color: COLORS.build, fontWeight: 600 }}>animation</span>
          </div>
          <div style={{ fontSize: 18, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim, marginTop: 8 }}>
            The part that would have taken a week
          </div>
        </div>
      )}

      {/* Time visualization */}
      {frame >= PHASE.TIME_VIS && frame < PHASE.CONTROL_POINTS + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', ...fade(PHASE.TIME_VIS, PHASE.CONTROL_POINTS) }}>
          <svg width="600" height="160" viewBox="0 0 600 160">
            {/* Animation bar */}
            <rect x="50" y="30" width="200" height="40" rx="6" fill={`${COLORS.build}30`} stroke={COLORS.build} strokeWidth="2" />
            <text x="150" y="55" textAnchor="middle" fill={COLORS.build} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>Animation: {'<'}1 hour</text>
            <text x="150" y="20" textAnchor="middle" fill={COLORS.textDim} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>was: 1 week</text>
            {/* Refinement bar */}
            <rect x="260" y="30" width="280" height="40" rx="6" fill={`${COLORS.refine}20`} stroke={COLORS.refine} strokeWidth="2" strokeDasharray="6 3" />
            <text x="400" y="55" textAnchor="middle" fill={COLORS.refine} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>Refinement: still takes time</text>
            {/* Labels */}
            <text x="300" y="110" textAnchor="middle" fill={COLORS.textMuted} fontSize="16" fontFamily={TYPOGRAPHY.body.fontFamily}>Significant savings, not zero effort</text>
          </svg>
        </div>
      )}

      {/* Parts I want to control */}
      {frame >= PHASE.CONTROL_POINTS && frame < PHASE.REAL_QUESTION + 15 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', ...fade(PHASE.CONTROL_POINTS, PHASE.REAL_QUESTION) }}>
          <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 28, textAlign: 'center' }}>
            Parts I <span style={{ color: COLORS.refine }}>actually want</span> to control
          </div>
          {[
            { label: 'The pacing', color: COLORS.build },
            { label: 'Real images needed', color: COLORS.emphasis },
            { label: 'Voice + visual sync', color: COLORS.spec },
          ].map((item, i) => {
            const e = spring({ frame: frame - PHASE.CONTROL_POINTS - 20 - i * 25, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{ opacity: interpolate(e, [0, 1], [0, 1]), transform: `translateX(${interpolate(e, [0, 1], [20, 0])}px)`, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>{item.label}</span>
                <span style={{ fontSize: 16, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim }}>— creative choice, not grunt work</span>
              </div>
            );
          })}
        </div>
      )}

      {/* The real question */}
      {frame >= PHASE.REAL_QUESTION && frame < PHASE.ANSWER + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', ...fade(PHASE.REAL_QUESTION, PHASE.ANSWER), textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.5, marginBottom: 20 }}>
            "Can AI make videos?"
          </div>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>
            Where do you want your{' '}
            <span style={{ color: COLORS.emphasis }}>creative energy</span>?
          </div>
        </div>
      )}

      {/* The answer */}
      {frame >= PHASE.ANSWER && frame < PHASE.TRANSITION + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', ...fade(PHASE.ANSWER, PHASE.TRANSITION), textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 24 }}>
            Not on animating from scratch
          </div>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 200, height: 120, border: `2px dashed ${COLORS.textDim}30`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>blank timeline</span>
              </div>
              <div style={{ fontSize: 14, color: COLORS.textDim, marginTop: 8 }}>start from nothing</div>
            </div>
            <div style={{ fontSize: 28, color: COLORS.textMuted }}>vs</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 200, height: 120, backgroundColor: COLORS.surface, border: `2px solid ${COLORS.refine}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {[0.7, 0.5, 0.8, 0.4].map((w, i) => (
                  <div key={i} style={{ width: `${w * 80}%`, height: 6, backgroundColor: `${COLORS.refine}60`, borderRadius: 3 }} />
                ))}
              </div>
              <div style={{ fontSize: 14, color: COLORS.refine, marginTop: 8, fontWeight: 600 }}>react and shape</div>
            </div>
          </div>
        </div>
      )}

      {/* Green stage complete transition */}
      {frame >= PHASE.TRANSITION && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.TRANSITION, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.refine }}>
            Something real to <span style={{ fontWeight: 700 }}>react to</span> and <span style={{ fontWeight: 700 }}>shape</span>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene5D_TimeClarification;
