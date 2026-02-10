import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  FADE_PREV: 0,
  SMALL_SHELF: 30,
  LARGE_SHELF: 70,
  ARROW: 110,
  CLARIFICATION: 110,
  SIMPLIFY: 150,
  LISTS_IN: 190,
  HOLD: 230,
};

// ── Book colors ──
const BOOK_COLORS_SMALL = [
  COLORS.techBlue + '80',
  COLORS.aiPurple + '70',
  COLORS.textDim,
  COLORS.techBlue + '60',
  COLORS.aiPurple + '80',
  COLORS.textDim + '90',
  COLORS.techBlue + '70',
  COLORS.aiPurple + '60',
];

const BOOK_COLORS_LARGE = [
  COLORS.techBlue,
  COLORS.aiPurple,
  COLORS.solutionGreen,
  COLORS.insightOrange,
  COLORS.techBlue + 'CC',
  COLORS.aiPurple + 'CC',
  COLORS.solutionGreen + 'BB',
  COLORS.insightOrange + 'BB',
  COLORS.techBlue + 'AA',
  COLORS.aiPurple + 'AA',
  COLORS.solutionGreen + '99',
  COLORS.techBlue + '99',
  COLORS.insightOrange + '99',
  COLORS.aiPurple + '88',
  COLORS.techBlue + '88',
  COLORS.solutionGreen + 'AA',
  COLORS.insightOrange + 'AA',
  COLORS.aiPurple + 'BB',
  COLORS.techBlue + 'BB',
  COLORS.solutionGreen + 'CC',
  COLORS.insightOrange + 'CC',
  COLORS.aiPurple + 'DD',
  COLORS.techBlue + 'DD',
  COLORS.solutionGreen + 'EE',
  COLORS.insightOrange + 'EE',
];

// ── Bookshelf Component ──
const Bookshelf: React.FC<{
  books: string[];
  shelfCount: number;
  width: number;
  label: string;
  subLabel: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ books, shelfCount, width, label, subLabel, startFrame, frame, fps }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const scale = interpolate(enterProgress, [0, 1], [0.95, 1]);

  // Simplify morph (books collapse into rectangle)
  const simplifyFrame = frame - BEATS.SIMPLIFY;
  const simplifyProgress =
    simplifyFrame > 0
      ? spring({ frame: simplifyFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;

  const bookHeight = 80;
  const bookWidth = 18;
  const shelfSpacing = bookHeight + 12;
  const booksPerShelf = Math.ceil(books.length / shelfCount);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
        gap: 8,
      }}
    >
      {/* Bookshelf or simplified rectangle */}
      {simplifyProgress > 0.5 ? (
        // Simplified rectangle with count
        <div
          style={{
            width: width * 0.6,
            height: 60,
            borderRadius: 8,
            backgroundColor: label === 'GPT-3' ? COLORS.techBlue + '30' : COLORS.aiPurple + '30',
            border: `1px solid ${label === 'GPT-3' ? COLORS.techBlue + '60' : COLORS.aiPurple + '60'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(simplifyProgress, [0.5, 1], [0, 1]),
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.title,
              fontSize: label === 'GPT-3' ? 36 : 48,
              color: label === 'GPT-3' ? COLORS.techBlue : COLORS.aiPurple,
            }}
          >
            {subLabel.replace(' patterns', '')}
          </span>
        </div>
      ) : (
        // Actual bookshelf
        <div style={{ position: 'relative', width, height: shelfCount * shelfSpacing + 20 }}>
          {/* Shelf lines */}
          {Array.from({ length: shelfCount }).map((_, si) => (
            <div
              key={si}
              style={{
                position: 'absolute',
                top: (si + 1) * shelfSpacing - 4,
                left: 0,
                width: '100%',
                height: 2,
                backgroundColor: COLORS.textMuted,
                opacity: 0.5,
              }}
            />
          ))}
          {/* Books */}
          {books.map((color, bi) => {
            const shelfIndex = Math.floor(bi / booksPerShelf);
            const posInShelf = bi % booksPerShelf;
            const bookEnter = spring({
              frame: Math.max(0, relFrame - bi * 3),
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const bookY = interpolate(bookEnter, [0, 1], [bookHeight, 0]);
            const bookOpacity = interpolate(bookEnter, [0, 1], [0, 1]);

            return (
              <div
                key={bi}
                style={{
                  position: 'absolute',
                  top: shelfIndex * shelfSpacing + (bookHeight - bookY),
                  left: 10 + posInShelf * (bookWidth + 4),
                  width: bookWidth,
                  height: bookY,
                  backgroundColor: color,
                  borderRadius: 2,
                  opacity: bookOpacity * (1 - simplifyProgress),
                }}
              />
            );
          })}
        </div>
      )}

      {/* Labels */}
      <span style={{ ...TYPOGRAPHY.label, fontSize: 28, color: COLORS.textMuted }}>
        {label}
      </span>
      {simplifyProgress < 0.5 && (
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 24,
            color: COLORS.textDim,
          }}
        >
          {subLabel}
        </span>
      )}

      {/* Pattern library size label (appears after simplify) */}
      {simplifyProgress > 0.5 && (
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: COLORS.textMuted,
            opacity: interpolate(simplifyProgress, [0.5, 1], [0, 1]),
          }}
        >
          Pattern library size
        </span>
      )}
    </div>
  );
};

// ── IS / ISN'T Lists ──
const ComparisonLists: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.LISTS_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const isBullets = ['More pattern coverage', 'Fewer common mistakes'];
  const isntBullets = ['Actual reasoning', 'Understanding your business'];

  // Pulsing glow for ISN'T border
  const glowPulse = interpolate(
    Math.sin(frame * (Math.PI / 15)),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        opacity,
        maxWidth: 860,
        width: '100%',
      }}
    >
      {/* IS section */}
      <div
        style={{
          borderLeft: `3px solid ${COLORS.solutionGreen}`,
          paddingLeft: 20,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color: COLORS.solutionGreen,
            display: 'block',
            marginBottom: 12,
          }}
        >
          What &quot;smarter&quot; IS:
        </span>
        {isBullets.map((bullet, i) => {
          const bulletEnter = spring({
            frame: Math.max(0, relFrame - i * 5),
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const bulletY = interpolate(bulletEnter, [0, 1], [10, 0]);
          const bulletOpacity = interpolate(bulletEnter, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                opacity: bulletOpacity,
                transform: `translateY(${bulletY}px)`,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: COLORS.solutionGreen,
                  flexShrink: 0,
                }}
              />
              <span style={{ ...TYPOGRAPHY.body, fontSize: 36, color: COLORS.textBody }}>
                {bullet}
              </span>
            </div>
          );
        })}
      </div>

      {/* ISN'T section */}
      <div
        style={{
          borderLeft: `3px solid ${COLORS.errorRed}`,
          paddingLeft: 20,
          boxShadow: `inset 3px 0 8px rgba(239,68,68,${glowPulse * 0.3})`,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color: COLORS.errorRed,
            display: 'block',
            marginBottom: 12,
          }}
        >
          What &quot;smarter&quot; ISN&apos;T:
        </span>
        {isntBullets.map((bullet, i) => {
          const bulletEnter = spring({
            frame: Math.max(0, relFrame - (isBullets.length + i) * 5),
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const bulletY = interpolate(bulletEnter, [0, 1], [10, 0]);
          const bulletOpacity = interpolate(bulletEnter, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                opacity: bulletOpacity,
                transform: `translateY(${bulletY}px)`,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: COLORS.errorRed,
                  flexShrink: 0,
                }}
              />
              <span style={{ ...TYPOGRAPHY.body, fontSize: 36, color: COLORS.textBody }}>
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene2_LibraryMetaphor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arrow between shelves
  const arrowFrame = frame - BEATS.ARROW;
  const showArrow = arrowFrame > 0 && frame < BEATS.SIMPLIFY;
  const arrowProgress = showArrow
    ? spring({ frame: arrowFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;

  // Clarification text
  const showClarification = frame >= BEATS.CLARIFICATION && frame < BEATS.LISTS_IN;

  // Show lists phase
  const showLists = frame >= BEATS.LISTS_IN;

  // Fade shelves when lists appear
  const shelvesOpacity = interpolate(
    frame,
    [BEATS.LISTS_IN - 20, BEATS.LISTS_IN],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
          position: 'relative',
        }}
      >
        {/* Bookshelves phase */}
        {!showLists && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 40,
              opacity: shelvesOpacity,
            }}
          >
            {/* Small Bookshelf — GPT-3 */}
            <Bookshelf
              books={BOOK_COLORS_SMALL}
              shelfCount={2}
              width={300}
              label="GPT-3"
              subLabel="175B patterns"
              startFrame={BEATS.SMALL_SHELF}
              frame={frame}
              fps={fps}
            />

            {/* Arrow between shelves */}
            {showArrow && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: interpolate(arrowProgress, [0, 1], [0, 1]),
                }}
              >
                <svg width={60} height={60} viewBox="0 0 60 60">
                  <path
                    d="M 30 5 C 20 20, 40 40, 30 55"
                    stroke={COLORS.techBlue}
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray={80}
                    strokeDashoffset={interpolate(arrowProgress, [0, 1], [80, 0])}
                  />
                  {/* Arrowhead */}
                  <polygon
                    points="24,48 30,58 36,48"
                    fill={COLORS.techBlue}
                    opacity={arrowProgress}
                  />
                </svg>
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.techBlue,
                    opacity: arrowProgress,
                  }}
                >
                  10x more books
                </span>
              </div>
            )}

            {/* Large Bookshelf — GPT-4 */}
            <Bookshelf
              books={BOOK_COLORS_LARGE}
              shelfCount={3}
              width={400}
              label="GPT-4"
              subLabel="1.8T patterns"
              startFrame={BEATS.LARGE_SHELF}
              frame={frame}
              fps={fps}
            />

            {/* Clarification text */}
            {showClarification && (
              <div style={{ maxWidth: 860, textAlign: 'center', marginTop: 16 }}>
                <BlurText
                  startFrame={BEATS.CLARIFICATION}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={3}
                  blurAmount={10}
                  distance={20}
                  fontSize={40}
                  fontWeight={400}
                  color={COLORS.insightOrange}
                >
                  Not 10x smarter — 10x more patterns
                </BlurText>
              </div>
            )}
          </div>
        )}

        {/* Comparison Lists phase */}
        {showLists && <ComparisonLists frame={frame} fps={fps} />}
      </div>
    </SceneContainer>
  );
};
