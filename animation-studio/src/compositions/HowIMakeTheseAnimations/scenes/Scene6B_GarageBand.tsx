/**
 * Scene 6B: GarageBand Example
 * [9:15 - 9:45] — 900 frames
 *
 * GarageBand democratized music. Steve Lacy + $20 iRig → Kendrick Lamar tracks.
 * Video placeholder included.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { INTRO: 0, COST: 180, STEVE_LACY: 360, SMITHSONIAN: 540, PATTERN: 720 };

export const Scene6B_GarageBand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0) * (frame < next + 15 ? exit : 0);
  };

  // CountUp for cost
  const costProgress = interpolate(frame, [PHASE.COST + 30, PHASE.COST + 90], [100000, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Intro: 2004, GarageBand */}
      {frame < PHASE.COST + 15 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: fade(0, PHASE.COST), textAlign: 'center' }}>
          <div style={{ padding: '8px 20px', backgroundColor: `${COLORS.emphasis}20`, border: `1px solid ${COLORS.emphasis}40`, borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
            <span style={{ fontSize: 24, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.emphasis }}>2004</span>
          </div>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>GarageBand</div>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' }}>
            "Democratize music making"
          </div>
        </div>
      )}

      {/* Cost comparison */}
      {frame >= PHASE.COST && frame < PHASE.STEVE_LACY + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: fade(PHASE.COST, PHASE.STEVE_LACY), textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.time }}>
                ${Math.floor(costProgress).toLocaleString()}
              </div>
              <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim, marginTop: 8 }}>Professional studio</div>
            </div>
            <div style={{ fontSize: 36, color: COLORS.textDim }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.possibility }}>
                Mac + GarageBand
              </div>
              <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim, marginTop: 8 }}>Accessible to everyone</div>
            </div>
          </div>
        </div>
      )}

      {/* Steve Lacy story */}
      {frame >= PHASE.STEVE_LACY && frame < PHASE.SMITHSONIAN + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: fade(PHASE.STEVE_LACY, PHASE.SMITHSONIAN), textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 20 }}>Steve Lacy</div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '12px 20px', backgroundColor: COLORS.surface, border: `1px solid ${COLORS.textDim}40`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted }}>Cracked iPhone</div>
              <div style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>+ GarageBand</div>
            </div>
            <div style={{ fontSize: 18, color: COLORS.textDim }}>+</div>
            <div style={{ padding: '12px 20px', backgroundColor: COLORS.surface, border: `1px solid ${COLORS.emphasis}40`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.emphasis }}>$20</div>
              <div style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>iRig</div>
            </div>
          </div>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text, marginTop: 24 }}>
            Made tracks for <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>Kendrick Lamar</span>
          </div>
        </div>
      )}

      {/* Smithsonian */}
      {frame >= PHASE.SMITHSONIAN && frame < PHASE.PATTERN + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: fade(PHASE.SMITHSONIAN, PHASE.PATTERN), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            That phone is now in the
          </div>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.emphasis, marginTop: 12, textShadow: `0 0 ${Math.sin(frame * 0.08) * 4 + 8}px ${COLORS.emphasis}40` }}>
            Smithsonian
          </div>
        </div>
      )}

      {/* Pattern connection */}
      {frame >= PHASE.PATTERN && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.PATTERN, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            Tools <span style={{ color: COLORS.emphasis }}>enabling</span> creators
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene6B_GarageBand;
