import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchBurst, BlurText } from '../../../../../components/core/effects';
import { ChatWindow } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  FADE_PREV: 0,
  CHAT_IN: 30,
  USER_Q: 30,
  OLD_MODEL: 60,
  NEW_MODEL: 100,
  ANNOTATION: 150,
  CENTRAL_STMT: 190,
  SUBTITLE: 240,
  HOLD: 240,
};

// ── Model Response Badges ──
const Badge: React.FC<{
  text: string;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, color, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.7, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: color + '25',
        border: `1px solid ${color}60`,
        borderRadius: 20,
        padding: '4px 14px',
        opacity,
        transform: `scale(${scale})`,
        ...TYPOGRAPHY.label,
        fontSize: 22,
        color,
        marginLeft: 8,
      }}
    >
      {text}
    </span>
  );
};

// ── Model Label ──
const ModelLabel: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <span
      style={{
        ...TYPOGRAPHY.label,
        fontSize: 24,
        color: COLORS.textMuted,
        opacity,
        display: 'block',
        marginBottom: 4,
      }}
    >
      {text}
    </span>
  );
};

// ── Chat Section with model responses ──
const ChatSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const showChat = frame >= BEATS.CHAT_IN;
  if (!showChat) return null;

  // Chat window dims when central statement appears
  const dimProgress = interpolate(
    frame,
    [BEATS.CENTRAL_STMT - 10, BEATS.CENTRAL_STMT],
    [1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Scroll up when new model appears
  const scrollFrame = frame - BEATS.NEW_MODEL;
  const scrollProgress =
    scrollFrame > 0
      ? spring({ frame: scrollFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const scrollY = interpolate(scrollProgress, [0, 1], [0, -60]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 920,
        opacity: dimProgress,
        transform: `translateY(${scrollY}px)`,
        position: 'relative',
      }}
    >
      <ChatWindow
        startFrame={BEATS.CHAT_IN}
        messages={[
          {
            role: 'user',
            text: "What's the best pricing model for a B2B SaaS tool selling to mid-market manufacturing companies in Southeast Asia?",
            delay: 0,
          },
        ]}
        messageStagger={30}
      />

      {/* Old model response section */}
      {frame >= BEATS.OLD_MODEL && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModelLabel text="GPT-3.5" frame={frame} fps={fps} startFrame={BEATS.OLD_MODEL} />
            <Badge
              text="Generic"
              color={COLORS.insightOrange}
              frame={frame}
              fps={fps}
              startFrame={BEATS.OLD_MODEL + 20}
            />
          </div>
          <div
            style={{
              backgroundColor: COLORS.bgSurfaceAlt,
              borderRadius: 12,
              padding: '14px 20px',
              marginTop: 8,
              border: `1px solid ${COLORS.panelBorder}`,
              position: 'relative',
              overflow: 'hidden',
              opacity: interpolate(
                spring({
                  frame: Math.max(0, frame - BEATS.OLD_MODEL),
                  fps,
                  config: SPRING_CONFIGS.snappy,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            {/* Faint bookshelf overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 10,
                bottom: 0,
                width: 40,
                opacity: 0.05,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 40,
                    backgroundColor: COLORS.textMuted,
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color: COLORS.textBody }}>
              A subscription model with tiered pricing based on features and usage is recommended.
            </span>
          </div>
        </div>
      )}

      {/* New model response section */}
      {frame >= BEATS.NEW_MODEL && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModelLabel text="GPT-4o" frame={frame} fps={fps} startFrame={BEATS.NEW_MODEL} />
            <Badge
              text="More specific"
              color={COLORS.techBlue}
              frame={frame}
              fps={fps}
              startFrame={BEATS.NEW_MODEL + 20}
            />
          </div>
          <div
            style={{
              backgroundColor: COLORS.bgSurfaceAlt,
              borderRadius: 12,
              padding: '14px 20px',
              marginTop: 8,
              border: `1px solid ${COLORS.panelBorder}`,
              borderLeft: `2px solid ${COLORS.techBlue}`,
              position: 'relative',
              overflow: 'hidden',
              opacity: interpolate(
                spring({
                  frame: Math.max(0, frame - BEATS.NEW_MODEL),
                  fps,
                  config: SPRING_CONFIGS.snappy,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            {/* Denser bookshelf overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 10,
                bottom: 0,
                width: 60,
                opacity: 0.08,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 36,
                    backgroundColor: COLORS.textMuted,
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color: COLORS.textBody }}>
              Consider a usage-based model with per-seat licensing. Southeast Asian manufacturers
              often prefer...
            </span>
          </div>
        </div>
      )}

      {/* Annotation arrow between responses */}
      {frame >= BEATS.ANNOTATION && frame < BEATS.CENTRAL_STMT && (
        <div
          style={{
            position: 'absolute',
            right: -10,
            top: '45%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: interpolate(
              spring({
                frame: Math.max(0, frame - BEATS.ANNOTATION),
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
              writingMode: 'vertical-lr',
              ...TYPOGRAPHY.label,
              fontSize: 20,
              color: COLORS.insightOrange,
              transform: 'rotate(180deg)',
              letterSpacing: 1,
            }}
          >
            Better pattern match, not understanding
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Scene ──
export const Scene3_PatternMatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showCentralStmt = frame >= BEATS.CENTRAL_STMT;
  const showSubtitle = frame >= BEATS.SUBTITLE;

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
          gap: 20,
          position: 'relative',
        }}
      >
        {/* Chat section */}
        <ChatSection frame={frame} fps={fps} />

        {/* Central Statement overlay */}
        {showCentralStmt && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
                maxWidth: 860,
                textAlign: 'center',
              }}
            >
              <BlurText
                startFrame={BEATS.CENTRAL_STMT}
                animateBy="words"
                direction="bottom"
                staggerDelay={3}
                blurAmount={10}
                distance={20}
                fontSize={52}
                fontWeight={600}
                color={COLORS.insightOrange}
              >
                Wrong less often
              </BlurText>

              {/* Glitchy not-equal sign */}
              <div style={{ marginTop: 8 }}>
                <GlitchBurst
                  startFrame={BEATS.CENTRAL_STMT + 12}
                  burstInterval={120}
                  burstDuration={10}
                  fontSize={72}
                >
                  <span style={{ color: COLORS.errorRed, fontWeight: 900 }}>&ne;</span>
                </GlitchBurst>
              </div>

              <BlurText
                startFrame={BEATS.CENTRAL_STMT + 6}
                animateBy="words"
                direction="bottom"
                staggerDelay={3}
                blurAmount={10}
                distance={20}
                fontSize={52}
                fontWeight={600}
                color={COLORS.insightOrange}
              >
                Understanding
              </BlurText>
            </div>

            {/* Subtitle */}
            {showSubtitle && (
              <div style={{ maxWidth: 860, textAlign: 'center' }}>
                <BlurText
                  startFrame={BEATS.SUBTITLE}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={3}
                  blurAmount={8}
                  distance={15}
                  fontSize={36}
                  fontWeight={400}
                  color={COLORS.textMuted}
                >
                  It found a closer pattern. It didn&apos;t learn your industry.
                </BlurText>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
