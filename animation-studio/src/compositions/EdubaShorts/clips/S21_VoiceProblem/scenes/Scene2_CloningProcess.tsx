import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start = frame 0 within this Sequence) ──
const BEATS = {
  WAVEFORMS_MERGE: 0,
  INDISTINGUISHABLE_TEXT: 20,
  INPUT_ICON: 30,
  PROGRESS_BAR: 40,
  ARROW_TO_PIPELINE: 70,
  PITCH_NODE: 75,
  CADENCE_NODE: 90,
  BREATHING_NODE: 105,
  FORMANTS_NODE: 120,
  FLOW_LINES: 150,
  FINGERPRINT_REVEAL: 170,
  FINGERPRINT_PULSE: 210,
  COMPLETE_TEXT: 220,
  THIRTY_SEC_BADGE: 230,
  SCENE_END: 270,
};

// ── Pipeline extraction nodes ──
interface ExtractionNode {
  label: string;
  color: string;
  icon: 'pitch' | 'cadence' | 'breathing' | 'formants';
  beatFrame: number;
}

const EXTRACTION_NODES: ExtractionNode[] = [
  { label: 'Pitch', color: COLORS.techBlue, icon: 'pitch', beatFrame: BEATS.PITCH_NODE },
  { label: 'Cadence', color: COLORS.solutionGreen, icon: 'cadence', beatFrame: BEATS.CADENCE_NODE },
  { label: 'Breathing', color: COLORS.insightOrange, icon: 'breathing', beatFrame: BEATS.BREATHING_NODE },
  { label: 'Formants', color: COLORS.aiPurple, icon: 'formants', beatFrame: BEATS.FORMANTS_NODE },
];

// ── Icon components ──
const PitchIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={24} viewBox="0 0 40 24">
    <path
      d="M0 12 Q5 2 10 12 Q15 22 20 12 Q25 2 30 12 Q35 22 40 12"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </svg>
);

const CadenceIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={24} viewBox="0 0 40 24">
    <circle cx={6} cy={12} r={4} fill={color} />
    <circle cx={18} cy={12} r={6} fill={color} />
    <circle cx={32} cy={12} r={3} fill={color} />
  </svg>
);

const BreathingIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={24} viewBox="0 0 40 24">
    <path
      d="M0 18 Q10 4 20 12 Q30 18 40 14"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

const FormantsIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={24} viewBox="0 0 40 24">
    <rect x={4} y={8} width={4} height={16} rx={1} fill={color} />
    <rect x={14} y={2} width={4} height={22} rx={1} fill={color} />
    <rect x={24} y={10} width={4} height={14} rx={1} fill={color} />
    <rect x={34} y={6} width={4} height={18} rx={1} fill={color} />
  </svg>
);

const IconMap: Record<string, React.FC<{ color: string }>> = {
  pitch: PitchIcon,
  cadence: CadenceIcon,
  breathing: BreathingIcon,
  formants: FormantsIcon,
};

// ── Microphone icon ──
const MicrophoneIcon: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame,
  fps,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      <svg width={48} height={64} viewBox="0 0 48 64">
        {/* Mic body */}
        <rect x={14} y={4} width={20} height={36} rx={10} fill="none" stroke={COLORS.techBlue} strokeWidth={2} />
        {/* Stand */}
        <path d="M8 32 Q8 52 24 52 Q40 52 40 32" fill="none" stroke={COLORS.techBlue} strokeWidth={2} />
        <line x1={24} y1={52} x2={24} y2={60} stroke={COLORS.techBlue} strokeWidth={2} />
        <line x1={14} y1={60} x2={34} y2={60} stroke={COLORS.techBlue} strokeWidth={2} />
      </svg>
    </div>
  );
};

// ── Mini waveform ──
const MiniWaveform: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const bars: number[] = [];
  for (let i = 0; i < 20; i++) {
    bars.push(Math.abs(Math.sin(i * 0.5) + Math.sin(i * 0.9) * 0.4) / 1.4);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
      {bars.map((h, i) => {
        const barProgress = interpolate(relFrame - i * 0.5, [0, 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: Math.max(2, h * 36 * barProgress),
              backgroundColor: COLORS.techBlue,
              opacity: 0.7,
              borderRadius: 1,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Progress bar ──
const ProgressBar: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = interpolate(relFrame, [0, 30], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ width: 200, height: 6, backgroundColor: COLORS.codeBg, borderRadius: 3, overflow: 'hidden' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: COLORS.techBlue,
          borderRadius: 3,
        }}
      />
    </div>
  );
};

// ── Main Scene ──
export const Scene2_CloningProcess: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Indistinguishable text
  const indistProgress = spring({
    frame: frame - BEATS.INDISTINGUISHABLE_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const indistOpacity = interpolate(indistProgress, [0, 1], [0, 1]);

  // Arrow draw
  const arrowFrame = frame - BEATS.ARROW_TO_PIPELINE;
  const arrowDraw = interpolate(arrowFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flow lines
  const flowFrame = frame - BEATS.FLOW_LINES;
  const flowDashOffset = flowFrame >= 0 ? flowFrame * 3 : 0;

  // Fingerprint
  const fpProgress = spring({
    frame: frame - BEATS.FINGERPRINT_REVEAL,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const fpScale = interpolate(fpProgress, [0, 1], [0.3, 1]);
  const fpOpacity = interpolate(fpProgress, [0, 1], [0, 1]);

  // Fingerprint pulse
  const pulseFrame = frame - BEATS.FINGERPRINT_PULSE;
  const pulseScale = pulseFrame >= 0
    ? 1 + 0.1 * Math.sin(pulseFrame * 0.08)
    : 1;

  // Complete text
  const completeProgress = spring({
    frame: frame - BEATS.COMPLETE_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const completeOpacity = interpolate(completeProgress, [0, 1], [0, 1]);

  // 30s badge
  const badgeProgress = spring({
    frame: frame - BEATS.THIRTY_SEC_BADGE,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);

  // Gradient rotation for fingerprint border
  const gradientAngle = frame * 4;
  const borderColors = [COLORS.techBlue, COLORS.solutionGreen, COLORS.insightOrange, COLORS.aiPurple];
  const gradientStops = borderColors
    .map((c, i) => `${c} ${(i / borderColors.length) * 100}%`)
    .join(', ');

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          paddingTop: 60,
          gap: 16,
        }}
      >
        {/* Indistinguishable label at top */}
        {frame >= BEATS.INDISTINGUISHABLE_TEXT && (
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 48,
              color: COLORS.textMuted,
              textAlign: 'center',
              opacity: indistOpacity,
              marginBottom: 20,
            }}
          >
            Indistinguishable
          </div>
        )}

        {/* Input section: Mic + audio sample + progress bar */}
        {frame >= BEATS.INPUT_ICON && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '20px 28px',
              backgroundColor: COLORS.bgSurface,
              borderRadius: 12,
              border: `1px solid ${COLORS.panelBorder}`,
            }}
          >
            <MicrophoneIcon frame={frame} fps={fps} startFrame={BEATS.INPUT_ICON} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ ...TYPOGRAPHY.body, fontSize: 40, color: COLORS.textBody }}>
                30s audio sample
              </span>
              <MiniWaveform frame={frame} startFrame={BEATS.INPUT_ICON + 5} />
              <ProgressBar frame={frame} startFrame={BEATS.PROGRESS_BAR} />
            </div>
          </div>
        )}

        {/* Arrow down to pipeline */}
        {arrowFrame >= 0 && (
          <svg width={4} height={60} viewBox="0 0 4 60" style={{ marginTop: 8 }}>
            <line
              x1={2}
              y1={0}
              x2={2}
              y2={60}
              stroke={COLORS.textMuted}
              strokeWidth={2}
              strokeDasharray={60}
              strokeDashoffset={60 * (1 - arrowDraw)}
            />
            {arrowDraw >= 0.9 && (
              <polygon points="0,54 4,54 2,60" fill={COLORS.textMuted} />
            )}
          </svg>
        )}

        {/* Extraction nodes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'stretch',
            width: 700,
          }}
        >
          {EXTRACTION_NODES.map((node, i) => {
            const nodeProgress = spring({
              frame: frame - node.beatFrame,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const nodeOpacity = interpolate(nodeProgress, [0, 1], [0, 1]);
            const nodeX = interpolate(nodeProgress, [0, 1], [40, 0]);
            const IconComp = IconMap[node.icon];

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  backgroundColor: COLORS.bgSurfaceAlt,
                  borderRadius: 10,
                  borderLeft: `4px solid ${node.color}`,
                  opacity: nodeOpacity,
                  transform: `translateX(${nodeX}px)`,
                }}
              >
                <IconComp color={node.color} />
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: node.color,
                    textTransform: 'none' as const,
                    letterSpacing: 0,
                  }}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Flow lines (animated dashed lines converging) */}
        {flowFrame >= 0 && (
          <svg width={700} height={40} viewBox="0 0 700 40" style={{ marginTop: -4 }}>
            {EXTRACTION_NODES.map((node, i) => {
              const startX = 100 + i * 150;
              return (
                <line
                  key={i}
                  x1={startX}
                  y1={0}
                  x2={350}
                  y2={38}
                  stroke={COLORS.textMuted}
                  strokeWidth={1}
                  strokeDasharray="6 4"
                  strokeDashoffset={-flowDashOffset}
                  opacity={0.5}
                />
              );
            })}
          </svg>
        )}

        {/* Fingerprint circle */}
        {frame >= BEATS.FINGERPRINT_REVEAL && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: fpOpacity,
              transform: `scale(${fpScale * pulseScale})`,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `conic-gradient(from ${gradientAngle}deg, ${gradientStops}, ${borderColors[0]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  backgroundColor: COLORS.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={40} height={40} viewBox="0 0 40 40">
                  <circle cx={20} cy={20} r={4} fill={COLORS.textPrimary} />
                  <circle cx={20} cy={20} r={10} fill="none" stroke={COLORS.textPrimary} strokeWidth={1.5} opacity={0.6} />
                  <circle cx={20} cy={20} r={16} fill="none" stroke={COLORS.textPrimary} strokeWidth={1} opacity={0.3} />
                </svg>
              </div>
            </div>

            {/* Voice Fingerprint label */}
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 32,
                color: COLORS.textPrimary,
                textTransform: 'none' as const,
                letterSpacing: 1,
              }}
            >
              Voice Fingerprint
            </span>
          </div>
        )}

        {/* Complete voice model text + 30s badge */}
        {frame >= BEATS.COMPLETE_TEXT && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: completeOpacity,
              marginTop: 8,
            }}
          >
            <span style={{ ...TYPOGRAPHY.body, fontSize: 40, color: COLORS.textBody }}>
              Complete voice model
            </span>

            {/* 30s badge */}
            {frame >= BEATS.THIRTY_SEC_BADGE && (
              <div
                style={{
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  borderRadius: 20,
                  padding: '6px 16px',
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: COLORS.insightOrange,
                    textTransform: 'none' as const,
                    letterSpacing: 0,
                  }}
                >
                  30s
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
