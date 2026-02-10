/**
 * Scene 4F: Component Library Importance
 * [6:35 - 7:00] — 750 frames
 *
 * "The component library matters. I'm not building every animation from scratch."
 * LEGO-style assembly + video placeholder
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = {
  LIBRARY_GRID: 0,
  HIGHLIGHT: 120,
  ASSEMBLY: 300,
  COMPOSING: 510,
  VIDEO_PLACEHOLDER: 600,
};

const ComponentBlock: React.FC<{
  name: string; preview: React.ReactNode; color: string;
  startFrame: number; x: number; y: number;
}> = ({ name, preview, color, startFrame, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  if (frame < startFrame) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, transform: `scale(${scale})` }}>
      <div style={{
        width: 130, height: 90, backgroundColor: COLORS.surface, border: `2px solid ${color}`,
        borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        {preview}
        <span style={{ fontSize: 12, fontFamily: TYPOGRAPHY.code.fontFamily, color, fontWeight: 600 }}>{name}</span>
      </div>
    </div>
  );
};

export const Scene4F_ComponentLibrary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleFade = interpolate(frame, [PHASE.ASSEMBLY - 30, PHASE.ASSEMBLY], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Assembly animation
  const assemblyEntrance = spring({ frame: frame - PHASE.ASSEMBLY, fps, config: SPRING_CONFIGS.gentle });
  const assemblyOpacity = frame >= PHASE.ASSEMBLY ? interpolate(assemblyEntrance, [0, 1], [0, 1]) : 0;
  const assemblyFade = interpolate(frame, [PHASE.COMPOSING - 30, PHASE.COMPOSING], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Composing vs inventing
  const composeEntrance = spring({ frame: frame - PHASE.COMPOSING, fps, config: SPRING_CONFIGS.gentle });
  const composeOpacity = frame >= PHASE.COMPOSING ? interpolate(composeEntrance, [0, 1], [0, 1]) : 0;
  const composeFade = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 20, PHASE.VIDEO_PLACEHOLDER], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Video placeholder
  const placeholderEntrance = spring({ frame: frame - PHASE.VIDEO_PLACEHOLDER, fps, config: SPRING_CONFIGS.gentle });
  const placeholderOpacity = frame >= PHASE.VIDEO_PLACEHOLDER ? interpolate(placeholderEntrance, [0, 1], [0, 1]) : 0;
  const scanPos = ((frame % 120) / 120) * 100;
  const bracketPulse = Math.sin(frame * 0.06) * 0.15 + 0.5;

  // Animated mini-previews
  const glitchOffset = Math.floor(frame / 3) % 2 === 0 ? 2 : -2;
  const countValue = Math.floor(interpolate(frame % 60, [0, 59], [0, 999], { extrapolateRight: 'clamp' }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title */}
      {frame < PHASE.ASSEMBLY + 15 && (
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', opacity: titleOpacity * titleFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            The <span style={{ color: COLORS.build, fontWeight: 600 }}>component library</span> matters
          </div>
        </div>
      )}

      {/* Component grid */}
      {frame < PHASE.ASSEMBLY + 15 && (
        <div style={{ opacity: titleFade }}>
          <ComponentBlock name="AnimText" color={COLORS.build} startFrame={20} x={300} y={200}
            preview={<div style={{ fontSize: 16, color: COLORS.build, fontFamily: TYPOGRAPHY.display.fontFamily }}>Aa</div>} />
          <ComponentBlock name="GlitchText" color={COLORS.time} startFrame={35} x={460} y={200}
            preview={<div style={{ fontSize: 16, color: COLORS.time, fontFamily: TYPOGRAPHY.code.fontFamily, transform: `translateX(${glitchOffset}px)` }}>Gl!tch</div>} />
          <ComponentBlock name="CountUp" color={COLORS.refine} startFrame={50} x={620} y={200}
            preview={<div style={{ fontSize: 16, color: COLORS.refine, fontFamily: TYPOGRAPHY.code.fontFamily }}>{countValue}</div>} />
          <ComponentBlock name="SceneBox" color={COLORS.spec} startFrame={65} x={300} y={320}
            preview={<div style={{ width: 50, height: 30, border: `1px solid ${COLORS.spec}`, borderRadius: 4, backgroundColor: `${COLORS.spec}10` }} />} />
          <ComponentBlock name="Particles" color={COLORS.emphasis} startFrame={80} x={460} y={320}
            preview={
              <svg width="50" height="20" viewBox="0 0 50 20">
                {[0, 1, 2, 3, 4].map(i => (
                  <circle key={i} cx={8 + i * 10} cy={10 + Math.sin(frame * 0.1 + i) * 4} r={2} fill={COLORS.emphasis} opacity={0.6} />
                ))}
              </svg>
            } />
          <ComponentBlock name="BlurText" color={COLORS.build} startFrame={95} x={620} y={320}
            preview={<div style={{ fontSize: 16, color: COLORS.build, fontFamily: TYPOGRAPHY.display.fontFamily, filter: 'blur(2px)' }}>Blur</div>} />
        </div>
      )}

      {/* Assembly animation - components snapping together */}
      {frame >= PHASE.ASSEMBLY && frame < PHASE.COMPOSING + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: assemblyOpacity * assemblyFade }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, textAlign: 'center', marginBottom: 32 }}>
            Claude <span style={{ color: COLORS.build }}>assembles</span> these pieces
          </div>
          <svg width="500" height="250" viewBox="0 0 500 250">
            {/* Base container */}
            <rect x="100" y="30" width="300" height="190" rx="12" fill={COLORS.surface} stroke={COLORS.build} strokeWidth="2" opacity={spring({ frame: frame - PHASE.ASSEMBLY - 10, fps, config: SPRING_CONFIGS.snappy })} />
            {/* Text component slots in */}
            <rect x="120" y="50" width="260" height="40" rx="6" fill={`${COLORS.build}15`} stroke={COLORS.build} strokeWidth="1.5" opacity={spring({ frame: frame - PHASE.ASSEMBLY - 40, fps, config: SPRING_CONFIGS.snappy })} />
            <text x="250" y="75" textAnchor="middle" fill={COLORS.build} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily} opacity={spring({ frame: frame - PHASE.ASSEMBLY - 50, fps, config: SPRING_CONFIGS.snappy })}>AnimText</text>
            {/* Effect layer */}
            <rect x="120" y="100" width="120" height="40" rx="6" fill={`${COLORS.time}15`} stroke={COLORS.time} strokeWidth="1.5" opacity={spring({ frame: frame - PHASE.ASSEMBLY - 70, fps, config: SPRING_CONFIGS.snappy })} />
            <text x="180" y="125" textAnchor="middle" fill={COLORS.time} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily} opacity={spring({ frame: frame - PHASE.ASSEMBLY - 80, fps, config: SPRING_CONFIGS.snappy })}>GlitchText</text>
            {/* Counter */}
            <rect x="260" y="100" width="120" height="40" rx="6" fill={`${COLORS.refine}15`} stroke={COLORS.refine} strokeWidth="1.5" opacity={spring({ frame: frame - PHASE.ASSEMBLY - 100, fps, config: SPRING_CONFIGS.snappy })} />
            <text x="320" y="125" textAnchor="middle" fill={COLORS.refine} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily} opacity={spring({ frame: frame - PHASE.ASSEMBLY - 110, fps, config: SPRING_CONFIGS.snappy })}>CountUp</text>
            {/* Particles */}
            <rect x="120" y="150" width="260" height="50" rx="6" fill={`${COLORS.emphasis}10`} stroke={COLORS.emphasis} strokeWidth="1" strokeDasharray="4 2" opacity={spring({ frame: frame - PHASE.ASSEMBLY - 130, fps, config: SPRING_CONFIGS.snappy })} />
            <text x="250" y="180" textAnchor="middle" fill={COLORS.emphasis} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily} opacity={spring({ frame: frame - PHASE.ASSEMBLY - 140, fps, config: SPRING_CONFIGS.snappy })}>Particles Layer</text>
          </svg>
        </div>
      )}

      {/* Composing, not inventing */}
      {frame >= PHASE.COMPOSING && frame < PHASE.VIDEO_PLACEHOLDER + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: composeOpacity * composeFade, textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.6 }}>Inventing everything new</div>
            </div>
            <div style={{ fontSize: 24, color: COLORS.textDim }}>→</div>
            <div>
              <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.refine, fontWeight: 600 }}>Composing elements that work together</div>
            </div>
          </div>
        </div>
      )}

      {/* Video placeholder */}
      {frame >= PHASE.VIDEO_PLACEHOLDER && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: placeholderOpacity, width: 750, height: 420, backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.build}40`, borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderTop: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderTop: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 20, height: 20, borderBottom: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderBottom: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', top: 24, left: 28, fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>
            INSERT: Component registry overview
          </div>
          <div style={{ position: 'absolute', bottom: 24, right: 28, padding: '6px 14px', backgroundColor: `${COLORS.build}20`, borderRadius: 6, border: `1px solid ${COLORS.build}40`, fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build }}>~10 sec</div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke={COLORS.textDim} strokeWidth="2" opacity={0.3} /><polygon points="23,17 23,39 41,28" fill={COLORS.textDim} opacity={0.3} /></svg>
          </div>
          <div style={{ position: 'absolute', top: `${scanPos}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.build}30, transparent)` }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4F_ComponentLibrary;
