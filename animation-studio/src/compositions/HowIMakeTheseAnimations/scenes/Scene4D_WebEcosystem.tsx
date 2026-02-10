/**
 * Scene 4D: Web Ecosystem Power
 * [5:40 - 5:55] — 450 frames
 *
 * "Anything that works in a web browser can become part of your animation."
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
  BROWSER_TO_ANIMATION: 0,
  TECH_PARADE: 120,
  ECOSYSTEM: 300,
  REFRAME: 390,
};

const TechBadge: React.FC<{ label: string; color: string; startFrame: number; icon: React.ReactNode }> = ({ label, color, startFrame, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  if (frame < startFrame) return null;
  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 100, height: 100, backgroundColor: COLORS.surface, border: `2px solid ${color}`,
        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 18, fontFamily: TYPOGRAPHY.code.fontFamily, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

export const Scene4D_WebEcosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const browserFade = interpolate(frame, [PHASE.TECH_PARADE - 20, PHASE.TECH_PARADE], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const techFade = interpolate(frame, [PHASE.ECOSYSTEM - 20, PHASE.ECOSYSTEM], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const reframeEntrance = spring({ frame: frame - PHASE.REFRAME, fps, config: SPRING_CONFIGS.gentle });
  const reframeOpacity = frame >= PHASE.REFRAME ? interpolate(reframeEntrance, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Browser → Animation */}
      {frame < PHASE.TECH_PARADE + 15 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', opacity: interpolate(browserEntrance, [0, 1], [0, 1]) * browserFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, lineHeight: 1.5 }}>
            Anything that works in a{' '}
            <span style={{ color: COLORS.build, fontWeight: 600 }}>web browser</span>
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, lineHeight: 1.5, marginTop: 8 }}>
            can become{' '}
            <span style={{ color: COLORS.refine, fontWeight: 600 }}>animation</span>
          </div>
        </div>
      )}

      {/* Tech parade */}
      {frame >= PHASE.TECH_PARADE && (
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', opacity: techFade }}>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
            <TechBadge label="CSS" color="#38BDF8" startFrame={PHASE.TECH_PARADE} icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="6" width="24" height="28" rx="2" stroke="#38BDF8" strokeWidth="2" />
                <rect x="12" y="12" width="16" height="4" rx="1" fill="#38BDF8" opacity={0.5} />
                <rect x="12" y="20" width="10" height="4" rx="1" fill="#38BDF8" opacity={0.3} />
              </svg>
            } />
            <TechBadge label="SVG" color="#A78BFA" startFrame={PHASE.TECH_PARADE + 25} icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <polygon points="20,6 34,30 6,30" stroke="#A78BFA" strokeWidth="2" fill="none" />
                <circle cx="20" cy="22" r="6" stroke="#A78BFA" strokeWidth="2" fill="none" />
              </svg>
            } />
            <TechBadge label="Canvas" color="#F59E0B" startFrame={PHASE.TECH_PARADE + 50} icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect key={i} x={8 + (i % 4) * 7} y={8 + Math.floor(i / 4) * 7} width="5" height="5" fill="#F59E0B" opacity={0.2 + Math.random() * 0.5} rx="1" />
                ))}
              </svg>
            } />
            <TechBadge label="JS Libs" color="#10B981" startFrame={PHASE.TECH_PARADE + 75} icon={
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="10" width="12" height="12" rx="2" stroke="#10B981" strokeWidth="2" fill="none" />
                <rect x="22" y="10" width="12" height="12" rx="2" stroke="#10B981" strokeWidth="2" fill="none" />
                <rect x="14" y="22" width="12" height="12" rx="2" stroke="#10B981" strokeWidth="2" fill="none" />
              </svg>
            } />
          </div>
        </div>
      )}

      {/* Ecosystem visualization - all connect to Remotion */}
      {frame >= PHASE.ECOSYSTEM && (
        <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.ECOSYSTEM, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            The <span style={{ color: COLORS.build, fontWeight: 600 }}>entire ecosystem</span> at your disposal
          </div>
        </div>
      )}

      {/* Reframe: not new tool, existing tools for new purpose */}
      {frame >= PHASE.REFRAME && (
        <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', opacity: reframeOpacity, textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div>
              <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.6 }}>
                Learning new tool from scratch
              </div>
            </div>
            <div style={{ fontSize: 24, color: COLORS.textDim }}>→</div>
            <div>
              <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.refine, fontWeight: 600 }}>
                Existing tools, new purpose
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4D_WebEcosystem;
