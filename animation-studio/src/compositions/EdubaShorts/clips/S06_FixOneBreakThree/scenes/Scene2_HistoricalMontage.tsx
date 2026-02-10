import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText, ShinyText } from '../../../../../components/core/effects';
import { HistoricalPanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 2: Historical Montage — Same Pattern at Every Layer
 * Duration: 270 frames (9 seconds)
 *
 * Three HistoricalPanels (1950s compiler, 1970s OS, 1990s network) showing same failure pattern.
 */

const BEATS = {
  // Era 1: Compilers
  ERA1_IN: 0,
  ERA1_PANEL: 5,
  ERA1_DIAGRAM: 15,
  ERA1_ERROR_BADGE: 35,
  ERA1_CAPTION: 50,
  ERA1_FADE: 75,
  // Era 2: Operating Systems
  ERA2_IN: 85,
  ERA2_PANEL: 90,
  ERA2_PROCESS_A: 100,
  ERA2_PROCESS_B: 110,
  ERA2_CRASH_LINE: 122,
  ERA2_CRASH: 125,
  ERA2_CAPTION: 140,
  ERA2_FADE: 160,
  // Era 3: Networking
  ERA3_IN: 170,
  ERA3_PANEL: 175,
  ERA3_PACKETS_IN: 185,
  ERA3_PACKET_SCRAMBLE: 210,
  ERA3_CAPTION: 230,
  ERA3_FADE: 250,
  // Bridge
  BRIDGE_TEXT: 258,
};

// ---- Layer Diagram (inline) ----
const LayerDiagram: React.FC<{
  label: string;
  inputLabel: string;
  outputLabel: string;
  errorLabel?: string;
  layerColor: string;
  startFrame: number;
  showError?: boolean;
}> = ({ label, inputLabel, outputLabel, errorLabel, layerColor, startFrame, showError }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  // Input arrow
  const inputProgress = interpolate(rel, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Layer box
  const boxProgress = spring({
    frame: rel - 3,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const boxScale = interpolate(boxProgress, [0, 1], [0.8, 1]);
  const boxOpacity = interpolate(boxProgress, [0, 1], [0, 1]);

  // Output arrow
  const outputProgress = interpolate(rel, [15, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Error badge
  const errorStart = 20;
  const errorProgress = spring({
    frame: rel - errorStart,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const errorScale = interpolate(errorProgress, [0, 1], [0, 1]);
  const errorOpacity = interpolate(errorProgress, [0, 1], [0, 1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Input label + arrow */}
      <div
        style={{
          opacity: inputProgress,
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.textMuted,
        }}
      >
        {inputLabel}
      </div>
      <svg width={2} height={30} style={{ opacity: inputProgress }}>
        <line x1={1} y1={0} x2={1} y2={30} stroke={COLORS.textDim} strokeWidth={2} />
      </svg>

      {/* Layer box with error badge */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: 700,
            maxWidth: '100%',
            height: 90,
            borderRadius: 16,
            backgroundColor: `${layerColor}1A`,
            border: `1px solid ${layerColor}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: boxOpacity,
            transform: `scale(${boxScale})`,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.body,
              fontSize: 40,
              color: layerColor,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
        </div>

        {/* Error badge */}
        {showError && errorLabel && (
          <div
            style={{
              position: 'absolute',
              right: -8,
              top: -10,
              backgroundColor: 'rgba(239,68,68,0.15)',
              border: `1px solid ${COLORS.errorRed}`,
              borderRadius: 8,
              padding: '4px 12px',
              opacity: errorOpacity,
              transform: `scale(${errorScale})`,
              boxShadow: `0 0 12px ${COLORS.glowRed}`,
            }}
          >
            <span style={{ ...TYPOGRAPHY.label, fontSize: 20, color: COLORS.errorRed }}>
              {errorLabel}
            </span>
          </div>
        )}
      </div>

      {/* Output arrow + label */}
      <svg width={2} height={30} style={{ opacity: outputProgress }}>
        <line x1={1} y1={0} x2={1} y2={30} stroke={COLORS.textDim} strokeWidth={2} />
      </svg>
      <div
        style={{
          opacity: outputProgress,
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.textMuted,
        }}
      >
        {outputLabel}
      </div>
    </div>
  );
};

// ---- Process Boxes for Era 2 ----
const ProcessBoxes: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const processAProgress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const processBProgress = spring({
    frame: rel - 10,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Crash effect
  const crashFrame = BEATS.ERA2_CRASH - startFrame;
  const isCrashing = rel >= crashFrame;

  const aBorderColor = isCrashing
    ? COLORS.errorRed
    : COLORS.techBlue;

  const bBorderColor = isCrashing
    ? interpolate(
        rel,
        [crashFrame, crashFrame + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5
      ? COLORS.errorRed
      : COLORS.techBlue
    : COLORS.techBlue;

  // Crash line
  const crashLineFrame = BEATS.ERA2_CRASH_LINE - startFrame;
  const crashLineProgress = interpolate(
    rel,
    [crashLineFrame, crashLineFrame + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // X overlay on process A
  const xDrawProgress = isCrashing
    ? interpolate(rel, [crashFrame, crashFrame + 8], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Process A */}
      <div
        style={{
          width: 500,
          maxWidth: '100%',
          height: 70,
          borderRadius: 12,
          backgroundColor: COLORS.bgSurface,
          border: `1.5px solid ${aBorderColor}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: interpolate(processAProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(processAProgress, [0, 1], [0.9, 1])})`,
          position: 'relative',
        }}
      >
        <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color: COLORS.textBody }}>
          Process A
        </span>
        {/* X overlay */}
        {isCrashing && (
          <svg
            width={40}
            height={40}
            style={{ position: 'absolute', right: 16 }}
          >
            <line
              x1={5}
              y1={5}
              x2={35}
              y2={35}
              stroke={COLORS.errorRed}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={42}
              strokeDashoffset={42 * (1 - xDrawProgress)}
            />
            <line
              x1={35}
              y1={5}
              x2={5}
              y2={35}
              stroke={COLORS.errorRed}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={42}
              strokeDashoffset={42 * (1 - xDrawProgress)}
            />
          </svg>
        )}
      </div>

      {/* Crash propagation line */}
      <svg width={2} height={30}>
        <line
          x1={1}
          y1={0}
          x2={1}
          y2={30}
          stroke={COLORS.errorRed}
          strokeWidth={2}
          strokeDasharray="4 4"
          opacity={crashLineProgress}
        />
      </svg>

      {/* Process B */}
      <div
        style={{
          width: 500,
          maxWidth: '100%',
          height: 70,
          borderRadius: 12,
          backgroundColor: COLORS.bgSurface,
          border: `1.5px solid ${bBorderColor}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: interpolate(processBProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(processBProgress, [0, 1], [0.9, 1])})`,
        }}
      >
        <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color: COLORS.textBody }}>
          Process B
        </span>
      </div>
    </div>
  );
};

// ---- Packet Visualization for Era 3 ----
const PacketVisualization: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const packets = [1, 2, 3, 4, 5];
  const scrambleFrame = BEATS.ERA3_PACKET_SCRAMBLE - startFrame;
  const isScrambled = rel >= scrambleFrame;

  // When scrambled, packets 2 and 4 swap positions
  const getPacketOffset = (index: number) => {
    if (!isScrambled) return 0;
    const scrambleProgress = spring({
      frame: rel - scrambleFrame,
      fps,
      config: SPRING_CONFIGS.snappy,
    });
    if (index === 1) return interpolate(scrambleProgress, [0, 1], [0, 2 * 90]); // Packet 2 moves to position 4
    if (index === 3) return interpolate(scrambleProgress, [0, 1], [0, -2 * 90]); // Packet 4 moves to position 2
    return 0;
  };

  const isCorrupted = (index: number) => isScrambled && index === 2;
  const isMoved = (index: number) => isScrambled && (index === 1 || index === 3);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        position: 'relative',
      }}
    >
      {packets.map((num, i) => {
        const packetProgress = spring({
          frame: rel - i * 6,
          fps,
          config: SPRING_CONFIGS.gentle,
        });

        const scale = interpolate(packetProgress, [0, 1], [0, 1]);
        const opacity = interpolate(packetProgress, [0, 1], [0, 1]);
        const translateX = getPacketOffset(i);

        const borderColor = isMoved(i) || isCorrupted(i)
          ? COLORS.errorRed
          : COLORS.techBlue;

        return (
          <div
            key={i}
            style={{
              width: 80,
              height: 55,
              borderRadius: 8,
              backgroundColor: COLORS.bgSurface,
              border: `1.5px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity,
              transform: `scale(${scale}) translateX(${translateX}px)`,
            }}
          >
            {isCorrupted(i) ? (
              <GlitchText
                startFrame={BEATS.ERA3_PACKET_SCRAMBLE}
                intensity={0.5}
                speed={5}
                color={COLORS.errorRed}
                fontSize={28}
                fontFamily={TYPOGRAPHY.code.fontFamily}
                fontWeight={TYPOGRAPHY.code.fontWeight}
                backgroundColor="transparent"
              >
                ??
              </GlitchText>
            ) : (
              <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color: COLORS.textBody }}>
                {num}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Scene2_HistoricalMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Era visibility
  const era1Opacity = interpolate(
    frame,
    [BEATS.ERA1_FADE, BEATS.ERA1_FADE + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const era2Enter = interpolate(
    frame,
    [BEATS.ERA2_IN, BEATS.ERA2_IN + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const era2Opacity = interpolate(
    frame,
    [BEATS.ERA2_FADE, BEATS.ERA2_FADE + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * era2Enter;

  const era3Enter = interpolate(
    frame,
    [BEATS.ERA3_IN, BEATS.ERA3_IN + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const era3Opacity = interpolate(
    frame,
    [BEATS.ERA3_FADE, BEATS.ERA3_FADE + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  ) * era3Enter;

  // Bridge text
  const bridgeOpacity = interpolate(
    frame,
    [BEATS.BRIDGE_TEXT, BEATS.BRIDGE_TEXT + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Caption progress helpers
  const era1CaptionOpacity = interpolate(
    frame,
    [BEATS.ERA1_CAPTION, BEATS.ERA1_CAPTION + 12],
    [0, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const era2CaptionOpacity = interpolate(
    frame,
    [BEATS.ERA2_CAPTION, BEATS.ERA2_CAPTION + 12],
    [0, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const era3CaptionOpacity = interpolate(
    frame,
    [BEATS.ERA3_CAPTION, BEATS.ERA3_CAPTION + 12],
    [0, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Background warm overlay for historical segments
  const warmOverlay = frame < BEATS.BRIDGE_TEXT ? 0.2 : 0;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={265}
      fadeOutDuration={5}
    >
      {/* Warm overlay for historical feel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.bgWarm,
          opacity: warmOverlay,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 20,
        }}
      >
        {/* Era 1: Compilers (frames 0-85) */}
        {frame < BEATS.ERA2_IN && (
          <div
            style={{
              opacity: era1Opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              width: '100%',
            }}
          >
            <HistoricalPanel
              year="1950s"
              label="Compilers"
              badgeColor={COLORS.historyGold}
              startFrame={BEATS.ERA1_PANEL}
            >
              <LayerDiagram
                label="COMPILER"
                inputLabel="Your Code"
                outputLabel="Machine Code"
                errorLabel="New Bug Introduced"
                layerColor={COLORS.historyGold}
                startFrame={BEATS.ERA1_DIAGRAM}
                showError
              />
            </HistoricalPanel>

            <div
              style={{
                opacity: era1CaptionOpacity,
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.errorRed,
                textAlign: 'center',
              }}
            >
              Errors that weren't in the original
            </div>
          </div>
        )}

        {/* Era 2: Operating Systems (frames 85-170) */}
        {frame >= BEATS.ERA2_IN && frame < BEATS.ERA3_IN && (
          <div
            style={{
              opacity: era2Opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              width: '100%',
            }}
          >
            <HistoricalPanel
              year="1970s"
              label="Operating Systems"
              badgeColor={COLORS.historyGold}
              startFrame={BEATS.ERA2_PANEL}
            >
              <ProcessBoxes startFrame={BEATS.ERA2_PROCESS_A} />
            </HistoricalPanel>

            <div
              style={{
                opacity: era2CaptionOpacity,
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.errorRed,
                textAlign: 'center',
              }}
            >
              One process crashes another
            </div>
          </div>
        )}

        {/* Era 3: Networking (frames 170-260) */}
        {frame >= BEATS.ERA3_IN && frame < BEATS.BRIDGE_TEXT && (
          <div
            style={{
              opacity: era3Opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              width: '100%',
            }}
          >
            <HistoricalPanel
              year="1990s"
              label="Networking"
              badgeColor={COLORS.historyGold}
              startFrame={BEATS.ERA3_PANEL}
            >
              <PacketVisualization startFrame={BEATS.ERA3_PACKETS_IN} />
            </HistoricalPanel>

            <div
              style={{
                opacity: era3CaptionOpacity,
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.errorRed,
                textAlign: 'center',
              }}
            >
              Data arrives corrupted
            </div>
          </div>
        )}

        {/* Bridge Text */}
        {frame >= BEATS.BRIDGE_TEXT && (
          <div style={{ opacity: bridgeOpacity, textAlign: 'center' }}>
            <ShinyText
              startFrame={BEATS.BRIDGE_TEXT}
              color={COLORS.textPrimary}
              shineColor={COLORS.insightOrange}
              fontSize={48}
              fontWeight={600}
              duration={40}
            >
              Every layer. Same pattern.
            </ShinyText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
