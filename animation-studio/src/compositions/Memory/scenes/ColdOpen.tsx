import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { MadLibsPage, AmbientBackground, Vignette, AnimatedLine } from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (at 30fps)
const BEATS = {
  BLACK_START: 0,
  PAGE_FADE_IN: 30,
  PAGE_VISIBLE: 90,
  YEAR_APPEARS: 90,
  NAME_APPEARS: 150,
  SHOW_APPEARS: 240,
  WORD_DROP_1: 450,
  WORD_DROP_2: 465,
  LOGO_FADE: 600,
  PAGE_FADE_OUT: 750,
  THESIS_START: 810,
  THESIS_LINE2: 900,
  SCENE_END: 1500,
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Mad Libs Page Animation ===
  const pageEntrance = spring({
    frame: frame - BEATS.PAGE_FADE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const pageOpacity = interpolate(
    frame,
    [BEATS.PAGE_FADE_IN, BEATS.PAGE_VISIBLE, BEATS.PAGE_FADE_OUT, BEATS.PAGE_FADE_OUT + 60],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const pageScale = interpolate(pageEntrance, [0, 1], [0.95, 1]);
  const pageRotate = interpolate(pageEntrance, [0, 1], [-1, 0]);

  // === Year counter animation ===
  const yearProgress = spring({
    frame: frame - BEATS.YEAR_APPEARS,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });
  const yearOpacity = interpolate(
    frame,
    [BEATS.YEAR_APPEARS, BEATS.YEAR_APPEARS + 20, BEATS.PAGE_FADE_OUT, BEATS.PAGE_FADE_OUT + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Animate year counting up
  const yearValue = interpolate(
    yearProgress,
    [0, 1],
    [1900, 1953],
    { extrapolateRight: 'clamp' }
  );

  // === Name slide in ===
  const nameProgress = spring({
    frame: frame - BEATS.NAME_APPEARS,
    fps,
    config: { damping: 20, stiffness: 150, mass: 0.8 },
  });
  const nameOpacity = interpolate(
    frame,
    [BEATS.NAME_APPEARS, BEATS.NAME_APPEARS + 20, BEATS.PAGE_FADE_OUT, BEATS.PAGE_FADE_OUT + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Show text ===
  const showProgress = spring({
    frame: frame - BEATS.SHOW_APPEARS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const showOpacity = interpolate(
    frame,
    [BEATS.SHOW_APPEARS, BEATS.SHOW_APPEARS + 30, BEATS.PAGE_FADE_OUT, BEATS.PAGE_FADE_OUT + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Thesis visibility ===
  const showThesis = frame >= BEATS.THESIS_START - 30;
  const thesisContainerOpacity = interpolate(
    frame,
    [BEATS.THESIS_START - 30, BEATS.THESIS_START],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Mad Libs blanks configuration
  const blanks = [
    {
      id: 'adj1',
      type: 'adjective',
      filledWord: 'clumsy',
      fillAtFrame: BEATS.WORD_DROP_1,
    },
    {
      id: 'adj2',
      type: 'adjective',
      filledWord: 'naked',
      fillAtFrame: BEATS.WORD_DROP_2,
    },
  ];

  const template = 'The {adj1} comedian hit his {adj2} nose on the door.';

  const showMadLibs = frame >= BEATS.PAGE_FADE_IN && frame < BEATS.THESIS_START;

  return (
    <AbsoluteFill>
      {/* Ambient background with particles */}
      <AmbientBackground
        color={COLORS.background}
        particleCount={25}
        particleColor={COLORS.accent}
        gradientDirection="radial"
        gradientColor="#0a0a1a"
      />

      {/* Vignette for depth */}
      <Vignette intensity={0.4} />

      {/* Mad Libs Page */}
      {showMadLibs && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pageOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${pageScale}) rotate(${pageRotate}deg)`,
            }}
          >
            <MadLibsPage template={template} blanks={blanks} />
          </div>
        </AbsoluteFill>
      )}

      {/* Lower third info cards with more dynamic animations */}
      {showMadLibs && (
        <div
          style={{
            position: 'absolute',
            left: '8%',
            bottom: '12%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Year with counting animation */}
          <div
            style={{
              opacity: yearOpacity,
              transform: `translateX(${interpolate(yearProgress, [0, 1], [-40, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 700,
                color: COLORS.accent,
                textShadow: `0 0 40px ${COLORS.accent}50`,
              }}
            >
              {Math.round(yearValue)}
            </span>
          </div>

          {/* Name with slide + scale */}
          <div
            style={{
              opacity: nameOpacity,
              transform: `translateX(${interpolate(nameProgress, [0, 1], [-30, 0])}px) scale(${interpolate(nameProgress, [0, 1], [0.9, 1])})`,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 600,
                color: COLORS.text,
              }}
            >
              Leonard Stern
            </span>
          </div>

          {/* Show with typewriter-like reveal */}
          <div
            style={{
              opacity: showOpacity,
              transform: `translateX(${interpolate(showProgress, [0, 1], [-20, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontFamily: TYPOGRAPHY.quote.fontFamily,
                fontStyle: 'italic',
                color: COLORS.textMuted,
              }}
            >
              writer for{' '}
              <span style={{ color: COLORS.textPrimary }}>The Honeymooners</span>
            </span>
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: interpolate(showProgress, [0, 1], [0, 200]),
              height: 2,
              backgroundColor: COLORS.accent,
              marginTop: 8,
              opacity: showOpacity,
            }}
          />
        </div>
      )}

      {/* Thesis Statement with word-by-word animation */}
      {showThesis && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: thesisContainerOpacity,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: 1200,
              padding: '0 8%',
            }}
          >
            {/* Line 1: word by word */}
            <AnimatedLine
              startFrame={BEATS.THESIS_START}
              wordDelay={4}
              fontSize={56}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                accidentally: { color: COLORS.warning, weight: 600 },
                discovered: { color: COLORS.accent, weight: 500 },
              }}
            >
              They had accidentally discovered
            </AnimatedLine>

            {/* Line 2: emphasized with glow */}
            <div style={{ marginTop: 32 }}>
              <AnimatedLine
                startFrame={BEATS.THESIS_LINE2}
                wordDelay={5}
                fontSize={64}
                color={COLORS.text}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  oldest: { color: COLORS.accent, weight: 700, glow: true },
                  pattern: { color: COLORS.accent, weight: 700, glow: true },
                  computing: { color: COLORS.accentSecondary, weight: 700, glow: true },
                }}
                style={{ fontWeight: 600 }}
              >
                the oldest pattern in computing.
              </AnimatedLine>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default ColdOpen;
