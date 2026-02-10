import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { FullStack } from '../components/FullStack';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * CLOSE [15:00 - 16:00]
 * Duration: 1800 frames (60 seconds)
 *
 * Visual journey:
 * 1. [0-900] Full Picture - Complete stack with Ethics Engine at top
 * 2. [900-1350] Each Part Glows - AI, orchestration, data processing glow in sequence
 * 3. [1350-1800] Final Statement - All glows fade, hold, fade to black
 *
 * Key message: "That is not less impressive than magic. It is more impressive.
 *              Because you can actually understand it. And because it actually works."
 */
export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const FULL_PICTURE = 0;
  const AI_GLOW = seconds(30);
  const ORCH_GLOW = seconds(35);
  const DATA_GLOW = seconds(40);
  const ALL_FADE = seconds(45);
  const FINAL_HOLD = seconds(50);
  const FADE_OUT = seconds(55);

  // Calculate which layers are glowing
  const getGlowingLayers = (): string[] => {
    if (frame >= ALL_FADE) return [];
    if (frame >= DATA_GLOW) return ['ai', 'runtime', 'highlevel', 'system', 'assembly', 'machine', 'transistors', 'electrons', 'quantum'];
    if (frame >= ORCH_GLOW) return ['ai', 'runtime', 'highlevel'];
    if (frame >= AI_GLOW) return ['ai'];
    return [];
  };

  // Opacity for fade out
  const fadeOutOpacity = interpolate(
    frame,
    [FADE_OUT, FADE_OUT + seconds(5)],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Stack entrance
  const stackProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOutOpacity,
      }}
    >
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.ethicsAccent}
        particleCount={30}
        gradientDirection="radial"
        gradientColor="#0A0810"
      />

      {/* Main content */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FullStack
          startFrame={0}
          buildSequence={false}
          showAgentColors={false}
          showEthicsEngine={true}
          glowingLayers={getGlowingLayers()}
          scale={0.75}
        />
      </AbsoluteFill>

      {/* Glow phase annotations */}
      {frame >= AI_GLOW && frame < ALL_FADE && (
        <div
          style={{
            position: 'absolute',
            right: 100,
            top: '30%',
            opacity: interpolate(
              spring({ frame: frame - AI_GLOW, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div
            style={{
              position: 'relative',
              padding: '14px 24px',
              backgroundColor: `${COLORS.ai}15`,
              border: `2px solid ${COLORS.ai}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: `${((frame % 40) / 40) * 100}%`, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${COLORS.ai}40, transparent)`, pointerEvents: 'none' }} />
            {/* Type badge */}
            <div style={{ position: 'absolute', top: 4, right: 4, padding: '2px 6px', backgroundColor: COLORS.ai, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>AI</div>
            <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 16, color: COLORS.ai }}>
              AI does what AI is good at
            </span>
          </div>
        </div>
      )}

      {frame >= ORCH_GLOW && frame < ALL_FADE && (
        <div
          style={{
            position: 'absolute',
            right: 100,
            top: '45%',
            opacity: interpolate(
              spring({ frame: frame - ORCH_GLOW, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div
            style={{
              position: 'relative',
              padding: '14px 24px',
              backgroundColor: `${COLORS.orchestration}15`,
              border: `2px solid ${COLORS.orchestration}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: `${((frame % 40) / 40) * 100}%`, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${COLORS.orchestration}40, transparent)`, pointerEvents: 'none' }} />
            {/* Type badge */}
            <div style={{ position: 'absolute', top: 4, right: 4, padding: '2px 6px', backgroundColor: COLORS.orchestration, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>CODE</div>
            <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 16, color: COLORS.orchestration }}>
              Code does what code has always done
            </span>
          </div>
        </div>
      )}

      {frame >= DATA_GLOW && frame < ALL_FADE && (
        <div
          style={{
            position: 'absolute',
            right: 100,
            top: '60%',
            opacity: interpolate(
              spring({ frame: frame - DATA_GLOW, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div
            style={{
              position: 'relative',
              padding: '14px 24px',
              backgroundColor: `${COLORS.dataProcessing}15`,
              border: `2px solid ${COLORS.dataProcessing}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.dataProcessing}`, borderLeft: `2px solid ${COLORS.dataProcessing}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.dataProcessing}`, borderRight: `2px solid ${COLORS.dataProcessing}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.dataProcessing}`, borderLeft: `2px solid ${COLORS.dataProcessing}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.dataProcessing}`, borderRight: `2px solid ${COLORS.dataProcessing}`, opacity: 0.6 }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', left: `${((frame % 40) / 40) * 100}%`, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${COLORS.dataProcessing}40, transparent)`, pointerEvents: 'none' }} />
            {/* Type badge */}
            <div style={{ position: 'absolute', top: 4, right: 4, padding: '2px 6px', backgroundColor: COLORS.dataProcessing, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>DATA</div>
            <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 16, color: COLORS.dataProcessing }}>
              Math does what math has always done
            </span>
          </div>
        </div>
      )}

      {/* Final statement */}
      {frame >= FINAL_HOLD && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({
                frame: frame - FINAL_HOLD,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 28,
              fontWeight: 500,
              color: COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            That is not less impressive than magic.
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 28,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            It is{' '}
            <span
              style={{
                color: COLORS.ethicsAccent,
              }}
            >
              more
            </span>{' '}
            impressive.
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 20,
              color: COLORS.textMuted,
              marginTop: 20,
            }}
          >
            Because you can actually understand it. And because it actually works.
          </div>
        </div>
      )}

      <Vignette intensity={0.6} />
    </AbsoluteFill>
  );
};

export default Close;
