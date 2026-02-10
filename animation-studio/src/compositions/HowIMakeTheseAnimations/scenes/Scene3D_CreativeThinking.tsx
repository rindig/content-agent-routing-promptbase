/**
 * Scene 3D: Where Creative Thinking Lives
 * [2:55 - 3:15] — 600 frames
 *
 * "The spec is the brief. It's where your ideas become concrete enough for
 *  the system to execute them. And this is where most of your creative
 *  thinking happens."
 *
 * Visual: Abstract ideas becoming concrete, creative decisions list
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

// Timeline
const PHASE = {
  BRIDGE: 0,
  IDEAS_TRANSFORM: 90,
  CREATIVE_STATEMENT: 240,
  DECISIONS_START: 360,
};

// ============================================================
// SPEC = BRIEF MERGE
// ============================================================
const SpecBriefMerge: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Merge animation
  const mergeProgress = interpolate(frame, [startFrame + 30, startFrame + 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pulse after merge
  const pulse = mergeProgress >= 1 ? Math.sin((frame - startFrame - 70) * 0.1) * 4 + 8 : 0;

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* SPEC */}
      <div
        style={{
          transform: `translateX(${mergeProgress * 60}px)`,
          opacity: 1 - mergeProgress * 0.5,
        }}
      >
        <div
          style={{
            width: 100,
            height: 120,
            backgroundColor: COLORS.surface,
            border: `2px solid ${COLORS.spec}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: pulse > 0 ? `0 0 ${pulse}px ${COLORS.spec}40` : 'none',
          }}
        >
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
            <path d="M8 4H28L34 10V44H8V4Z" stroke={COLORS.spec} strokeWidth="2" fill="none" />
            <path d="M28 4V10H34" stroke={COLORS.spec} strokeWidth="2" />
            <line x1="12" y1="18" x2="28" y2="18" stroke={COLORS.spec} strokeWidth="2" opacity={0.5} />
            <line x1="12" y1="24" x2="24" y2="24" stroke={COLORS.spec} strokeWidth="2" opacity={0.4} />
          </svg>
          <span style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.spec, marginTop: 8 }}>SPEC</span>
        </div>
      </div>

      {/* Equals / merge line */}
      <div
        style={{
          fontSize: 48,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          color: COLORS.textMuted,
          opacity: 1 - mergeProgress,
        }}
      >
        =
      </div>

      {/* BRIEF */}
      <div
        style={{
          transform: `translateX(${-mergeProgress * 60}px)`,
          opacity: 1 - mergeProgress * 0.5,
        }}
      >
        <div
          style={{
            width: 100,
            height: 120,
            backgroundColor: COLORS.surface,
            border: `2px solid ${COLORS.emphasis}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
            <rect x="6" y="4" width="28" height="40" rx="4" stroke={COLORS.emphasis} strokeWidth="2" fill="none" />
            <line x1="12" y1="14" x2="28" y2="14" stroke={COLORS.emphasis} strokeWidth="2" opacity={0.5} />
            <line x1="12" y1="22" x2="22" y2="22" stroke={COLORS.emphasis} strokeWidth="2" opacity={0.4} />
            <line x1="12" y1="30" x2="26" y2="30" stroke={COLORS.emphasis} strokeWidth="2" opacity={0.3} />
          </svg>
          <span style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.emphasis, marginTop: 8 }}>BRIEF</span>
        </div>
      </div>

      {/* Merged result */}
      {mergeProgress > 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: (mergeProgress - 0.5) * 2,
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.spec}`,
              borderRadius: 8,
              boxShadow: `0 0 ${pulse}px ${COLORS.spec}40`,
            }}
          >
            <span style={{ fontSize: 24, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.spec }}>
              THE SPEC <span style={{ color: COLORS.textMuted }}>=</span> THE BRIEF
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// IDEAS TO CONCRETE TRANSFORMATION
// ============================================================
const IdeasTransform: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Transform progress
  const transformProgress = interpolate(frame, [startFrame + 30, startFrame + 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (frame < startFrame) return null;

  // Abstract blobs (ideas)
  const blobs = [
    { x: 80, y: 80, color: COLORS.spec, size: 50 },
    { x: 140, y: 60, color: COLORS.build, size: 40 },
    { x: 110, y: 130, color: COLORS.refine, size: 35 },
  ];

  // Concrete blocks
  const blocks = [
    { x: 320, y: 50, w: 80, h: 40, color: COLORS.spec },
    { x: 320, y: 100, w: 100, h: 40, color: COLORS.build },
    { x: 320, y: 150, w: 70, h: 40, color: COLORS.refine },
  ];

  return (
    <div style={{ opacity, position: 'relative', width: 500, height: 220 }}>
      <svg width="500" height="220" viewBox="0 0 500 220">
        {/* Ideas label */}
        <text x="100" y="30" textAnchor="middle" fill={COLORS.textMuted} fontSize="16" fontFamily={TYPOGRAPHY.display.fontFamily}>
          Ideas
        </text>

        {/* Abstract blobs */}
        {blobs.map((blob, i) => {
          const wobble = Math.sin(frame * 0.1 + i) * (1 - transformProgress) * 8;
          const blobOpacity = 1 - transformProgress;

          return (
            <ellipse
              key={i}
              cx={blob.x + wobble}
              cy={blob.y + Math.cos(frame * 0.08 + i) * (1 - transformProgress) * 5}
              rx={blob.size * (1 - transformProgress * 0.5)}
              ry={blob.size * 0.7 * (1 - transformProgress * 0.5)}
              fill={blob.color}
              opacity={blobOpacity * 0.4}
              filter={transformProgress < 0.5 ? "url(#ideaBlur)" : undefined}
            />
          );
        })}

        {/* Blur filter for ideas */}
        <defs>
          <filter id="ideaBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={4 * (1 - transformProgress)} />
          </filter>
        </defs>

        {/* Arrow */}
        <path
          d="M 180 110 L 280 110"
          stroke={COLORS.textDim}
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity={0.5}
        />
        <polygon
          points="275,105 285,110 275,115"
          fill={COLORS.textDim}
          opacity={0.5}
        />

        {/* Concrete label */}
        <text x="360" y="30" textAnchor="middle" fill={COLORS.textMuted} fontSize="16" fontFamily={TYPOGRAPHY.display.fontFamily}>
          Concrete
        </text>

        {/* Concrete blocks */}
        {blocks.map((block, i) => {
          const blockEntrance = spring({
            frame: frame - startFrame - 50 - i * 15,
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const blockOpacity = interpolate(blockEntrance, [0, 1], [0, 1]);
          const blockX = interpolate(blockEntrance, [0, 1], [block.x + 30, block.x]);

          return (
            <g key={i} opacity={blockOpacity}>
              <rect
                x={blockX}
                y={block.y}
                width={block.w}
                height={block.h}
                rx={4}
                fill={COLORS.surface}
                stroke={block.color}
                strokeWidth="2"
              />
              {/* Internal lines (structure) */}
              <line x1={blockX + 8} y1={block.y + 12} x2={blockX + block.w - 8} y2={block.y + 12} stroke={block.color} strokeWidth="2" opacity={0.4} />
              <line x1={blockX + 8} y1={block.y + 24} x2={blockX + block.w - 20} y2={block.y + 24} stroke={block.color} strokeWidth="2" opacity={0.3} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ============================================================
// CREATIVE ENERGY INTO DOCUMENT
// ============================================================
const CreativeEnergy: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Particles flowing into document
  const particleCount = 8;

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 32,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.text,
          marginBottom: 32,
        }}
      >
        This is where <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>creative thinking</span> happens
      </div>

      <svg width="400" height="180" viewBox="0 0 400 180">
        {/* Creative sources (brain/lightbulb icons) */}
        <g transform="translate(60, 90)">
          {/* Brain */}
          <circle cx="0" cy="0" r="25" fill={`${COLORS.emphasis}20`} />
          <path
            d="M-10 -8 Q -15 -15 -5 -15 Q 0 -20 10 -15 Q 15 -10 10 0 Q 15 10 5 15 Q -5 15 -10 8 Q -15 5 -10 -8"
            stroke={COLORS.emphasis}
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Document target */}
        <g transform="translate(320, 90)">
          <rect x="-35" y="-50" width="70" height="90" rx="6" fill={COLORS.surface} stroke={COLORS.spec} strokeWidth="2" />
          <line x1="-25" y1="-30" x2="25" y2="-30" stroke={COLORS.spec} strokeWidth="2" opacity={0.5} />
          <line x1="-25" y1="-15" x2="15" y2="-15" stroke={COLORS.spec} strokeWidth="2" opacity={0.4} />
          <line x1="-25" y1="0" x2="20" y2="0" stroke={COLORS.spec} strokeWidth="2" opacity={0.3} />
          <text x="0" y="55" textAnchor="middle" fill={COLORS.spec} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>SPEC</text>
        </g>

        {/* Flowing particles */}
        {Array.from({ length: particleCount }).map((_, i) => {
          const particleProgress = ((frame - startFrame + i * 15) % 90) / 90;
          const px = 100 + particleProgress * 180;
          const py = 90 + Math.sin(particleProgress * Math.PI * 2 + i) * 25;
          const particleOpacity = Math.sin(particleProgress * Math.PI);

          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={4}
              fill={i % 2 === 0 ? COLORS.emphasis : COLORS.spec}
              opacity={particleOpacity * 0.8}
            />
          );
        })}

        {/* Arrow base */}
        <path
          d="M 100 90 Q 200 90 280 90"
          stroke={COLORS.textDim}
          strokeWidth="2"
          strokeDasharray="8 4"
          fill="none"
          opacity={0.3}
        />
      </svg>
    </div>
  );
};

// ============================================================
// CREATIVE DECISIONS LIST
// ============================================================
const CreativeDecisions: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const decisions = [
    {
      question: "What's the THESIS?",
      icon: (color: string) => (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="2" />
          <circle cx="18" cy="18" r="6" fill={color} opacity={0.6} />
        </svg>
      ),
      color: COLORS.emphasis,
    },
    {
      question: "What's the ARC?",
      icon: (color: string) => (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M4 28 L12 20 L18 8 L24 20 L32 28" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="18" y="34" textAnchor="middle" fill={color} fontSize="6" fontFamily="sans-serif">↑</text>
        </svg>
      ),
      color: COLORS.spec,
    },
    {
      question: "Moments that LAND?",
      icon: (color: string) => (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <line x1="4" y1="18" x2="32" y2="18" stroke={color} strokeWidth="2" opacity={0.4} />
          <circle cx="10" cy="18" r="4" fill={color} opacity={0.8} />
          <circle cx="22" cy="18" r="5" fill={color} />
          <circle cx="30" cy="18" r="3" fill={color} opacity={0.6} />
        </svg>
      ),
      color: COLORS.build,
    },
    {
      question: "FAST vs SLOW?",
      icon: (color: string) => (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="12" width="10" height="12" rx="2" fill={color} opacity={0.8} />
          <rect x="18" y="8" width="14" height="20" rx="2" fill={color} opacity={0.4} />
        </svg>
      ),
      color: COLORS.refine,
    },
  ];

  if (frame < startFrame) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      {decisions.map((decision, i) => {
        const itemEntrance = spring({
          frame: frame - startFrame - i * 40,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const itemOpacity = interpolate(itemEntrance, [0, 1], [0, 1]);
        const itemX = interpolate(itemEntrance, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: itemOpacity,
              transform: `translateX(${itemX}px)`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                backgroundColor: COLORS.surface,
                border: `2px solid ${decision.color}40`,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {decision.icon(decision.color)}
            </div>
            <span
              style={{
                fontSize: 24,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.text,
              }}
            >
              {decision.question.split(/(\b(?:THESIS|ARC|LAND|FAST|SLOW)\b)/g).map((part, j) => {
                const isHighlight = ['THESIS', 'ARC', 'LAND', 'FAST', 'SLOW'].includes(part);
                return (
                  <span key={j} style={{ color: isHighlight ? decision.color : COLORS.text, fontWeight: isHighlight ? 600 : 400 }}>
                    {part}
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3D_CreativeThinking: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase transitions
  const bridgeFade = interpolate(frame, [PHASE.IDEAS_TRANSFORM - 30, PHASE.IDEAS_TRANSFORM], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ideasFade = interpolate(frame, [PHASE.CREATIVE_STATEMENT - 30, PHASE.CREATIVE_STATEMENT], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const creativeFade = interpolate(frame, [PHASE.DECISIONS_START - 30, PHASE.DECISIONS_START], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Bridge: Spec = Brief */}
      {frame < PHASE.IDEAS_TRANSFORM + 30 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: bridgeFade }}>
          <SpecBriefMerge startFrame={PHASE.BRIDGE} />
        </div>
      )}

      {/* Ideas transform to concrete */}
      {frame >= PHASE.IDEAS_TRANSFORM && frame < PHASE.CREATIVE_STATEMENT + 30 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: ideasFade }}>
          <IdeasTransform startFrame={PHASE.IDEAS_TRANSFORM} />
        </div>
      )}

      {/* Creative thinking statement */}
      {frame >= PHASE.CREATIVE_STATEMENT && frame < PHASE.DECISIONS_START + 30 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: creativeFade }}>
          <CreativeEnergy startFrame={PHASE.CREATIVE_STATEMENT} />
        </div>
      )}

      {/* Creative decisions list */}
      {frame >= PHASE.DECISIONS_START && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CreativeDecisions startFrame={PHASE.DECISIONS_START} />
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene3D_CreativeThinking;
