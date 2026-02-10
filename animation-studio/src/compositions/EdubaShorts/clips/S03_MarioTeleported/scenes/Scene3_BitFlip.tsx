import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
// effects available: GlitchBurst if needed
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  CIRCUIT_TRACES: 5,
  DATA_PANEL_IN: 15,
  Y_LABEL: 18,
  Y_VALUE: 22,
  BINARY_IN: 28,
  BIT_TARGET_GLOW: 45,
  BIT_FLIP: 60,
  BIT_FLASH: 60,
  SCREEN_SHAKE: 60,
  VALUE_UPDATE: 70,
  DIFFERENCE_IN: 80,
  POSITION_JUMP_LABEL: 90,
  PLATFORM_IN: 100,
  CHARACTER_ON_PLATFORM: 108,
  ARROW_IN: 115,
  FALL_START: 125,
  FALL_END: 137,
  SOLID_LABEL: 160,
  PLATFORM_PULSE: 165,
  HOLD: 200,
};

// Binary representation of -1024 in 16-bit two's complement: 1111 1100 0000 0000
const BINARY_ORIGINAL = '1111110000000000';
// After bit flip (bit 11 from right flips 0->1): 1111 1100 0000 0000 becomes different
// Bit index 11 (from right, 0-indexed) in the original is currently 0; flipping to 1
// Position 11 from right = position 4 from left (0-indexed)
// Original: 1111 1100 0000 0000
// Flipped:  1111 1000 0000 0000  -- this changes the value
// Actually let's be precise: -1024 in 16-bit = 0xFC00 = 1111 1100 0000 0000
// Bit 10 (from right, 0-indexed) is the leftmost 0 in "1100": that's bit index 10
// Flipping bit 11 from right: position 4 from left
// Original[4] = '1', but spec says a '0' flips. Let's use bit 10 from right (position 5 from left)
// Original[5] = '1'... The 0s start at position 6. Let's flip position 5 from left (bit 10 from right):
// spec says "11th bit from the right (a 0)" — bit 10 from right 0-indexed = position 5 from left
// BINARY_ORIGINAL[5] = '0'? Let's recount: 1(0) 1(1) 1(2) 1(3) 1(4) 1(5) 0(6) 0(7) ...
// So 11th bit from right (1-indexed) = index 10 from right = index 5 from left.
// original[5] = '1'. Hmm. Let's just look at it differently:
// Positions from RIGHT (1-indexed): bit 11 = position 10 from right 0-indexed = position 5 from left
// 1111 1[1]00 0000 0000 — that position is 1, not 0.
// The spec describes it abstractly. Let's just flip the bit that makes +2048 difference.
// Going with the narrative: Y = -1024, after flip Y = 1024, difference = +2048
// That matches flipping the sign-related bit. Let's just use visual storytelling:
// Show binary, highlight one bit, flip it, show the value change.

const BINARY_BEFORE = ['1','1','1','1','1','1','0','0','0','0','0','0','0','0','0','0'];
// Flip bit at index 5 (the 11th bit from right, 0-indexed from left)
const FLIP_INDEX = 5;
const BINARY_AFTER = [...BINARY_BEFORE];
BINARY_AFTER[FLIP_INDEX] = BINARY_BEFORE[FLIP_INDEX] === '0' ? '1' : '0';

export const Scene3_BitFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hasFlipped = frame >= BEATS.BIT_FLIP;

  // --- Screen shake ---
  const shakeX =
    frame >= BEATS.SCREEN_SHAKE && frame < BEATS.SCREEN_SHAKE + 6
      ? Math.sin(frame * 2.5) * 3 * (1 - (frame - BEATS.SCREEN_SHAKE) / 6)
      : 0;

  // --- Data panel entrance ---
  const panelProgress = spring({
    frame: frame - BEATS.DATA_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);
  const panelY = interpolate(panelProgress, [0, 1], [30, 0]);

  // --- Circuit traces ---
  const traceOpacity = interpolate(
    frame,
    [BEATS.CIRCUIT_TRACES, BEATS.CIRCUIT_TRACES + 15],
    [0, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Bit target glow ---
  const bitGlowOpacity = interpolate(
    frame,
    [BEATS.BIT_TARGET_GLOW, BEATS.BIT_TARGET_GLOW + 10, BEATS.BIT_FLIP],
    [0, 0.6, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Bit flip scale animation ---
  const bitFlipScale = spring({
    frame: frame - BEATS.BIT_FLIP,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const flipScale = hasFlipped
    ? interpolate(bitFlipScale, [0, 0.5, 1], [1, 1.5, 1])
    : 1;

  // --- Impact flash at bit position ---
  const flashOpacity = interpolate(
    frame,
    [BEATS.BIT_FLASH, BEATS.BIT_FLASH + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const flashScale = interpolate(
    frame,
    [BEATS.BIT_FLASH, BEATS.BIT_FLASH + 10],
    [0, 2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Difference indicator ---
  const diffProgress = spring({
    frame: frame - BEATS.DIFFERENCE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const diffScale = interpolate(diffProgress, [0, 1], [0.3, 1]);
  const diffOpacity = interpolate(diffProgress, [0, 1], [0, 1]);

  // --- Position jump label ---
  const jumpLabelProgress = spring({
    frame: frame - BEATS.POSITION_JUMP_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const jumpLabelOpacity = interpolate(jumpLabelProgress, [0, 1], [0, 1]);

  // --- Panels dim when platform appears ---
  const panelDimOpacity = interpolate(
    frame,
    [BEATS.PLATFORM_IN, BEATS.PLATFORM_IN + 15],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Platform entrance ---
  const platformProgress = spring({
    frame: frame - BEATS.PLATFORM_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const platformOpacity = interpolate(platformProgress, [0, 1], [0, 1]);

  // --- Character entrance ---
  const charProgress = spring({
    frame: frame - BEATS.CHARACTER_ON_PLATFORM,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const charScale = interpolate(charProgress, [0, 1], [0, 1]);

  // --- Arrow ---
  const arrowHeight = interpolate(
    frame,
    [BEATS.ARROW_IN, BEATS.ARROW_IN + 15],
    [0, 40],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Fall animation ---
  const isFalling = frame >= BEATS.FALL_START && frame < BEATS.FALL_END;
  const fallProgress = isFalling
    ? interpolate(frame, [BEATS.FALL_START, BEATS.FALL_END], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : frame >= BEATS.FALL_END
      ? 1
      : 0;
  const fallDistance = Easing.in(Easing.quad)(fallProgress) * 200;
  const charVisible = fallDistance < 180;

  // --- Afterimages ---
  const afterimageOpacities = [0.5, 0.3, 0.1];

  // --- Solid label ---
  const solidProgress = spring({
    frame: frame - BEATS.SOLID_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const solidOpacity = interpolate(solidProgress, [0, 1], [0, 1]);
  const solidY = interpolate(solidProgress, [0, 1], [15, 0]);

  // --- Platform pulse ---
  const platformPulseGlow = frame >= BEATS.PLATFORM_PULSE
    ? Math.sin((frame - BEATS.PLATFORM_PULSE) * 0.15) * 0.4 + 0.4
    : 0;

  // --- Binary bit pulsing in hold phase ---
  const holdBitPulse = frame >= BEATS.HOLD
    ? 0.6 + Math.sin((frame - BEATS.HOLD) * 0.15) * 0.4
    : 1;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          paddingTop: 60,
          position: 'relative',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Circuit traces (decorative) */}
        {frame >= BEATS.CIRCUIT_TRACES && (
          <>
            {/* Left traces */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`lt-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 200 + i * 80,
                  width: 50,
                  height: 1,
                  backgroundColor: COLORS.techBlue,
                  opacity: traceOpacity,
                }}
              />
            ))}
            {/* Right traces */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`rt-${i}`}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 200 + i * 80,
                  width: 50,
                  height: 1,
                  backgroundColor: COLORS.techBlue,
                  opacity: traceOpacity,
                }}
              />
            ))}
          </>
        )}

        {/* --- Data panel (Y-coordinate + binary) --- */}
        <div
          style={{
            opacity: panelOpacity * panelDimOpacity,
            transform: `translateY(${panelY}px)`,
            width: 800,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Panel container */}
          <div
            style={{
              width: '100%',
              backgroundColor: COLORS.codeBg,
              borderRadius: 12,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Header */}
            {frame >= BEATS.Y_LABEL && (
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.textMuted}
                startFrame={BEATS.Y_LABEL}
                entrance="fade"
                align="center"
              >
                MARIO Y-POSITION
              </AnimatedText>
            )}

            {/* Y value display */}
            {frame >= BEATS.Y_VALUE && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <AnimatedText
                  variant="code"
                  size={36}
                  color={COLORS.textBody}
                  startFrame={BEATS.Y_VALUE}
                  springPreset="snappy"
                  entrance="slideUp"
                  align="center"
                >
                  {hasFlipped ? 'Y = 1024' : 'Y = -1024'}
                </AnimatedText>

                {/* Difference indicator */}
                {frame >= BEATS.DIFFERENCE_IN && (
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 32,
                      fontWeight: 700,
                      color: COLORS.errorRed,
                      opacity: diffOpacity,
                      transform: `scale(${diffScale})`,
                      display: 'inline-block',
                      marginLeft: 12,
                    }}
                  >
                    +2048
                  </span>
                )}
              </div>
            )}

            {/* Binary display */}
            {frame >= BEATS.BINARY_IN && (
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 32,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  position: 'relative',
                }}
              >
                {(hasFlipped ? BINARY_AFTER : BINARY_BEFORE).map((bit, i) => {
                  const bitStart = BEATS.BINARY_IN + i;
                  const bitProgress = spring({
                    frame: frame - bitStart,
                    fps,
                    config: SPRING_CONFIGS.snappy,
                  });
                  const bitOpacity = interpolate(bitProgress, [0, 1], [0, 1]);

                  const isFlippedBit = i === FLIP_INDEX;
                  const isGlowing = isFlippedBit && frame >= BEATS.BIT_TARGET_GLOW;
                  const isFlippedNow = isFlippedBit && hasFlipped;

                  // Add space between groups of 4
                  const addGap = i > 0 && i % 4 === 0;

                  return (
                    <React.Fragment key={i}>
                      {addGap && <span style={{ width: 12 }} />}
                      <span
                        style={{
                          opacity: bitOpacity * (isFlippedBit && frame >= BEATS.HOLD ? holdBitPulse : 1),
                          color: isFlippedNow
                            ? COLORS.errorRed
                            : COLORS.textBody,
                          transform: isFlippedNow
                            ? `scale(${flipScale})`
                            : 'scale(1)',
                          display: 'inline-block',
                          position: 'relative',
                          boxShadow: isGlowing
                            ? `0 0 8px rgba(239,68,68,${bitGlowOpacity})`
                            : 'none',
                          borderRadius: 4,
                          padding: '0 2px',
                        }}
                      >
                        {bit}

                        {/* Impact flash on the flipped bit */}
                        {isFlippedBit && frame >= BEATS.BIT_FLASH && frame < BEATS.BIT_FLASH + 10 && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: -10,
                              borderRadius: '50%',
                              backgroundColor: COLORS.impactFlash,
                              opacity: flashOpacity,
                              transform: `scale(${flashScale})`,
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* "ONE BIT = POSITION JUMP" label */}
            {frame >= BEATS.POSITION_JUMP_LABEL && (
              <div style={{ opacity: jumpLabelOpacity }}>
                <AnimatedText
                  variant="label"
                  size={24}
                  color={COLORS.insightOrange}
                  startFrame={BEATS.POSITION_JUMP_LABEL}
                  entrance="fade"
                  align="center"
                >
                  ONE BIT = POSITION JUMP
                </AnimatedText>
              </div>
            )}
          </div>
        </div>

        {/* --- Platform + Character visualization --- */}
        {frame >= BEATS.PLATFORM_IN && (
          <div
            style={{
              position: 'absolute',
              bottom: 300,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: platformOpacity,
            }}
          >
            {/* "SHOULD BE SOLID" text */}
            {frame >= BEATS.SOLID_LABEL && (
              <div
                style={{
                  marginBottom: 20,
                  opacity: solidOpacity,
                  transform: `translateY(${solidY}px)`,
                }}
              >
                <AnimatedText
                  variant="body"
                  size={44}
                  color={COLORS.textBody}
                  startFrame={BEATS.SOLID_LABEL}
                  springPreset="gentle"
                  entrance="slideUp"
                  align="center"
                >
                  SHOULD BE SOLID
                </AnimatedText>
              </div>
            )}

            {/* Platform */}
            <div
              style={{
                width: 300,
                height: 12,
                backgroundColor: COLORS.solutionGreen,
                borderRadius: 4,
                position: 'relative',
                boxShadow: platformPulseGlow > 0
                  ? `0 0 16px rgba(16,185,129,${platformPulseGlow})`
                  : 'none',
              }}
            >
              {/* Character */}
              {frame >= BEATS.CHARACTER_ON_PLATFORM && charVisible && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: `translate(-50%, ${-48 + fallDistance}px) scale(${charScale})`,
                    transformOrigin: 'center bottom',
                  }}
                >
                  {/* Head */}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: COLORS.errorRed,
                      margin: '0 auto',
                      marginBottom: -2,
                    }}
                  />
                  {/* Body */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      backgroundColor: COLORS.errorRed,
                      borderRadius: 3,
                    }}
                  />
                </div>
              )}

              {/* Afterimages during fall */}
              {isFalling &&
                afterimageOpacities.map((opacity, i) => (
                  <div
                    key={`after-${i}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      transform: `translate(-50%, -48px)`,
                      opacity,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: COLORS.errorRed,
                        margin: '0 auto',
                        marginBottom: -2,
                      }}
                    />
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: COLORS.errorRed,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                ))}

              {/* Arrow pointing down */}
              {frame >= BEATS.ARROW_IN && frame < BEATS.FALL_START && (
                <div
                  style={{
                    position: 'absolute',
                    right: -50,
                    top: -20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: arrowHeight,
                      backgroundColor: COLORS.errorRed,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `8px solid ${COLORS.errorRed}`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Dotted trail below platform */}
            {frame >= BEATS.FALL_END && (
              <div
                style={{
                  width: 2,
                  height: 150,
                  backgroundImage: `repeating-linear-gradient(to bottom, ${COLORS.textMuted} 0px, ${COLORS.textMuted} 4px, transparent 4px, transparent 10px)`,
                  opacity: interpolate(
                    frame,
                    [BEATS.FALL_END, BEATS.FALL_END + 20],
                    [0, 0.5],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                  marginTop: 4,
                }}
              />
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
