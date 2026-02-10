/**
 * Scene 5C: Honesty Moment
 * [8:00 - 8:30] — 900 frames
 *
 * "I want to be honest about something. The animation is not the finished video."
 * + video placeholder for editing footage
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { HONESTY: 0, STARTING_POINT: 120, REAL_WORK: 300, FOUNDATION: 540, VIDEO_PLACEHOLDER: 750 };

export const Scene5C_HonestyMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const honestyEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const honestyFade = interpolate(frame, [PHASE.STARTING_POINT - 30, PHASE.STARTING_POINT], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const startEntrance = spring({ frame: frame - PHASE.STARTING_POINT, fps, config: SPRING_CONFIGS.gentle });
  const startOpacity = frame >= PHASE.STARTING_POINT ? interpolate(startEntrance, [0, 1], [0, 1]) : 0;
  const startFade = interpolate(frame, [PHASE.REAL_WORK - 30, PHASE.REAL_WORK], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const workEntrance = spring({ frame: frame - PHASE.REAL_WORK, fps, config: SPRING_CONFIGS.gentle });
  const workOpacity = frame >= PHASE.REAL_WORK ? interpolate(workEntrance, [0, 1], [0, 1]) : 0;
  const workFade = interpolate(frame, [PHASE.FOUNDATION - 30, PHASE.FOUNDATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const foundEntrance = spring({ frame: frame - PHASE.FOUNDATION, fps, config: SPRING_CONFIGS.gentle });
  const foundOpacity = frame >= PHASE.FOUNDATION ? interpolate(foundEntrance, [0, 1], [0, 1]) : 0;
  const foundFade = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 20, PHASE.VIDEO_PLACEHOLDER], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const placeholderEntrance = spring({ frame: frame - PHASE.VIDEO_PLACEHOLDER, fps, config: SPRING_CONFIGS.gentle });
  const placeholderOpacity = frame >= PHASE.VIDEO_PLACEHOLDER ? interpolate(placeholderEntrance, [0, 1], [0, 1]) : 0;
  const scanPos = ((frame % 120) / 120) * 100;
  const bracketPulse = Math.sin(frame * 0.06) * 0.15 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* "I want to be honest" */}
      {frame < PHASE.STARTING_POINT + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: interpolate(honestyEntrance, [0, 1], [0, 1]) * honestyFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            I want to be <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>honest</span>
          </div>
        </div>
      )}

      {/* Starting point, not finished */}
      {frame >= PHASE.STARTING_POINT && frame < PHASE.REAL_WORK + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: startOpacity * startFade, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 24 }}>
            Animation = substantial <span style={{ color: COLORS.build }}>foundation</span>
          </div>
          <div style={{ fontSize: 28, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            But NOT = <span style={{ color: COLORS.time, textDecoration: 'line-through' }}>finished video</span>
          </div>
        </div>
      )}

      {/* Real work list */}
      {frame >= PHASE.REAL_WORK && frame < PHASE.FOUNDATION + 15 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', opacity: workOpacity * workFade }}>
          <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 28, textAlign: 'center' }}>
            I still spend <span style={{ color: COLORS.emphasis }}>real time</span> here
          </div>
          {[
            { icon: '✂', label: 'Cutting sections that don\'t work', color: COLORS.time },
            { icon: '●', label: 'Re-recording lines', color: COLORS.emphasis },
            { icon: '▣', label: 'Adding photos, screenshots, footage', color: COLORS.refine },
          ].map((item, i) => {
            const itemEntrance = spring({ frame: frame - PHASE.REAL_WORK - 30 - i * 30, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{ opacity: interpolate(itemEntrance, [0, 1], [0, 1]), transform: `translateX(${interpolate(itemEntrance, [0, 1], [30, 0])}px)`, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.surface, border: `2px solid ${item.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: item.color }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Foundation metaphor */}
      {frame >= PHASE.FOUNDATION && frame < PHASE.VIDEO_PLACEHOLDER + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: foundOpacity * foundFade, textAlign: 'center' }}>
          <svg width="500" height="200" viewBox="0 0 500 200">
            {/* Foundation layer */}
            <rect x="50" y="120" width="400" height="60" rx="8" fill={`${COLORS.build}25`} stroke={COLORS.build} strokeWidth="2" />
            <text x="250" y="155" textAnchor="middle" fill={COLORS.build} fontSize="18" fontFamily={TYPOGRAPHY.code.fontFamily}>Animation Foundation</text>
            {/* Building layer */}
            <rect x="80" y="40" width="340" height="70" rx="8" fill={`${COLORS.refine}15`} stroke={COLORS.refine} strokeWidth="2" strokeDasharray="6 3" />
            <text x="250" y="80" textAnchor="middle" fill={COLORS.refine} fontSize="18" fontFamily={TYPOGRAPHY.code.fontFamily}>Refinement</text>
          </svg>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text, marginTop: 16 }}>
            Foundation + Refinement = <span style={{ color: COLORS.refine, fontWeight: 600 }}>Finished Video</span>
          </div>
        </div>
      )}

      {/* Video placeholder */}
      {frame >= PHASE.VIDEO_PLACEHOLDER && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: placeholderOpacity, width: 780, height: 440, backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.refine}40`, borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderTop: `3px solid ${COLORS.refine}`, borderLeft: `3px solid ${COLORS.refine}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderTop: `3px solid ${COLORS.refine}`, borderRight: `3px solid ${COLORS.refine}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 20, height: 20, borderBottom: `3px solid ${COLORS.refine}`, borderLeft: `3px solid ${COLORS.refine}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderBottom: `3px solid ${COLORS.refine}`, borderRight: `3px solid ${COLORS.refine}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', top: 24, left: 28, fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>INSERT: Cutting, editing, adding footage in CapCut</div>
          <div style={{ position: 'absolute', bottom: 24, right: 28, padding: '6px 14px', backgroundColor: `${COLORS.refine}20`, borderRadius: 6, border: `1px solid ${COLORS.refine}40`, fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.refine }}>~15 sec</div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke={COLORS.textDim} strokeWidth="2" opacity={0.3} /><polygon points="23,17 23,39 41,28" fill={COLORS.textDim} opacity={0.3} /></svg>
          </div>
          <div style={{ position: 'absolute', top: `${scanPos}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.refine}30, transparent)` }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene5C_HonestyMoment;
