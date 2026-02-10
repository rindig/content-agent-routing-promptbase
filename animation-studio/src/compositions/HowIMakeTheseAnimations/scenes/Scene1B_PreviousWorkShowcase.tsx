/**
 * Scene 1B: Previous Work Showcase
 * [0:08 - 0:18] — 300 frames
 *
 * Visual: Multi-video showcase frame with actual mini animations
 * Three-panel layout showing impressive animated content
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

// Timeline markers
const PHASE = {
  BADGE_TRANSITION: 0,
  CLIPS_STAGGER_START: 30,
  CLIPS_SETTLED: 90,
  HOLD: 90,
  FADE_OUT_START: 270,
};

// ============================================================
// MINI ANIMATION 1: Agent Loop (circular flow)
// ============================================================
const MiniAgentLoop: React.FC = () => {
  const frame = useCurrentFrame();

  const nodes = [
    { angle: -90, label: 'P', color: COLORS.spec },
    { angle: -18, label: 'M', color: COLORS.build },
    { angle: 54, label: 'R', color: COLORS.refine },
    { angle: 126, label: 'E', color: COLORS.emphasis },
    { angle: 198, label: 'N', color: COLORS.spec },
  ];

  const radius = 65;
  const centerX = 210;
  const centerY = 115;

  // Flowing packet position
  const packetAngle = ((frame * 3) % 360) - 90;
  const packetRad = (packetAngle * Math.PI) / 180;
  const packetX = centerX + Math.cos(packetRad) * radius;
  const packetY = centerY + Math.sin(packetRad) * radius;

  return (
    <svg width="420" height="230" viewBox="0 0 420 230">
      {/* Circular path */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={COLORS.textDim}
        strokeWidth="2"
        strokeDasharray="8 4"
        opacity={0.4}
      />

      {/* Nodes */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = centerX + Math.cos(rad) * radius;
        const y = centerY + Math.sin(rad) * radius;
        const pulse = Math.sin(frame * 0.1 + i) * 0.2 + 0.8;

        return (
          <g key={i}>
            <circle cx={x} cy={y} r={16} fill={node.color} opacity={pulse * 0.3} />
            <circle cx={x} cy={y} r={12} fill={COLORS.surface} stroke={node.color} strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fill={node.color} fontSize="12" fontWeight="bold" fontFamily="monospace">
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Flowing packet */}
      <circle cx={packetX} cy={packetY} r={5} fill={COLORS.build} />
      <circle cx={packetX} cy={packetY} r={9} fill={COLORS.build} opacity={0.3} />
    </svg>
  );
};

// ============================================================
// MINI ANIMATION 2: Exploded Layers Stack
// ============================================================
const MiniLayerStack: React.FC = () => {
  const frame = useCurrentFrame();

  const layers = [
    { y: 40, label: 'AI', color: COLORS.build, width: 140 },
    { y: 95, label: 'ORCHESTRATION', color: COLORS.spec, width: 180 },
    { y: 150, label: 'DATA', color: COLORS.refine, width: 160 },
  ];

  const breathe = Math.sin(frame * 0.08) * 4;
  const particleY = 40 + ((frame * 2) % 130);

  return (
    <svg width="420" height="230" viewBox="0 0 420 230">
      {/* Vertical connection */}
      <line x1="210" y1="55" x2="210" y2="135" stroke={COLORS.textDim} strokeWidth="1" strokeDasharray="4 4" opacity={0.4} />

      {/* Layers */}
      {layers.map((layer, i) => {
        const yOffset = breathe * (i - 1);
        const scanPos = ((frame + i * 20) % 50) / 50;

        return (
          <g key={i} transform={`translate(0, ${yOffset})`}>
            <rect x={210 - layer.width / 2} y={layer.y - 16} width={layer.width} height={32} rx={6} fill={COLORS.surface} stroke={layer.color} strokeWidth="2" />
            <rect x={210 - layer.width / 2 + 2} y={layer.y - 14 + scanPos * 28} width={layer.width - 4} height={2} fill={layer.color} opacity={0.2} />
            <text x={210} y={layer.y + 5} textAnchor="middle" fill={layer.color} fontSize="11" fontWeight="600" fontFamily="monospace" letterSpacing="0.08em">
              {layer.label}
            </text>
            {/* Corner accents */}
            <path d={`M${210 - layer.width / 2 + 2},${layer.y - 12} L${210 - layer.width / 2 + 2},${layer.y - 16} L${210 - layer.width / 2 + 10},${layer.y - 16}`} fill="none" stroke={layer.color} strokeWidth="2" opacity={0.6} />
          </g>
        );
      })}

      {/* Flowing particle */}
      <circle cx={210} cy={particleY} r={4} fill={COLORS.build} opacity={0.8} />
    </svg>
  );
};

// ============================================================
// MINI ANIMATION 3: Data Pipeline Flow
// ============================================================
const MiniDataPipeline: React.FC = () => {
  const frame = useCurrentFrame();

  const stages = [
    { x: 55, icon: 'IN', color: COLORS.textMuted },
    { x: 145, icon: 'FN', color: COLORS.spec },
    { x: 235, icon: 'TX', color: COLORS.build },
    { x: 325, icon: 'OUT', color: COLORS.refine },
  ];

  const flowX = 55 + ((frame * 3) % 290);

  return (
    <svg width="420" height="230" viewBox="0 0 420 230">
      {/* Pipeline line */}
      <line x1="55" y1="115" x2="365" y2="115" stroke={COLORS.textDim} strokeWidth="2" opacity={0.3} />
      <line x1="55" y1="115" x2="365" y2="115" stroke={COLORS.build} strokeWidth="2" strokeDasharray="12 8" strokeDashoffset={-frame * 0.8} opacity={0.5} />

      {/* Stage nodes */}
      {stages.map((stage, i) => {
        const pulse = Math.sin(frame * 0.12 + i * 0.8) * 0.15 + 0.85;
        return (
          <g key={i}>
            <circle cx={stage.x} cy={115} r={24} fill={stage.color} opacity={pulse * 0.15} />
            <circle cx={stage.x} cy={115} r={18} fill={COLORS.surface} stroke={stage.color} strokeWidth="2" />
            <text x={stage.x} y={120} textAnchor="middle" fill={stage.color} fontSize="12" fontWeight="bold" fontFamily="monospace">
              {stage.icon}
            </text>
          </g>
        );
      })}

      {/* Flowing data packet */}
      <rect x={flowX - 7} y={105} width={14} height={20} rx={3} fill={COLORS.build} opacity={0.9} />
    </svg>
  );
};

// ============================================================
// CLIP FRAME COMPONENT
// ============================================================
interface ClipFrameProps {
  animation: 'loop' | 'layers' | 'pipeline';
  label: string;
  delay: number;
  index: number;
}

const ClipFrame: React.FC<ClipFrameProps> = ({ animation, label, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const floatOffset = Math.sin((frame + index * 30) * 0.03) * 3;
  const pulseOpacity = Math.sin(frame * 0.06 + index * 0.5) * 0.15 + 0.5;
  const scanSpeed = 60 + index * 15;
  const scanPosition = ((frame % scanSpeed) / scanSpeed) * 100;

  const renderAnimation = () => {
    switch (animation) {
      case 'loop': return <MiniAgentLoop />;
      case 'layers': return <MiniLayerStack />;
      case 'pipeline': return <MiniDataPipeline />;
    }
  };

  return (
    <div
      style={{
        width: 440,
        height: 250,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.spec}40`,
        borderRadius: 12,
        position: 'relative',
        opacity,
        transform: `translateY(${translateY + floatOffset}px) scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {[
        { top: 8, left: 8, borderTop: true, borderLeft: true },
        { top: 8, right: 8, borderTop: true, borderRight: true },
        { bottom: 8, left: 8, borderBottom: true, borderLeft: true },
        { bottom: 8, right: 8, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            width: 14,
            height: 14,
            borderTop: pos.borderTop ? `2px solid ${COLORS.spec}` : 'none',
            borderBottom: pos.borderBottom ? `2px solid ${COLORS.spec}` : 'none',
            borderLeft: pos.borderLeft ? `2px solid ${COLORS.spec}` : 'none',
            borderRight: pos.borderRight ? `2px solid ${COLORS.spec}` : 'none',
            opacity: pulseOpacity,
          }}
        />
      ))}

      {/* Scan line */}
      <div style={{ position: 'absolute', top: `${scanPosition}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.spec}30, transparent)` }} />

      {/* Animation content */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {renderAnimation()}
      </div>

      {/* Label badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '4px 12px',
          backgroundColor: `${COLORS.spec}20`,
          borderRadius: 4,
          fontSize: 10,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.spec,
          fontWeight: 600,
          letterSpacing: '0.1em',
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene1B_PreviousWorkShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const badgeScale = interpolate(badgeEntrance, [0, 1], [1.2, 1]);
  const badgeY = interpolate(badgeEntrance, [0, 1], [100, 0]);
  const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1]);

  const fadeOut = interpolate(frame, [PHASE.FADE_OUT_START, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const linesProgress = spring({ frame: frame - PHASE.CLIPS_SETTLED, fps, config: SPRING_CONFIGS.gentle });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: fadeOut }}>
        {/* Badge */}
        <div style={{ position: 'absolute', top: 60, right: 80, opacity: badgeOpacity, transform: `translateY(${badgeY}px) scale(${badgeScale})` }}>
          <div style={{ padding: '12px 24px', backgroundColor: `${COLORS.possibility}15`, border: `2px solid ${COLORS.possibility}60`, borderRadius: 8 }}>
            <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility }}>
              {'< 1 HOUR'}
            </span>
          </div>
        </div>

        {/* Three animation frames */}
        <div style={{ display: 'flex', gap: 30, alignItems: 'center', marginTop: 40 }}>
          <ClipFrame animation="loop" label="AGENT LOOP" delay={PHASE.CLIPS_STAGGER_START} index={0} />
          <ClipFrame animation="layers" label="LAYER STACK" delay={PHASE.CLIPS_STAGGER_START + 15} index={1} />
          <ClipFrame animation="pipeline" label="DATA FLOW" delay={PHASE.CLIPS_STAGGER_START + 30} index={2} />
        </div>

        {/* Connecting lines */}
        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1200, height: 400, pointerEvents: 'none', opacity: linesProgress * 0.4 }}>
          <line x1="200" y1="280" x2="480" y2="280" stroke={COLORS.spec} strokeWidth="1" strokeDasharray="8,4" style={{ strokeDashoffset: -frame * 0.5 }} />
          <line x1="720" y1="280" x2="1000" y2="280" stroke={COLORS.spec} strokeWidth="1" strokeDasharray="8,4" style={{ strokeDashoffset: -frame * 0.5 }} />
          <path d="M 200 300 Q 600 380 1000 300" stroke={COLORS.spec} strokeWidth="1" fill="none" strokeDasharray="8,4" style={{ strokeDashoffset: -frame * 0.3 }} />
        </svg>

        {/* Label */}
        <div style={{ marginTop: 50, opacity: interpolate(frame, [PHASE.CLIPS_SETTLED + 30, PHASE.CLIPS_SETTLED + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <span style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, fontStyle: 'italic' }}>
            animations like these
          </span>
        </div>

        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
      </div>
    </AbsoluteFill>
  );
};

export default Scene1B_PreviousWorkShowcase;
