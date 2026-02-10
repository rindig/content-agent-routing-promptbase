import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start = 0, global 360) ──
const BEATS = {
  CARDS_IN_START: 0,
  CARD_1_IN: 0,
  CARD_2_IN: 10,
  CARD_3_IN: 20,
  PEEL_CARD_1: 40,
  PEEL_CARD_2: 65,
  PEEL_CARD_3_ATTEMPT: 90,
  CARD_3_SNAPBACK: 100,
  CARDS_RECOMPOSE: 120,
  CHECKLIST_START: 130,
  X_MARKS: 200,
  SUIT_TEXT: 250,
  BOW_TIE: 260,
  SCENE_END: 300,
};

// ── Product card data ──
interface ProductData {
  name: string;
  icon: 'circle' | 'hexagon' | 'diamond';
  iconColor: string;
}

const PRODUCTS: ProductData[] = [
  { name: 'SmartAssist Pro', icon: 'circle', iconColor: COLORS.techBlue },
  { name: 'DataPilot AI', icon: 'hexagon', iconColor: COLORS.aiPurple },
  { name: 'FlowBot Enterprise', icon: 'diamond', iconColor: COLORS.insightOrange },
];

// ── Dust particles on badge reveal ──
const DustBurst: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame,
  fps,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > 15) return null;

  const fade = interpolate(relFrame, [5, 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const particles: { x: number; y: number; size: number }[] = Array.from(
    { length: 5 },
    (_, i) => ({
      x: (random(`dust-x-${startFrame}-${i}`) - 0.5) * 60 * (relFrame / 10),
      y: (random(`dust-y-${startFrame}-${i}`) - 0.5) * 40 * (relFrame / 10),
      size: 3 + random(`dust-s-${startFrame}-${i}`) * 4,
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        right: 20,
        opacity: fade,
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: COLORS.errorRed,
            borderRadius: 2,
            transform: `translate(${p.x}px, ${p.y}px)`,
          }}
        />
      ))}
    </div>
  );
};

// ── Icon shapes ──
const ProductIcon: React.FC<{ shape: string; color: string; size?: number }> = ({
  shape,
  color,
  size = 44,
}) => {
  if (shape === 'circle') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color + '30',
          border: `2px solid ${color}`,
        }}
      />
    );
  }
  if (shape === 'hexagon') {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44">
        <polygon
          points="22,2 40,12 40,32 22,42 4,32 4,12"
          fill={color + '30'}
          stroke={color}
          strokeWidth={2}
        />
      </svg>
    );
  }
  // diamond
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <polygon
        points="22,2 42,22 22,42 2,22"
        fill={color + '30'}
        stroke={color}
        strokeWidth={2}
      />
    </svg>
  );
};

// ── Bow tie SVG ──
const BowTie: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame,
  fps,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <svg
      width={32}
      height={20}
      viewBox="0 0 32 20"
      style={{
        position: 'absolute',
        bottom: -4,
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
      }}
    >
      <polygon points="0,0 12,10 0,20" fill={COLORS.insightOrange} />
      <circle cx={16} cy={10} r={3} fill={COLORS.insightOrange} />
      <polygon points="32,0 20,10 32,20" fill={COLORS.insightOrange} />
    </svg>
  );
};

// ── Animated checkmark SVG ──
const Checkmark: React.FC<{
  frame: number;
  startFrame: number;
  color: string;
}> = ({ frame, startFrame, color }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pathLength = 30;

  return (
    <svg width={20} height={20} viewBox="0 0 20 20">
      <path
        d="M3 10 L8 15 L17 5"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - drawProgress)}
      />
    </svg>
  );
};

// ── X mark ──
const XMark: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <line x1={3} y1={3} x2={15} y2={15} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={15} y1={3} x2={3} y2={15} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
};

// ── Product Card ──
const ProductCard: React.FC<{
  product: ProductData;
  index: number;
  frame: number;
  fps: number;
}> = ({ product, index, frame, fps }) => {
  // Card entrance
  const cardStart = index === 0 ? BEATS.CARD_1_IN : index === 1 ? BEATS.CARD_2_IN : BEATS.CARD_3_IN;
  const enterRel = frame - cardStart;
  if (enterRel < 0) return null;

  const enterProgress = spring({
    frame: enterRel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const cardY = interpolate(enterProgress, [0, 1], [40, 0]);
  const cardOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Badge peeling
  const isCard3 = index === 2;
  const peelStart = index === 0
    ? BEATS.PEEL_CARD_1
    : index === 1
      ? BEATS.PEEL_CARD_2
      : BEATS.PEEL_CARD_3_ATTEMPT;

  let badgeRotation = 0;
  let badgeTranslateX = 0;
  let badgeOpacity = 1;
  let showRevealBadge = false;
  let revealBadgeScale = 0.8;

  if (!isCard3) {
    // Normal peel for cards 1 & 2
    const peelRel = frame - peelStart;
    if (peelRel >= 0) {
      // Tilt phase (0-10 frames)
      if (peelRel < 10) {
        badgeRotation = interpolate(peelRel, [0, 10], [0, 15]);
      } else {
        // Slide off (10-25 frames)
        badgeRotation = 15;
        const slideProgress = spring({
          frame: peelRel - 10,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        badgeTranslateX = interpolate(slideProgress, [0, 1], [0, 200]);
        badgeOpacity = interpolate(slideProgress, [0, 1], [1, 0]);
      }
      // Show reveal badge after peel
      if (peelRel >= 12) {
        showRevealBadge = true;
        const revealProgress = spring({
          frame: peelRel - 12,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        revealBadgeScale = interpolate(revealProgress, [0, 1], [0.8, 1]);
      }
    }
  } else {
    // Card 3: attempt peel but snap back
    const peelRel = frame - peelStart;
    if (peelRel >= 0) {
      if (peelRel < 10) {
        badgeTranslateX = interpolate(peelRel, [0, 10], [0, 50]);
        badgeRotation = interpolate(peelRel, [0, 10], [0, 8]);
      } else {
        // Snap back
        const snapProgress = spring({
          frame: peelRel - 10,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        badgeTranslateX = interpolate(snapProgress, [0, 1], [50, 0]);
        badgeRotation = interpolate(snapProgress, [0, 1], [8, 0]);
      }
    }
  }

  // Dim cards 1 & 2 after recompose
  const dimProgress =
    !isCard3 && frame >= BEATS.CARDS_RECOMPOSE
      ? interpolate(frame - BEATS.CARDS_RECOMPOSE, [0, 20], [1, 0.4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  // Card 3 green glow after snapback
  const card3Glow =
    isCard3 && frame >= BEATS.CARD_3_SNAPBACK + 10
      ? interpolate(frame - (BEATS.CARD_3_SNAPBACK + 10), [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: 900,
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${isCard3 && card3Glow > 0 ? COLORS.solutionGreen + '60' : COLORS.panelBorder}`,
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: cardOpacity * dimProgress,
        transform: `translateY(${cardY}px)`,
        boxShadow:
          card3Glow > 0
            ? `0 0 ${16 * card3Glow}px ${COLORS.glowGreen}`
            : 'none',
      }}
    >
      {/* Product icon */}
      <div style={{ position: 'relative' }}>
        <ProductIcon shape={product.icon} color={product.iconColor} />
        {/* Bow tie overlay for dimmed cards */}
        {!isCard3 && frame >= BEATS.BOW_TIE && (
          <BowTie frame={frame} fps={fps} startFrame={BEATS.BOW_TIE + index * 5} />
        )}
      </div>

      {/* Product name */}
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 40,
          color: COLORS.textBody,
          flex: 1,
        }}
      >
        {product.name}
      </span>

      {/* Badge area */}
      <div style={{ position: 'relative' }}>
        {/* Original AI AGENT badge */}
        {badgeOpacity > 0 && (
          <div
            style={{
              backgroundColor: isCard3 && frame >= BEATS.CARD_3_SNAPBACK + 10
                ? COLORS.solutionGreen
                : COLORS.aiPurple,
              borderRadius: 20,
              padding: '6px 18px',
              transform: `translateX(${badgeTranslateX}px) rotate(${badgeRotation}deg)`,
              opacity: badgeOpacity,
              border: isCard3 && card3Glow > 0 ? `2px solid ${COLORS.solutionGreen}` : 'none',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              AI AGENT
            </span>
          </div>
        )}

        {/* Revealed CHATBOT badge (cards 1 & 2 only) */}
        {showRevealBadge && (
          <div
            style={{
              position: badgeOpacity <= 0 ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              backgroundColor: COLORS.errorRed,
              borderRadius: 20,
              padding: '6px 18px',
              transform: `scale(${revealBadgeScale})`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              CHATBOT
            </span>
          </div>
        )}

        {/* Dust burst on reveal */}
        {!isCard3 && (
          <DustBurst frame={frame} fps={fps} startFrame={peelStart + 12} />
        )}

        {/* Checkmark for card 3 */}
        {isCard3 && frame >= BEATS.CARD_3_SNAPBACK + 10 && (
          <div style={{ position: 'absolute', top: -10, right: -10 }}>
            <Checkmark
              frame={frame}
              startFrame={BEATS.CARD_3_SNAPBACK + 10}
              color={COLORS.solutionGreen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ── Checklist item ──
const ChecklistItem: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
  xMarkFrame?: number;
}> = ({ text, frame, fps, startFrame, xMarkFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const y = interpolate(progress, [0, 1], [15, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Checkmark frame={frame} startFrame={startFrame} color={COLORS.solutionGreen} />
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          color: COLORS.textBody,
          textTransform: 'none',
          letterSpacing: 0,
        }}
      >
        {text}
      </span>
      {/* X marks for failing cards */}
      {xMarkFrame !== undefined && (
        <div style={{ marginLeft: 8 }}>
          <XMark frame={frame} fps={fps} startFrame={xMarkFrame} />
        </div>
      )}
    </div>
  );
};

// ── Main Scene ──
export const Scene3_BadgePeel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showSuitText = frame >= BEATS.SUIT_TEXT;

  // Suit text animation
  const suitTextProgress = spring({
    frame: frame - BEATS.SUIT_TEXT,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 16,
        }}
      >
        {/* Product cards stack */}
        {PRODUCTS.map((product, i) => (
          <ProductCard
            key={i}
            product={product}
            index={i}
            frame={frame}
            fps={fps}
          />
        ))}

        {/* Criteria checklist */}
        {frame >= BEATS.CHECKLIST_START && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 16,
              width: 900,
            }}
          >
            <ChecklistItem
              text="Remembers context"
              frame={frame}
              fps={fps}
              startFrame={BEATS.CHECKLIST_START}
              xMarkFrame={BEATS.X_MARKS}
            />
            <ChecklistItem
              text="Uses external tools"
              frame={frame}
              fps={fps}
              startFrame={BEATS.CHECKLIST_START + 8}
              xMarkFrame={BEATS.X_MARKS + 8}
            />
            <ChecklistItem
              text="Decides next action"
              frame={frame}
              fps={fps}
              startFrame={BEATS.CHECKLIST_START + 16}
              xMarkFrame={BEATS.X_MARKS + 16}
            />
          </div>
        )}

        {/* "A chatbot in a suit" */}
        {showSuitText && (
          <div
            style={{
              marginTop: 16,
              opacity: interpolate(suitTextProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(suitTextProgress, [0, 1], [15, 0])}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.insightOrange,
              }}
            >
              A chatbot in a suit
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
