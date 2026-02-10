import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { ParsingPipeline } from '../components/ParsingPipeline';
import { ExplodedLayers, RatioBar } from '../components/ExplodedLayers';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * SECTION 4: The Data and The Math [9:30 - 12:00]
 * Duration: 4500 frames (150 seconds)
 *
 * THIS IS THE CLIMAX - THE RATIO REVEAL
 *
 * Visual journey:
 * 1. [0-300] Raw Response - Text bubble with "...rate this a 4..."
 * 2. [300-1500] Parsing Pipeline - Text→Number→Score transformation
 * 3. [1500-2400] Scoring Flow - Reverse scoring, subscale aggregation
 * 4. [2400-3000] Statistics - SciPy, NumPy, decades-old math
 * 5. [3000-4200] THE RATIO REVEAL - ExplodedLayers with 10/30/60 + RatioBar
 * 6. [4200-4500] Let It Land - Hold on the visualization
 *
 * Key message: "AI: 10%. Orchestration: 30%. Data Processing: 60%."
 */
export const Section4DataMath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const RAW_RESPONSE = 0;
  const PARSING_IN = seconds(10);
  const SCORING_IN = seconds(50);
  const STATS_IN = seconds(80);
  const STATS_OUT = seconds(100);
  const RATIO_REVEAL = seconds(100);
  const RATIO_BAR_IN = seconds(130);
  const HOLD = seconds(140);

  // Phase calculations
  const isRawPhase = frame < PARSING_IN;
  const isParsingPhase = frame >= PARSING_IN && frame < STATS_IN;
  const isStatsPhase = frame >= STATS_IN && frame < STATS_OUT;
  const isRatioPhase = frame >= RATIO_REVEAL;

  // Opacity calculations
  const rawOpacity = interpolate(
    frame,
    [RAW_RESPONSE, RAW_RESPONSE + 30, PARSING_IN - 30, PARSING_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const parsingOpacity = interpolate(
    frame,
    [PARSING_IN, PARSING_IN + 30, STATS_IN - 30, STATS_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const statsOpacity = interpolate(
    frame,
    [STATS_IN, STATS_IN + 30, STATS_OUT - 30, STATS_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const ratioOpacity = interpolate(
    frame,
    [RATIO_REVEAL, RATIO_REVEAL + 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Show RatioBar after layers
  const showRatioBar = frame >= RATIO_BAR_IN;
  const ratioBarProgress = spring({
    frame: frame - RATIO_BAR_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={
          isRatioPhase ? COLORS.dataProcessing : COLORS.dataProcessing
        }
        particleCount={30}
        gradientDirection="radial"
        gradientColor="#0A0A10"
      />

      {/* Section title */}
      {!isRatioPhase && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({
                frame: frame - 20,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 24,
              fontWeight: 500,
              color: COLORS.dataProcessing,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            The Data and The Math
          </span>
        </div>
      )}

      {/* Raw Response Phase */}
      {isRawPhase && rawOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: rawOpacity,
          }}
        >
          <div
            style={{
              maxWidth: 700,
              padding: '50px 60px',
              backgroundColor: `${COLORS.ai}10`,
              border: `3px solid ${COLORS.ai}`,
              borderRadius: 20,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
            {/* Scan line */}
            <div style={{ position: 'absolute', top: `${((frame % 60) / 60) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.ai}40, transparent)`, pointerEvents: 'none' }} />
            {/* Floating code snippets */}
            {['text', 'gen', 'tok'].map((text, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 20 + i * 100,
                  top: ((frame * 0.3 + i * 50) % 140) - 20,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 10,
                  color: COLORS.ai,
                  opacity: 0.15,
                }}
              >
                {text}
              </div>
            ))}

            {/* AI badge - inside the box */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                padding: '6px 14px',
                backgroundColor: COLORS.ai,
                borderRadius: 6,
                boxShadow: `0 0 10px ${COLORS.ai}60`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 11,
                  fontWeight: 700,
                  color: COLORS.background,
                }}
              >
                AI Response
              </span>
            </div>

            <div
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 28,
                color: COLORS.textPrimary,
                lineHeight: 1.6,
                marginTop: 20,
              }}
            >
              "I would rate this statement a{' '}
              <span
                style={{
                  color: COLORS.dataProcessing,
                  fontWeight: 700,
                  backgroundColor: `${COLORS.dataProcessing}30`,
                  padding: '4px 12px',
                  borderRadius: 8,
                  boxShadow: `0 0 15px ${COLORS.dataProcessing}40`,
                  animation: 'pulse 2s infinite',
                }}
              >
                4
              </span>{' '}
              on a scale of 1 to 5."
            </div>
          </div>

          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({ frame: frame - 60, fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 22, color: COLORS.textMuted }}>
              The model's response is a{' '}
            </span>
            <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 22, color: COLORS.ai, fontWeight: 600 }}>
              string
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Parsing Pipeline Phase */}
      {isParsingPhase && parsingOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: parsingOpacity,
          }}
        >
          <ParsingPipeline
            startFrame={PARSING_IN}
            showFullPipeline={true}
            showScoring={frame >= SCORING_IN}
            scale={0.9}
          />
        </AbsoluteFill>
      )}

      {/* Stats Phase */}
      {isStatsPhase && statsOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: statsOpacity,
          }}
        >
          <ParsingPipeline
            startFrame={STATS_IN}
            showStats={true}
            scale={0.95}
          />
        </AbsoluteFill>
      )}

      {/* THE RATIO REVEAL */}
      {isRatioPhase && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: ratioOpacity,
          }}
        >
          {/* Title */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - RATIO_REVEAL - 20,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              So here's what it actually looks like
            </span>
          </div>

          {/* Exploded Layers */}
          <div
            style={{
              marginTop: showRatioBar ? -60 : 0,
              transition: 'margin-top 0.5s',
            }}
          >
            <ExplodedLayers
              startFrame={RATIO_REVEAL}
              explodeAmount={0.85}
              showPercentages={true}
              scale={showRatioBar ? 0.75 : 0.85}
            />
          </div>

          {/* Ratio Bar */}
          {showRatioBar && (
            <div
              style={{
                position: 'absolute',
                bottom: 140,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: interpolate(ratioBarProgress, [0, 1], [0, 1]),
              }}
            >
              <RatioBar
                startFrame={RATIO_BAR_IN}
                width={800}
                height={60}
                showLabels={true}
              />
            </div>
          )}

          {/* Final annotation */}
          {frame >= HOLD && (
            <div
              style={{
                position: 'absolute',
                bottom: 50,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: interpolate(
                  spring({
                    frame: frame - HOLD,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.textMuted,
                }}
              >
                The AI:{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.ai,
                  fontWeight: 600,
                }}
              >
                receive prompt, generate text
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.textMuted,
                }}
              >
                . Everything else?{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.dataProcessing,
                  fontWeight: 600,
                }}
              >
                Traditional software.
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default Section4DataMath;
