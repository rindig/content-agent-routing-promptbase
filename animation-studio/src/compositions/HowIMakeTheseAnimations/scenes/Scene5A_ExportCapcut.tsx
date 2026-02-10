/**
 * Scene 5A: Export to CapCut
 * [7:15 - 7:35] — 600 frames
 *
 * "Once the scenes are built, I export from Remotion and bring everything into CapCut."
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { SECTION_HEADER: 0, EXPORT: 60, TRANSFER: 240, TIMELINE: 420 };

export const Scene5A_ExportCapcut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const headerFade = interpolate(frame, [PHASE.EXPORT, PHASE.EXPORT + 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const exportEntrance = spring({ frame: frame - PHASE.EXPORT, fps, config: SPRING_CONFIGS.gentle });
  const exportOpacity = frame >= PHASE.EXPORT ? interpolate(exportEntrance, [0, 1], [0, 1]) : 0;
  const exportFade = interpolate(frame, [PHASE.TRANSFER - 30, PHASE.TRANSFER], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const transferEntrance = spring({ frame: frame - PHASE.TRANSFER, fps, config: SPRING_CONFIGS.gentle });
  const transferOpacity = frame >= PHASE.TRANSFER ? interpolate(transferEntrance, [0, 1], [0, 1]) : 0;
  const transferFade = interpolate(frame, [PHASE.TIMELINE - 30, PHASE.TIMELINE], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const timelineEntrance = spring({ frame: frame - PHASE.TIMELINE, fps, config: SPRING_CONFIGS.gentle });
  const timelineOpacity = frame >= PHASE.TIMELINE ? interpolate(timelineEntrance, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Section header */}
      <div style={{ position: 'absolute', top: 120, left: 120, opacity: interpolate(headerEntrance, [0, 1], [0, 1]) * headerFade }}>
        <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text, letterSpacing: '0.05em' }}>
          STAGE THREE: <span style={{ color: COLORS.refine }}>FINISHING</span>
        </div>
        <svg width="260" height="4" style={{ marginTop: 8 }}>
          <line x1={0} y1={2} x2={260 * spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy })} y2={2} stroke={COLORS.refine} strokeWidth={3} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 60, right: 80, opacity: interpolate(spring({ frame: frame - 20, fps, config: SPRING_CONFIGS.snappy }), [0, 1], [0, 0.6]) * headerFade }}>
        <span style={{ fontSize: 48, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.refine, opacity: 0.4 }}>03</span>
      </div>

      {/* Export visualization */}
      {frame >= PHASE.EXPORT && frame < PHASE.TRANSFER + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: exportOpacity * exportFade, textAlign: 'center' }}>
          <div style={{ marginBottom: 24, fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            Export from <span style={{ color: COLORS.build }}>Remotion</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: 400, height: 12, backgroundColor: `${COLORS.textDim}30`, borderRadius: 6, overflow: 'hidden', margin: '0 auto' }}>
            <div style={{ width: `${interpolate(frame, [PHASE.EXPORT + 30, PHASE.EXPORT + 120], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`, height: '100%', backgroundColor: COLORS.refine, borderRadius: 6 }} />
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24 }}>
            {['.mov', '.mp4'].map((ext, i) => {
              const fileEntrance = spring({ frame: frame - PHASE.EXPORT - 100 - i * 20, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={ext} style={{ opacity: interpolate(fileEntrance, [0, 1], [0, 1]), padding: '10px 20px', backgroundColor: COLORS.surface, border: `1px solid ${COLORS.refine}40`, borderRadius: 8 }}>
                  <span style={{ fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.refine }}>{ext}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transfer to CapCut */}
      {frame >= PHASE.TRANSFER && frame < PHASE.TIMELINE + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: transferOpacity * transferFade, textAlign: 'center' }}>
          <svg width="600" height="120" viewBox="0 0 600 120">
            {/* Remotion icon */}
            <g transform="translate(80, 60)">
              <rect x="-50" y="-30" width="100" height="60" rx="8" fill={COLORS.surface} stroke={COLORS.build} strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill={COLORS.build} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>Remotion</text>
            </g>
            {/* Arrow with flowing dots */}
            <line x1="150" y1="60" x2="420" y2="60" stroke={COLORS.textDim} strokeWidth="2" strokeDasharray="8 4" opacity={0.4} />
            {Array.from({ length: 4 }).map((_, i) => {
              const px = 160 + ((frame - PHASE.TRANSFER + i * 25) % 100) / 100 * 260;
              return <circle key={i} cx={px} cy={60} r={4} fill={COLORS.refine} opacity={0.7} />;
            })}
            {/* CapCut icon */}
            <g transform="translate(500, 60)">
              <rect x="-50" y="-30" width="100" height="60" rx="8" fill={COLORS.surface} stroke={COLORS.refine} strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill={COLORS.refine} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>CapCut</text>
            </g>
          </svg>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text, marginTop: 16 }}>
            Animation becomes <span style={{ color: COLORS.refine, fontWeight: 600 }}>video</span>
          </div>
        </div>
      )}

      {/* Timeline hero */}
      {frame >= PHASE.TIMELINE && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: timelineOpacity }}>
          <svg width="700" height="200" viewBox="0 0 700 200">
            {/* Timeline tracks */}
            {[
              { y: 30, label: 'Animation', color: COLORS.build, segments: [[20, 200], [220, 380], [400, 600]] },
              { y: 80, label: 'Audio', color: COLORS.emphasis, segments: [[50, 350], [370, 580]] },
              { y: 130, label: 'B-Roll', color: COLORS.refine, segments: [[100, 250], [280, 400], [450, 550]] },
            ].map((track, ti) => {
              const trackEntrance = spring({ frame: frame - PHASE.TIMELINE - 15 - ti * 20, fps, config: SPRING_CONFIGS.snappy });
              return (
                <g key={ti} opacity={interpolate(trackEntrance, [0, 1], [0, 1])}>
                  <text x="0" y={track.y + 18} fill={track.color} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>{track.label}</text>
                  <line x1="85" y1={track.y + 20} x2="680" y2={track.y + 20} stroke={COLORS.textDim} strokeWidth="1" opacity={0.2} />
                  {track.segments.map((seg, si) => (
                    <rect key={si} x={85 + seg[0] * 0.9} y={track.y + 5} width={(seg[1] - seg[0]) * 0.9} height={28} rx={4} fill={`${track.color}30`} stroke={track.color} strokeWidth="1" />
                  ))}
                </g>
              );
            })}
            {/* Playhead */}
            <line x1={100 + ((frame - PHASE.TIMELINE) % 180) * 3} y1="15" x2={100 + ((frame - PHASE.TIMELINE) % 180) * 3} y2="170" stroke={COLORS.textBright} strokeWidth="1.5" opacity={0.6} />
          </svg>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene5A_ExportCapcut;
