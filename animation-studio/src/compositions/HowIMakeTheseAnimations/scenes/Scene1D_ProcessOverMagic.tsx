/**
 * Scene 1D: The Promise - Process Over Magic
 * [0:28 - 0:45] — 510 frames
 *
 * "So I want to show you exactly how this actually works. Not the polished
 *  result, but the process. And what you'll find isn't magic. It's infrastructure.
 *  It's documentation and specifications and component libraries..."
 *
 * Visual: Transform from hype to honest technical reality
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
import { GlitchText, ShinyText } from '../../../components/core/effects';

// Timeline markers
const PHASE = {
  GHOST_CLEAR: 0,
  SHOW_EXACTLY: 0,
  SPLIT_CONCEPT: 60,
  MAGIC_SHATTER: 120,
  FILE_TREE: 150,
  SYSTEM_PANELS: 210,
  BRIDGE_STATEMENT: 300,
  EMPOWERMENT: 390,
};

// SVG Icons
const FolderIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DiamondIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 9L12 22L22 9L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 9H22"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2L8 9L12 22L16 9L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
);

const GearIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
    <path
      d="M12 1V3M12 21V23M23 12H21M3 12H1M20.07 3.93L18.66 5.34M5.34 18.66L3.93 20.07M20.07 20.07L18.66 18.66M5.34 5.34L3.93 3.93"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SparkleIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={`${color}30`}
    />
  </svg>
);

// File tree data
const FILE_TREE = [
  { indent: 0, isFolder: true, name: 'docs/', color: COLORS.spec },
  { indent: 1, isFolder: false, prefix: '├──', name: 'visual-philosophy.md', color: COLORS.textMuted },
  { indent: 1, isFolder: false, prefix: '├──', name: 'style-guide.md', color: COLORS.textMuted },
  { indent: 1, isFolder: false, prefix: '└──', name: 'component-registry.md', color: COLORS.textMuted },
  { indent: 0, isFolder: true, name: 'src/', color: COLORS.build },
  { indent: 1, isFolder: false, prefix: '└──', name: 'components/', color: COLORS.textMuted },
];

interface SystemPanelProps {
  title: string;
  color: string;
  startFrame: number;
  badge: string;
}

const SystemPanel: React.FC<SystemPanelProps> = ({ title, color, startFrame, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;

  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [20, 0]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);

  // Scan line
  const scanPosition = ((frame % 50) / 50) * 100;

  // Pulse
  const pulseOpacity = Math.sin(frame * 0.06) * 0.15 + 0.5;

  if (adjustedFrame < 0) return null;

  return (
    <div
      style={{
        width: 320,
        padding: '24px 32px',
        backgroundColor: `${color}12`,
        border: `2px solid ${color}`,
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {/* Corner brackets */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 12,
          height: 12,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
          opacity: pulseOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 12,
          height: 12,
          borderBottom: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
          opacity: pulseOpacity,
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanPosition}%`,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />

      {/* Type badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '3px 8px',
          backgroundColor: color,
          borderRadius: 4,
          fontSize: 11,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontWeight: 700,
          color: COLORS.background,
        }}
      >
        {badge}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: SIZES.label,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: color,
          marginTop: 8,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const Scene1D_ProcessOverMagic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === "So I want to show you exactly" ===
  const showExactlyEntrance = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const showExactlyOpacity = interpolate(showExactlyEntrance, [0, 1], [0, 1]);
  const showExactlyFade = interpolate(
    frame,
    [PHASE.SPLIT_CONCEPT - 15, PHASE.SPLIT_CONCEPT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Split concept (Polished Result vs The Process) ===
  const splitEntrance = spring({
    frame: frame - PHASE.SPLIT_CONCEPT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const splitOpacity = interpolate(splitEntrance, [0, 1], [0, 1]);
  const splitFade = interpolate(
    frame,
    [PHASE.MAGIC_SHATTER - 15, PHASE.MAGIC_SHATTER],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Left dims, right illuminates
  const leftDim = interpolate(
    frame,
    [PHASE.SPLIT_CONCEPT + 30, PHASE.SPLIT_CONCEPT + 60],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const rightBright = interpolate(
    frame,
    [PHASE.SPLIT_CONCEPT + 30, PHASE.SPLIT_CONCEPT + 60],
    [0.6, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Magic shatters ===
  const isMagicGlitching = frame >= PHASE.MAGIC_SHATTER && frame < PHASE.MAGIC_SHATTER + 30;
  const magicShattered = frame >= PHASE.MAGIC_SHATTER + 30;

  const magicOpacity = interpolate(
    frame,
    [PHASE.MAGIC_SHATTER, PHASE.MAGIC_SHATTER + 30],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === File tree ===
  const fileTreeVisible = frame >= PHASE.FILE_TREE;

  // === System panels ===
  const panelsVisible = frame >= PHASE.SYSTEM_PANELS;

  // Panels shrink when bridge appears
  const panelsShrink = interpolate(
    frame,
    [PHASE.BRIDGE_STATEMENT, PHASE.BRIDGE_STATEMENT + 30],
    [1, 0.75],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const panelsY = interpolate(
    frame,
    [PHASE.BRIDGE_STATEMENT, PHASE.BRIDGE_STATEMENT + 30],
    [0, -80],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Bridge statement ===
  const bridgeEntrance = spring({
    frame: frame - PHASE.BRIDGE_STATEMENT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const bridgeOpacity = interpolate(bridgeEntrance, [0, 1], [0, 1]);

  // === Empowerment close ===
  const empowerEntrance = spring({
    frame: frame - PHASE.EMPOWERMENT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const empowerOpacity = interpolate(empowerEntrance, [0, 1], [0, 1]);

  // "yourself" glow
  const yourselfGlow = frame >= PHASE.EMPOWERMENT + 60
    ? Math.sin((frame - PHASE.EMPOWERMENT - 60) * 0.08) * 8 + 12
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* "So I want to show you exactly how this actually works" */}
      {frame < PHASE.SPLIT_CONCEPT + 30 && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: showExactlyOpacity * showExactlyFade,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: SIZES.title,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.text,
            }}
          >
            So I want to show you{' '}
            <ShinyText
              color={COLORS.textMuted}
              shineColor={COLORS.textBright}
              duration={45}
              style={{
                fontSize: SIZES.title,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontWeight: 600,
              }}
            >
              exactly
            </ShinyText>
            {' '}how this actually works.
          </span>
        </div>
      )}

      {/* Split concept: Polished Result vs The Process */}
      {frame >= PHASE.SPLIT_CONCEPT && frame < PHASE.MAGIC_SHATTER + 30 && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 80,
            opacity: splitOpacity * splitFade,
          }}
        >
          {/* Left: Polished Result (fading) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: leftDim,
            }}
          >
            <DiamondIcon color={COLORS.textMuted} size={40} />
            <span
              style={{
                fontSize: SIZES.body,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.textMuted,
              }}
            >
              Polished Result
            </span>
          </div>

          {/* Divider line */}
          <div
            style={{
              width: 2,
              height: 80,
              backgroundColor: COLORS.textDim,
              opacity: 0.3,
            }}
          />

          {/* Right: The Process (brightening) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: rightBright,
            }}
          >
            <GearIcon color={COLORS.text} size={40} />
            <span
              style={{
                fontSize: SIZES.body,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.text,
                fontWeight: 600,
              }}
            >
              The Process
            </span>
          </div>
        </div>
      )}

      {/* "magic" that shatters */}
      {frame >= PHASE.MAGIC_SHATTER - 30 && frame < PHASE.FILE_TREE && (
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: magicOpacity,
          }}
        >
          {isMagicGlitching ? (
            <GlitchText
              intensity={2}
              speed={1}
              enableShadows
              color={COLORS.textBright}
              backgroundColor={COLORS.background}
              fontSize={SIZES.hero}
              fontWeight={800}
              fontFamily={TYPOGRAPHY.display.fontFamily}
            >
              magic
            </GlitchText>
          ) : (
            <span
              style={{
                fontSize: SIZES.hero,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 800,
                color: COLORS.textBright,
              }}
            >
              magic
            </span>
          )}
        </div>
      )}

      {/* File tree emerging from shattered magic */}
      {fileTreeVisible && frame < PHASE.SYSTEM_PANELS + 60 && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: SIZES.code,
          }}
        >
          {FILE_TREE.map((item, index) => {
            const itemDelay = PHASE.FILE_TREE + index * 8;
            const itemEntrance = spring({
              frame: frame - itemDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const itemOpacity = interpolate(itemEntrance, [0, 1], [0, 1]);
            const itemX = interpolate(itemEntrance, [0, 1], [20, 0]);

            // Fade out when panels appear
            const fadeOut = interpolate(
              frame,
              [PHASE.SYSTEM_PANELS, PHASE.SYSTEM_PANELS + 30],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  marginLeft: item.indent * 24,
                  opacity: itemOpacity * fadeOut,
                  transform: `translateX(${itemX}px)`,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {item.isFolder ? (
                  <FolderIcon color={item.color} size={18} />
                ) : (
                  <span style={{ color: COLORS.textDim, width: 28, fontFamily: TYPOGRAPHY.code.fontFamily }}>
                    {item.prefix}
                  </span>
                )}
                <span style={{ color: item.color }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* System panels: DOCUMENTATION, SPECIFICATIONS, COMPONENT LIBRARIES */}
      {panelsVisible && (
        <div
          style={{
            position: 'absolute',
            top: '28%',
            left: '50%',
            transform: `translateX(-50%) translateY(${panelsY}px) scale(${panelsShrink})`,
            display: 'flex',
            gap: 24,
          }}
        >
          <SystemPanel
            title="DOCUMENTATION"
            color={COLORS.spec}
            startFrame={PHASE.SYSTEM_PANELS}
            badge="SPEC"
          />
          <SystemPanel
            title="SPECIFICATIONS"
            color={COLORS.spec}
            startFrame={PHASE.SYSTEM_PANELS + 15}
            badge="SPEC"
          />
          <SystemPanel
            title="COMPONENT LIBRARIES"
            color={COLORS.build}
            startFrame={PHASE.SYSTEM_PANELS + 30}
            badge="CODE"
          />
        </div>
      )}

      {/* Bridge statement: software engineering → creative problem */}
      {frame >= PHASE.BRIDGE_STATEMENT && (
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: bridgeOpacity,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <span
            style={{
              fontSize: SIZES.body,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              color: COLORS.build,
            }}
          >
            {'{ }'}
          </span>
          <span
            style={{
              fontSize: SIZES.subtext,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
            }}
          >
            software engineering
          </span>

          {/* Arrow */}
          <svg width="60" height="24" viewBox="0 0 60 24">
            <defs>
              <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.build} />
                <stop offset="100%" stopColor={COLORS.refine} />
              </linearGradient>
            </defs>
            <path
              d="M5 12 L45 12 M38 6 L48 12 L38 18"
              stroke="url(#arrowGrad)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: interpolate(bridgeOpacity, [0, 1], [60, 0]),
              }}
            />
          </svg>

          <span
            style={{
              fontSize: SIZES.subtext,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.text,
            }}
          >
            creative problem
          </span>
          <SparkleIcon color={COLORS.refine} size={28} />
        </div>
      )}

      {/* Empowerment close */}
      {frame >= PHASE.EMPOWERMENT && (
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: empowerOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: SIZES.subtext,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
            }}
          >
            you'll understand how I make these
          </span>
          <span
            style={{
              fontSize: SIZES.title,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 700,
              color: COLORS.possibility,
              textShadow: `0 0 ${yourselfGlow}px ${COLORS.possibility}60`,
            }}
          >
            you could do it yourself
          </span>
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene1D_ProcessOverMagic;
