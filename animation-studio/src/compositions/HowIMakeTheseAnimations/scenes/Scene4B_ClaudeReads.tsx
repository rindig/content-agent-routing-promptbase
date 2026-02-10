/**
 * Scene 4B: Claude Code Reads Everything
 * [4:35 - 5:05] — 900 frames
 *
 * "Claude Code reads your spec. It also reads your documentation..."
 * Visual: File reading visualization - Claude consuming docs
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
  CLAUDE_READS_SPEC: 0,
  DOC_TREE: 150,
  COMPONENT_REGISTRY: 450,
  ALL_CONSUMED: 750,
};

// File node component
const FileNode: React.FC<{
  label: string;
  details?: string[];
  color: string;
  startFrame: number;
  x: number;
  y: number;
}> = ({ label, details, color, startFrame, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const xOff = interpolate(entrance, [0, 1], [20, 0]);

  if (frame < startFrame) return null;

  return (
    <g transform={`translate(${x + xOff}, ${y})`} opacity={opacity}>
      <rect x="0" y="-14" width={180} height={details ? 28 + details.length * 18 : 28} rx="4" fill={COLORS.surface} stroke={color} strokeWidth="1.5" opacity={0.8} />
      <text x="12" y="4" fill={color} fontSize="15" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600">
        {label}
      </text>
      {details?.map((d, i) => (
        <text key={i} x="20" y={22 + i * 18} fill={COLORS.textMuted} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>
          {d}
        </text>
      ))}
    </g>
  );
};

// Component grid item
const CompItem: React.FC<{
  name: string;
  startFrame: number;
  x: number;
  y: number;
  color: string;
}> = ({ name, startFrame, x, y, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  if (frame < startFrame) return null;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-45" y="-22" width="90" height="44" rx="6" fill={COLORS.surface} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fill={color} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>
        {name}
      </text>
    </g>
  );
};

export const Scene4B_ClaudeReads: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Claude terminal icon
  const claudeEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const claudeOpacity = interpolate(claudeEntrance, [0, 1], [0, 1]);

  // Reading indicator
  const readingDots = '.'.repeat((Math.floor(frame / 15) % 3) + 1);

  // Data flow particles
  const flowParticles = Array.from({ length: 6 }).map((_, i) => {
    const progress = ((frame + i * 20) % 80) / 80;
    return { progress, i };
  });

  // Glow after consuming all
  const allGlow = frame >= PHASE.ALL_CONSUMED
    ? spring({ frame: frame - PHASE.ALL_CONSUMED, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const glowSize = interpolate(allGlow, [0, 1], [0, 24]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {/* Claude Code terminal - center left */}
        <g transform="translate(200, 400)" opacity={claudeOpacity}>
          <rect x="-80" y="-60" width="160" height="120" rx="12" fill={COLORS.surface} stroke="#D97706" strokeWidth="2" />
          {/* Terminal prompt */}
          <text x="-60" y="-20" fill="#D97706" fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>$ claude</text>
          <text x="-60" y="5" fill={COLORS.textMuted} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>
            Reading{readingDots}
          </text>
          {/* Glow when complete */}
          {allGlow > 0 && (
            <rect x="-80" y="-60" width="160" height="120" rx="12" fill="none" stroke="#D97706" strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 ${glowSize}px #D9770640)` }} />
          )}
          <text x="0" y="45" textAnchor="middle" fill="#D97706" fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600">CLAUDE CODE</text>
        </g>

        {/* SPEC doc - flows first */}
        <FileNode label="spec.md" color={COLORS.spec} startFrame={15} x={500} y={200} />

        {/* Flow line from spec to Claude */}
        {frame > 30 && flowParticles.map((p, i) => {
          const px = 500 - p.progress * 280;
          const py = 200 + p.progress * 200;
          return (
            <circle key={`s${i}`} cx={px} cy={py} r={3} fill={COLORS.spec} opacity={Math.sin(p.progress * Math.PI) * 0.7} />
          );
        })}

        {/* Checkmark on spec */}
        {frame > 120 && (
          <g transform="translate(700, 195)">
            <circle cx="0" cy="0" r="10" fill={COLORS.refine} opacity={0.8} />
            <path d="M-4 0 L-1 3 L5 -3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* Documentation tree */}
        <FileNode label="docs/" color={COLORS.build} startFrame={PHASE.DOC_TREE} x={500} y={340} />
        <FileNode
          label="style-guide.md"
          details={['min text: 48px', 'colors: palette', 'spring configs']}
          color={COLORS.build}
          startFrame={PHASE.DOC_TREE + 30}
          x={540}
          y={390}
        />
        <FileNode
          label="visual-philosophy.md"
          color={COLORS.build}
          startFrame={PHASE.DOC_TREE + 60}
          x={540}
          y={470}
        />
        <FileNode
          label="component-registry.md"
          color={COLORS.build}
          startFrame={PHASE.DOC_TREE + 90}
          x={540}
          y={510}
        />

        {/* Tree lines */}
        {frame >= PHASE.DOC_TREE + 30 && (
          <>
            <line x1="520" y1="365" x2="520" y2="520" stroke={COLORS.textDim} strokeWidth="1" opacity={0.3} />
            <line x1="520" y1="395" x2="540" y2="395" stroke={COLORS.textDim} strokeWidth="1" opacity={0.3} />
            <line x1="520" y1="475" x2="540" y2="475" stroke={COLORS.textDim} strokeWidth="1" opacity={0.3} />
            <line x1="520" y1="515" x2="540" y2="515" stroke={COLORS.textDim} strokeWidth="1" opacity={0.3} />
          </>
        )}

        {/* Flow from docs to Claude */}
        {frame > PHASE.DOC_TREE + 100 && flowParticles.map((p, i) => {
          const px = 500 - p.progress * 280;
          const py = 420 - p.progress * 20;
          return (
            <circle key={`d${i}`} cx={px} cy={py} r={3} fill={COLORS.build} opacity={Math.sin(p.progress * Math.PI) * 0.5} />
          );
        })}

        {/* Component registry grid */}
        {frame >= PHASE.COMPONENT_REGISTRY && (
          <text x="1200" y="280" textAnchor="middle" fill={COLORS.textMuted} fontSize="16" fontFamily={TYPOGRAPHY.display.fontFamily}>
            Component Registry
          </text>
        )}

        {/* Component items in grid */}
        {[
          { name: 'AnimText', x: 1100, y: 330 },
          { name: 'Glitch', x: 1210, y: 330 },
          { name: 'CountUp', x: 1320, y: 330 },
          { name: 'Particles', x: 1100, y: 390 },
          { name: 'BlurText', x: 1210, y: 390 },
          { name: 'Panels', x: 1320, y: 390 },
        ].map((comp, i) => (
          <CompItem
            key={comp.name}
            name={comp.name}
            startFrame={PHASE.COMPONENT_REGISTRY + 20 + i * 15}
            x={comp.x}
            y={comp.y}
            color={COLORS.build}
          />
        ))}

        {/* "Now it knows" text */}
        {frame >= PHASE.ALL_CONSUMED && (
          <text
            x="960"
            y="700"
            textAnchor="middle"
            fill={COLORS.text}
            fontSize="28"
            fontFamily={TYPOGRAPHY.display.fontFamily}
            opacity={spring({ frame: frame - PHASE.ALL_CONSUMED, fps, config: SPRING_CONFIGS.gentle })}
          >
            Now it knows: your style, your patterns, your components
          </text>
        )}
      </svg>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4B_ClaudeReads;
