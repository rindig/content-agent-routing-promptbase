/**
 * Scene 4E: Workflow Demo
 * [5:55 - 6:35] — 1200 frames
 *
 * Step-by-step workflow + video placeholder for screen recording.
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
  WORKFLOW_DIAGRAM: 0,
  STEPS: 180,
  ITERATE: 360,
  MATCH: 540,
  VIDEO_PLACEHOLDER: 660,
  EXIT: 1140,
};

const StepItem: React.FC<{ num: number; text: string; startFrame: number; color: string }> = ({ num, text, startFrame, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const x = interpolate(entrance, [0, 1], [30, 0]);
  if (frame < startFrame) return null;
  return (
    <div style={{ opacity, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', backgroundColor: `${color}20`, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color,
      }}>
        {num}
      </div>
      <span style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>{text}</span>
    </div>
  );
};

export const Scene4E_WorkflowDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Workflow diagram
  const diagramEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const diagramOpacity = interpolate(diagramEntrance, [0, 1], [0, 1]);

  // Shrink diagram when video placeholder shows
  const diagramScale = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const diagramX = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER], [0, -620], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const diagramY = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER], [0, -300], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Iteration loop animation
  const loopPhase = frame >= PHASE.ITERATE;
  const loopPulse = loopPhase ? Math.sin((frame - PHASE.ITERATE) * 0.08) * 0.3 + 0.7 : 0;

  // Match visualization
  const matchEntrance = spring({ frame: frame - PHASE.MATCH, fps, config: SPRING_CONFIGS.gentle });
  const matchOpacity = frame >= PHASE.MATCH ? interpolate(matchEntrance, [0, 1], [0, 1]) : 0;
  const matchFade = interpolate(frame, [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Video placeholder
  const placeholderEntrance = spring({ frame: frame - PHASE.VIDEO_PLACEHOLDER, fps, config: SPRING_CONFIGS.gentle });
  const placeholderOpacity = frame >= PHASE.VIDEO_PLACEHOLDER ? interpolate(placeholderEntrance, [0, 1], [0, 1]) : 0;

  const scanPos = ((frame % 120) / 120) * 100;
  const bracketPulse = Math.sin(frame * 0.06) * 0.15 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Workflow diagram */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: `translate(calc(-50% + ${diagramX}px), calc(-50% + ${diagramY}px)) scale(${diagramScale})`,
        opacity: diagramOpacity,
      }}>
        <svg width="700" height="300" viewBox="0 0 700 300">
          {/* Nodes */}
          {[
            { x: 100, y: 50, label: 'Spec', color: COLORS.spec },
            { x: 350, y: 50, label: 'Claude', color: '#D97706' },
            { x: 600, y: 50, label: 'Code', color: COLORS.build },
            { x: 600, y: 200, label: 'Preview', color: COLORS.refine },
            { x: 350, y: 200, label: 'Feedback', color: COLORS.emphasis },
          ].map((node, i) => {
            const nodeEntrance = spring({ frame: frame - 15 - i * 20, fps, config: SPRING_CONFIGS.snappy });
            return (
              <g key={i} opacity={interpolate(nodeEntrance, [0, 1], [0, 1])}>
                <rect x={node.x - 55} y={node.y - 22} width={110} height={44} rx={8} fill={COLORS.surface} stroke={node.color} strokeWidth="2" />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={node.color} fontSize="15" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600">{node.label}</text>
              </g>
            );
          })}

          {/* Arrows */}
          {[
            { x1: 155, y1: 50, x2: 290, y2: 50 },
            { x1: 405, y1: 50, x2: 540, y2: 50 },
            { x1: 600, y1: 72, x2: 600, y2: 178 },
            { x1: 545, y1: 200, x2: 410, y2: 200 },
            { x1: 350, y1: 178, x2: 350, y2: 72 },
          ].map((arrow, i) => {
            const arrowEntrance = spring({ frame: frame - 80 - i * 15, fps, config: SPRING_CONFIGS.snappy });
            const opacity = interpolate(arrowEntrance, [0, 1], [0, 0.5]);
            const isLoop = i >= 3;
            return (
              <line key={i} x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2}
                stroke={isLoop ? COLORS.emphasis : COLORS.textDim} strokeWidth="2" opacity={isLoop ? loopPulse : opacity}
                markerEnd="url(#arrowhead)" />
            );
          })}

          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={COLORS.textDim} opacity={0.5} />
            </marker>
          </defs>

          {/* Loop label */}
          {loopPhase && (
            <text x="475" y="240" textAnchor="middle" fill={COLORS.emphasis} fontSize="13" fontFamily={TYPOGRAPHY.code.fontFamily} opacity={loopPulse}>
              iterate
            </text>
          )}
        </svg>
      </div>

      {/* Steps */}
      {frame >= PHASE.STEPS && frame < PHASE.VIDEO_PLACEHOLDER && (
        <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <StepItem num={1} text="Give Claude the spec" startFrame={PHASE.STEPS} color={COLORS.spec} />
          <StepItem num={2} text="Point to documentation" startFrame={PHASE.STEPS + 30} color={COLORS.build} />
          <StepItem num={3} text="Specify which scene" startFrame={PHASE.STEPS + 60} color={COLORS.build} />
          <StepItem num={4} text="Claude writes the code" startFrame={PHASE.STEPS + 90} color="#D97706" />
          <StepItem num={5} text="Preview in Remotion Studio" startFrame={PHASE.STEPS + 120} color={COLORS.refine} />
        </div>
      )}

      {/* Vision matches reality */}
      {frame >= PHASE.MATCH && frame < PHASE.VIDEO_PLACEHOLDER + 15 && (
        <div style={{ position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)', opacity: matchOpacity * matchFade, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>
            Until it <span style={{ color: COLORS.refine, fontWeight: 600 }}>matches</span> what you had in mind
          </div>
        </div>
      )}

      {/* Video placeholder */}
      {frame >= PHASE.VIDEO_PLACEHOLDER && (
        <div style={{
          position: 'absolute', top: '50%', left: '53%', transform: 'translate(-50%, -50%)',
          opacity: placeholderOpacity,
          width: 850, height: 480, backgroundColor: COLORS.surface, border: `2px solid ${COLORS.build}40`,
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />

          <div style={{ position: 'absolute', top: 24, left: 28, fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim }}>
            INSERT: Screen recording — giving Claude a spec, watching it build
          </div>
          <div style={{ position: 'absolute', bottom: 24, right: 28, padding: '6px 14px', backgroundColor: `${COLORS.build}20`, borderRadius: 6, border: `1px solid ${COLORS.build}40`, fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build }}>
            ~25 sec
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="none" stroke={COLORS.textDim} strokeWidth="2" opacity={0.3} />
              <polygon points="26,20 26,44 46,32" fill={COLORS.textDim} opacity={0.3} />
            </svg>
          </div>
          <div style={{ position: 'absolute', top: `${scanPos}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.build}30, transparent)` }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4E_WorkflowDemo;
