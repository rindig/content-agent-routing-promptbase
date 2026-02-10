import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { EthicsEngineInterface } from '../components/EthicsEngineInterface';
import { ScreenFrame } from '../components/ScreenFrame';
import { AmbientBackground, Vignette } from '../../../compositions/Memory/components/AmbientBackground';

/**
 * COLD OPEN [0:00 - 1:15] (2250 frames at 30fps)
 *
 * Visual journey:
 * 1. Ethics Engine interface fades in quickly, results populate
 * 2. Crossfade to ScreenFrame (video placeholder for real footage)
 * 3. Hold on ScreenFrame while narrator explains
 * 4. "I want to take this apart" - frame deconstructs
 * 5. "...almost none of this is AI" reveal
 *
 * NOTE: The ScreenFrame area is where real screen recordings
 * of the actual Ethics Engine software can be composited in CapCut.
 */
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers (in frames at 30fps)
  const INTERFACE_START = 0;
  const INTERFACE_HOLD = seconds(12);  // Hold on EthicsEngine for ~12 seconds
  const CROSSFADE_START = INTERFACE_HOLD;
  const CROSSFADE_END = INTERFACE_HOLD + seconds(2);  // 2 second crossfade
  const HOLD_END = seconds(60);        // ~1800 frames - video area ends here
  const DECONSTRUCT_START = HOLD_END;
  const DECONSTRUCT_END = HOLD_END + seconds(5);
  const REVEAL_START = DECONSTRUCT_END;

  // EthicsEngine opacity (fades out during crossfade)
  const ethicsOpacity = interpolate(
    frame,
    [CROSSFADE_START, CROSSFADE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ScreenFrame opacity (fades in during crossfade)
  const screenFrameOpacity = interpolate(
    frame,
    [CROSSFADE_START, CROSSFADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Explode progress for ScreenFrame deconstruction
  const explodeProgress = interpolate(
    frame,
    [DECONSTRUCT_START, DECONSTRUCT_END],
    [0, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Final zoom out for reveal
  const scaleOut = interpolate(
    frame,
    [DECONSTRUCT_START, DECONSTRUCT_END],
    [1, 0.85],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Reveal text fade in
  const revealTextOpacity = interpolate(
    frame,
    [REVEAL_START, REVEAL_START + seconds(1)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Background particle color shifts as we approach deconstruction
  const particleColor = frame < DECONSTRUCT_START
    ? COLORS.ethicsAccent
    : COLORS.ai;

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={particleColor}
        particleCount={30}
        gradientDirection="radial"
        gradientColor="#0F0A1A"
      />

      {/* Main content container */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${scaleOut})`,
        }}
      >
        {/* Ethics Engine Interface (quick intro, then fades) */}
        {frame < CROSSFADE_END + 30 && (
          <div
            style={{
              position: 'absolute',
              opacity: ethicsOpacity,
            }}
          >
            <EthicsEngineInterface
              startFrame={INTERFACE_START}
              showResults={true}
              explodeProgress={0}
            />
          </div>
        )}

        {/* Screen Frame (video placeholder) */}
        {frame >= CROSSFADE_START && (
          <div
            style={{
              position: 'absolute',
              opacity: screenFrameOpacity,
            }}
          >
            <ScreenFrame
              startFrame={CROSSFADE_START}
              explodeProgress={explodeProgress}
              showStatusBar={true}
              width={1200}
              height={680}
            />
          </div>
        )}

        {/* Deconstruction visual cues */}
        {explodeProgress > 0.1 && (
          <>
            {/* Separation lines */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: interpolate(explodeProgress, [0.1, 0.5], [0, 400]),
                height: 2,
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}60, transparent)`,
                opacity: interpolate(explodeProgress, [0.1, 0.3], [0, 0.8]),
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: interpolate(explodeProgress, [0.1, 0.5], [0, 400]),
                height: 2,
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}60, transparent)`,
                opacity: interpolate(explodeProgress, [0.1, 0.3], [0, 0.8]),
              }}
            />

            {/* Three-color layer hints appearing */}
            <div
              style={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                padding: '8px 16px',
                backgroundColor: `${COLORS.ai}20`,
                border: `1px solid ${COLORS.ai}50`,
                borderRadius: 8,
                opacity: interpolate(explodeProgress, [0.3, 0.6], [0, 1]),
                transform: `translateX(${interpolate(explodeProgress, [0.3, 0.6], [30, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  color: COLORS.ai,
                  fontWeight: 600,
                }}
              >
                10% AI
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '8%',
                padding: '8px 16px',
                backgroundColor: `${COLORS.orchestration}20`,
                border: `1px solid ${COLORS.orchestration}50`,
                borderRadius: 8,
                opacity: interpolate(explodeProgress, [0.4, 0.7], [0, 1]),
                transform: `translateY(-50%) translateX(${interpolate(explodeProgress, [0.4, 0.7], [30, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  color: COLORS.orchestration,
                  fontWeight: 600,
                }}
              >
                30% Orchestration
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                padding: '8px 16px',
                backgroundColor: `${COLORS.dataProcessing}20`,
                border: `1px solid ${COLORS.dataProcessing}50`,
                borderRadius: 8,
                opacity: interpolate(explodeProgress, [0.5, 0.8], [0, 1]),
                transform: `translateX(${interpolate(explodeProgress, [0.5, 0.8], [30, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  color: COLORS.dataProcessing,
                  fontWeight: 600,
                }}
              >
                60% Data Processing
              </span>
            </div>
          </>
        )}
      </AbsoluteFill>

      {/* Reveal text: "almost none of this is AI" */}
      {frame >= REVEAL_START && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: revealTextOpacity,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.textPrimary,
              textAlign: 'center',
              textShadow: `0 0 40px ${COLORS.background}`,
            }}
          >
            "...almost none of this is{' '}
            <span
              style={{
                color: COLORS.ai,
                textShadow: `0 0 30px ${COLORS.ai}40`,
              }}
            >
              AI
            </span>
            ."
          </div>
        </div>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default ColdOpen;
