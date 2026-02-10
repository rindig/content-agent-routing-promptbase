import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { CountUp } from '../../../../../../components/core/effects';
import { ShinyText } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

/**
 * Scene 2: Scale Reveal (local frames 0–90, global 150–240)
 *
 * Print statement completes its move to Y:350.
 * CountUp from 0 → 12,000; "7 layers" with shine sweep.
 */

const BEATS = {
  CODE_ARRIVES_TOP: 0,
  COUNT_START: 20,
  LINES_LABEL_IN: 40,
  SEVEN_LAYERS_IN: 65,
  SHINE_SWEEP: 70,
  COUNT_FADE_OUT: 85,
  SCENE_END: 90,
};

export const Scene2_ScaleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Print statement arrives at Y:350 (spring, 20 frames) ---
  const arriveProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
    durationInFrames: 20,
  });
  const codeY = interpolate(arriveProgress, [0, 1], [500, 350]);
  const codeScale = 0.6;
  const codeOpacity = 0.5;

  // --- CountUp (frames 20–85) ---
  const counterProgress = spring({
    frame: frame - BEATS.COUNT_START,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const counterOpacity =
    frame >= BEATS.COUNT_START
      ? frame >= BEATS.COUNT_FADE_OUT
        ? interpolate(frame - BEATS.COUNT_FADE_OUT, [0, 20], [1, 0], {
            extrapolateRight: 'clamp',
          })
        : interpolate(counterProgress, [0, 1], [0, 1])
      : 0;
  const counterScale =
    frame >= BEATS.COUNT_START
      ? interpolate(counterProgress, [0, 1], [0.9, 1])
      : 0.9;

  // --- "lines of code" label (frame 40+) ---
  const labelProgress = spring({
    frame: frame - BEATS.LINES_LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity =
    frame >= BEATS.LINES_LABEL_IN
      ? frame >= BEATS.COUNT_FADE_OUT
        ? interpolate(frame - BEATS.COUNT_FADE_OUT, [0, 20], [1, 0], {
            extrapolateRight: 'clamp',
          })
        : interpolate(labelProgress, [0, 1], [0, 1])
      : 0;

  // --- "7 layers" (frame 65+) ---
  const layersProgress = spring({
    frame: frame - BEATS.SEVEN_LAYERS_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const layersScale =
    frame >= BEATS.SEVEN_LAYERS_IN
      ? interpolate(layersProgress, [0, 1], [0.5, 1])
      : 0.5;
  const layersOpacity =
    frame >= BEATS.SEVEN_LAYERS_IN
      ? interpolate(layersProgress, [0, 1], [0, 1])
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Print statement (small, dim, arriving at top) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: codeY,
          transform: `translate(-50%, -50%) scale(${codeScale})`,
          opacity: codeOpacity,
          ...TYPOGRAPHY.code,
          fontSize: 40,
          color: COLORS.techBlue,
          whiteSpace: 'nowrap',
        }}
      >
        print(&quot;Hello, World!&quot;)
      </div>

      {/* CountUp at Y:860 */}
      {frame >= BEATS.COUNT_START && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 860,
            transform: `translate(-50%, -50%) scale(${counterScale})`,
            opacity: counterOpacity,
          }}
        >
          <CountUp
            from={0}
            to={12000}
            startFrame={BEATS.COUNT_START}
            duration={45}
            separator=","
            decimals={0}
            useSpring
            color={COLORS.insightOrange}
            fontSize={72}
          />
        </div>
      )}

      {/* "lines of code" label at Y:950 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 950,
          transform: 'translate(-50%, -50%)',
          opacity: labelOpacity,
          ...TYPOGRAPHY.body,
          fontSize: 40,
          color: COLORS.textMuted,
        }}
      >
        lines of code
      </div>

      {/* "7 layers" at Y:1060 */}
      {frame >= BEATS.SEVEN_LAYERS_IN && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1060,
            transform: `translate(-50%, -50%) scale(${layersScale})`,
            opacity: layersOpacity,
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
          }}
        >
          <ShinyText
            startFrame={BEATS.SHINE_SWEEP}
            shineColor="#FFFFFF"
            duration={30}
            fontSize={56}
            color={COLORS.insightOrange}
          >
            7
          </ShinyText>
          <span
            style={{
              fontFamily: TYPOGRAPHY.title.fontFamily,
              fontWeight: 600,
              fontSize: 56,
              color: COLORS.insightOrange,
            }}
          >
            {' '}
            layers
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
