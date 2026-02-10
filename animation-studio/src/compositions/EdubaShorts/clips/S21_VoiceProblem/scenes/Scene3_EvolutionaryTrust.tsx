import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  PIPELINE_FADE: 0,
  BG_WARM_SHIFT: 0,
  TIMELINE_START: 30,
  NODE_1: 30,
  NODE_2: 42,
  NODE_3: 54,
  NODE_4: 66,
  SPOTLIGHT_1: 70,
  SPOTLIGHT_2: 85,
  SPOTLIGHT_3: 100,
  SPOTLIGHT_4: 115,
  EVOLUTION_TEXT: 140,
  REPLICATED_TEXT: 190,
  UNDERLINE: 200,
  SCENE_END: 240,
};

// ── Timeline node data ──
interface EvoNode {
  time: string;
  label: string;
  color: string;
  iconType: 'infant' | 'emotion' | 'sarcasm' | 'group';
  beatFrame: number;
}

const TIMELINE_NODES: EvoNode[] = [
  { time: 'Day 1', label: 'Recognizes mother\'s voice', color: COLORS.historyGold, iconType: 'infant', beatFrame: BEATS.NODE_1 },
  { time: 'Months', label: 'Detects emotion in tone', color: COLORS.solutionGreen, iconType: 'emotion', beatFrame: BEATS.NODE_2 },
  { time: 'Years', label: 'Detects sarcasm, lies', color: COLORS.techBlue, iconType: 'sarcasm', beatFrame: BEATS.NODE_3 },
  { time: 'Millennia', label: 'Voice = identity proof', color: COLORS.insightOrange, iconType: 'group', beatFrame: BEATS.NODE_4 },
];

// Spotlight ranges: each 15 frames
const SPOTLIGHT_FRAMES: number[] = [
  BEATS.SPOTLIGHT_1,
  BEATS.SPOTLIGHT_2,
  BEATS.SPOTLIGHT_3,
  BEATS.SPOTLIGHT_4,
];

// ── Simple icons ──
const InfantIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={32} height={32} viewBox="0 0 32 32">
    <circle cx={16} cy={10} r={7} fill="none" stroke={color} strokeWidth={2} />
    <rect x={10} y={18} width={12} height={12} rx={4} fill="none" stroke={color} strokeWidth={2} />
  </svg>
);

const EmotionIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={32} height={32} viewBox="0 0 32 32">
    <circle cx={12} cy={14} r={5} fill="none" stroke={color} strokeWidth={1.5} />
    <rect x={8} y={20} width={8} height={10} rx={3} fill="none" stroke={color} strokeWidth={1.5} />
    <circle cx={24} cy={10} r={7} fill="none" stroke={color} strokeWidth={2} />
    <rect x={18} y={18} width={12} height={12} rx={4} fill="none" stroke={color} strokeWidth={2} />
  </svg>
);

const SarcasmIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={32} height={32} viewBox="0 0 32 32">
    <circle cx={10} cy={10} r={6} fill="none" stroke={color} strokeWidth={2} />
    <rect x={6} y={17} width={8} height={13} rx={3} fill="none" stroke={color} strokeWidth={2} />
    <circle cx={24} cy={10} r={6} fill="none" stroke={color} strokeWidth={2} />
    <rect x={20} y={17} width={8} height={13} rx={3} fill="none" stroke={color} strokeWidth={2} />
  </svg>
);

const GroupIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={32} viewBox="0 0 40 32">
    <circle cx={12} cy={10} r={5} fill="none" stroke={color} strokeWidth={1.5} />
    <rect x={8} y={16} width={8} height={10} rx={3} fill="none" stroke={color} strokeWidth={1.5} />
    <circle cx={22} cy={8} r={6} fill="none" stroke={color} strokeWidth={2} />
    <rect x={17} y={15} width={10} height={12} rx={3} fill="none" stroke={color} strokeWidth={2} />
    <circle cx={32} cy={10} r={5} fill="none" stroke={color} strokeWidth={1.5} />
    <rect x={28} y={16} width={8} height={10} rx={3} fill="none" stroke={color} strokeWidth={1.5} />
  </svg>
);

const IconMap: Record<string, React.FC<{ color: string }>> = {
  infant: InfantIcon,
  emotion: EmotionIcon,
  sarcasm: SarcasmIcon,
  group: GroupIcon,
};

// ── Main Scene ──
export const Scene3_EvolutionaryTrust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background color transition from dark to warm
  const bgProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine which node is spotlighted
  let activeSpotlight = -1;
  for (let i = SPOTLIGHT_FRAMES.length - 1; i >= 0; i--) {
    if (frame >= SPOTLIGHT_FRAMES[i] && frame < SPOTLIGHT_FRAMES[i] + 15) {
      activeSpotlight = i;
      break;
    }
  }

  // Evolution text
  const evoTextProgress = spring({
    frame: frame - BEATS.EVOLUTION_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const evoTextY = interpolate(evoTextProgress, [0, 1], [30, 0]);
  const evoTextOpacity = interpolate(evoTextProgress, [0, 1], [0, 1]);

  // Replicated text
  const repTextProgress = spring({
    frame: frame - BEATS.REPLICATED_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const repTextOpacity = interpolate(repTextProgress, [0, 1], [0, 1]);

  // Underline draw
  const underlineProgress = interpolate(
    frame - BEATS.UNDERLINE,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Interpolate bg color via opacity overlay
  const warmOverlay = interpolate(bgProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer
      background="dark"
      style={{
        position: 'relative',
      }}
    >
      {/* Warm background overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#140E08',
          opacity: warmOverlay,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 28,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Evolution text above timeline */}
        {frame >= BEATS.EVOLUTION_TEXT && (
          <div
            style={{
              opacity: evoTextOpacity,
              transform: `translateY(${evoTextY}px)`,
              textAlign: 'center',
            }}
          >
            <ShinyText
              startFrame={BEATS.EVOLUTION_TEXT}
              color={COLORS.historyGold}
              shineColor="#FFFFFF"
              duration={90}
              pauseDuration={60}
              fontSize={52}
              fontWeight={600}
            >
              100,000+ years of evolution
            </ShinyText>
          </div>
        )}

        {/* Evolutionary timeline - vertical layout for mobile */}
        {frame >= BEATS.TIMELINE_START && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 0,
              width: 750,
              position: 'relative',
            }}
          >
            {TIMELINE_NODES.map((node, i) => {
              const nodeProgress = spring({
                frame: frame - node.beatFrame,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const nodeOpacity = interpolate(nodeProgress, [0, 1], [0, 1]);
              const nodeScale = interpolate(nodeProgress, [0, 1], [0.8, 1]);

              // Spotlight effect
              const isSpotlighted = activeSpotlight === i;
              const dimmed = activeSpotlight >= 0 && !isSpotlighted;
              const spotlightScale = isSpotlighted ? 1.15 : 1;
              const spotlightOpacity = dimmed ? 0.4 : 1;

              const IconComp = IconMap[node.iconType];

              // Connector line
              const connectorOpacity = i > 0
                ? interpolate(
                    frame - node.beatFrame,
                    [0, 10],
                    [0, 0.4],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )
                : 0;

              return (
                <React.Fragment key={i}>
                  {/* Connector */}
                  {i > 0 && (
                    <div
                      style={{
                        width: 2,
                        height: 20,
                        backgroundColor: COLORS.techBlue,
                        opacity: connectorOpacity,
                        alignSelf: 'center',
                        marginLeft: 11,
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '16px 24px',
                      borderRadius: 12,
                      opacity: nodeOpacity * spotlightOpacity,
                      transform: `scale(${nodeScale * spotlightScale})`,
                      position: 'relative',
                      backgroundColor: isSpotlighted
                        ? `${node.color}10`
                        : 'transparent',
                    }}
                  >
                    {/* Glow behind for spotlight */}
                    {isSpotlighted && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 36,
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${node.color}1A 0%, transparent 70%)`,
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {/* Dot */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: node.color,
                        flexShrink: 0,
                        boxShadow: isSpotlighted
                          ? `0 0 16px ${node.color}60`
                          : 'none',
                      }}
                    />

                    {/* Icon */}
                    <IconComp color={node.color} />

                    {/* Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span
                        style={{
                          ...TYPOGRAPHY.label,
                          fontSize: 26,
                          color: node.color,
                        }}
                      >
                        {node.time}
                      </span>
                      <span
                        style={{
                          ...TYPOGRAPHY.label,
                          fontSize: 22,
                          color: COLORS.textBody,
                          textTransform: 'none' as const,
                          letterSpacing: 0,
                          fontWeight: 400,
                        }}
                      >
                        {node.label}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* "Replicated in 30 seconds" */}
        {frame >= BEATS.REPLICATED_TEXT && (
          <div
            style={{
              opacity: repTextOpacity,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.errorRed,
              }}
            >
              Replicated in 30 seconds
            </span>

            {/* Underline */}
            {frame >= BEATS.UNDERLINE && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: 0,
                  width: `${underlineProgress * 100}%`,
                  height: 2,
                  backgroundColor: COLORS.errorRed,
                }}
              />
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
