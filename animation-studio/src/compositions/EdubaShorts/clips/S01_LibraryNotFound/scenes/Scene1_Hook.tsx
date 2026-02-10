import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CodePanel, ErrorMessage } from '../../../components';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  CODE_PANEL_IN: 4,
  LINE_1_HIGHLIGHT: 8,
  UNDERLINE_START: 12,
  CODE_SCALE_DOWN: 30,
  ERROR_1_IN: 35,
  ERROR_2_IN: 50,
  HOLD_START: 60,
  FADE_OUT_START: 80,
};

const CODE_LINES = [
  "import { analyzeData } from 'neural-parse-kit';",
  "import { formatOutput } from './utils';",
  '',
  'const result = analyzeData(rawInput);',
];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Code panel scale-down and shift after BEATS.CODE_SCALE_DOWN
  const scaleProgress = spring({
    frame: frame - BEATS.CODE_SCALE_DOWN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const codeScale = interpolate(scaleProgress, [0, 1], [1, 0.85]);
  const codeShiftY = interpolate(scaleProgress, [0, 1], [0, -40]);

  // Wavy underline on the hallucinated library name
  const underlinePhase = frame - BEATS.UNDERLINE_START;
  const wavyOffset = underlinePhase > 0 ? Math.sin(underlinePhase * 0.5) * 2 : 0;

  // Red glow pulsing on line 1
  const glowOpacity =
    frame >= BEATS.LINE_1_HIGHLIGHT
      ? 0.1 + 0.05 * Math.sin((frame - BEATS.LINE_1_HIGHLIGHT) * 0.15)
      : 0;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT_START}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          paddingTop: 280,
          gap: 24,
        }}
      >
        {/* Code Panel with error decoration */}
        <div
          style={{
            width: '100%',
            transform: `scale(${codeScale}) translateY(${codeShiftY}px)`,
            position: 'relative',
          }}
        >
          {/* Pulsing red glow behind line 1 */}
          {frame >= BEATS.LINE_1_HIGHLIGHT && (
            <div
              style={{
                position: 'absolute',
                top: 60,
                left: 0,
                right: 0,
                height: 50,
                background: `radial-gradient(ellipse at center, rgba(239,68,68,${glowOpacity}) 0%, transparent 70%)`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
            <CodePanel
              lines={CODE_LINES}
              startFrame={BEATS.CODE_PANEL_IN}
              highlightLines={frame >= BEATS.LINE_1_HIGHLIGHT ? [0] : []}
              highlightColor={COLORS.errorRed}
              staggerDelay={4}
            />
          </div>

          {/* Wavy underline on the library name */}
          {frame >= BEATS.UNDERLINE_START && (
            <svg
              style={{
                position: 'absolute',
                top: 82,
                left: 230,
                width: 320,
                height: 12,
                zIndex: 2,
                overflow: 'visible',
              }}
            >
              <path
                d={`M 0 6 ${Array.from({ length: 32 }, (_, i) => {
                  const x = i * 10;
                  const y = 6 + Math.sin((i + wavyOffset) * 0.8) * 3;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                stroke={COLORS.errorRed}
                strokeWidth={2}
                fill="none"
                opacity={interpolate(
                  frame,
                  [BEATS.UNDERLINE_START, BEATS.UNDERLINE_START + 10],
                  [0, 0.8],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                )}
              />
            </svg>
          )}
        </div>

        {/* Error Messages */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            width: '100%',
          }}
        >
          <ErrorMessage
            message="npm ERR! 404 'neural-parse-kit' is not in the npm registry"
            startFrame={BEATS.ERROR_1_IN}
            icon="search"
          />
          <ErrorMessage
            message='No results found for "neural-parse-kit"'
            startFrame={BEATS.ERROR_2_IN}
            icon="search"
          />
        </div>
      </div>
    </SceneContainer>
  );
};
