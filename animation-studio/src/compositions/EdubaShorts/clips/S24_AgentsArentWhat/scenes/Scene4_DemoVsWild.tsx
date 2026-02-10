import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start = 0, global 660) ──
const BEATS = {
  SPLIT_SETUP: 0,
  DEMO_HEADER: 10,
  PROD_HEADER: 20,
  DEMO_STEP_1: 50,
  DEMO_STEP_2: 60,
  DEMO_STEP_3: 70,
  PROD_STEP_1: 55,
  PROD_STUCK: 65,
  PROD_ERROR: 80,
  RETRY_LOOP: 100,
  RETRY_FAILED: 146,
  PANELS_DIM: 150,
  TIMELINE_ARROW: 155,
  THREE_YEARS: 170,
  PULSE: 200,
  SCENE_END: 240,
};

// ── Pipeline step ──
type StepStatus = 'pending' | 'success' | 'spinning' | 'error' | 'grayed';

const PipelineStep: React.FC<{
  label: string;
  status: StepStatus;
  bgColor: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ label, status, bgColor, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  const isGrayed = status === 'grayed';
  const isError = status === 'error';

  const actualBg = isGrayed
    ? COLORS.textMuted + '30'
    : isError
      ? COLORS.errorRed + '30'
      : bgColor + '30';

  const borderColor = isGrayed
    ? COLORS.textMuted
    : isError
      ? COLORS.errorRed
      : bgColor;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          backgroundColor: actualBg,
          border: `2px solid ${borderColor}`,
          borderRadius: 24,
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 1,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: isGrayed ? COLORS.textMuted : COLORS.textBody,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {label}
        </span>
      </div>

      {/* Status indicator */}
      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {status === 'success' && (
          <svg width={20} height={20} viewBox="0 0 20 20">
            <path
              d="M3 10 L8 15 L17 5"
              fill="none"
              stroke={COLORS.solutionGreen}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {status === 'spinning' && (
          <div
            style={{
              display: 'flex',
              gap: 3,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: COLORS.aiPurple,
                  transform: `translateY(${Math.sin((frame * 0.2) + i * 2) * 4}px)`,
                }}
              />
            ))}
          </div>
        )}
        {status === 'error' && (
          <svg width={18} height={18} viewBox="0 0 18 18">
            <line x1={3} y1={3} x2={15} y2={15} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
            <line x1={15} y1={3} x2={3} y2={15} stroke={COLORS.errorRed} strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
};

// ── Sparkle effect for demo panel ──
const Sparkles: React.FC<{ frame: number }> = ({ frame }) => {
  const sparklePositions: { x: number; y: number; delay: number }[] = [
    { x: 20, y: 30, delay: 0 },
    { x: 80, y: 60, delay: 8 },
    { x: 50, y: 10, delay: 16 },
    { x: 90, y: 80, delay: 24 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {sparklePositions.map((s, i) => {
        const sparkleFrame = (frame + s.delay) % 32;
        const sparkleOpacity =
          sparkleFrame < 8
            ? interpolate(sparkleFrame, [0, 4, 8], [0, 1, 0])
            : 0;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: sparkleOpacity,
              boxShadow: '0 0 6px #FFFFFF',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Connecting arrow between steps ──
const StepArrow: React.FC<{ color: string }> = ({ color }) => (
  <svg width={20} height={16} viewBox="0 0 20 16" style={{ marginLeft: 30 }}>
    <line x1={10} y1={0} x2={10} y2={12} stroke={color} strokeWidth={1.5} />
    <path d="M6 8 L10 14 L14 8" fill="none" stroke={color} strokeWidth={1.5} />
  </svg>
);

// ── Failed stamp ──
const FailedStamp: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.RETRY_FAILED;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(progress, [0, 1], [2, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale}) rotate(-5deg)`,
        opacity,
        zIndex: 10,
      }}
    >
      <div
        style={{
          border: `3px solid ${COLORS.errorRed}`,
          borderRadius: 6,
          padding: '6px 20px',
          backgroundColor: 'rgba(239,68,68,0.1)',
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 32,
            color: COLORS.errorRed,
            fontWeight: 700,
          }}
        >
          FAILED
        </span>
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene4_DemoVsWild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animations
  const demoHeaderProgress = spring({
    frame: frame - BEATS.DEMO_HEADER,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const prodHeaderProgress = spring({
    frame: frame - BEATS.PROD_HEADER,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Divider
  const dividerOpacity = interpolate(
    frame,
    [BEATS.SPLIT_SETUP + 5, BEATS.SPLIT_SETUP + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Panel dimming
  const panelDim =
    frame >= BEATS.PANELS_DIM
      ? interpolate(frame - BEATS.PANELS_DIM, [0, 20], [1, 0.3], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  // Further dim near end
  const panelFinalDim =
    frame >= BEATS.PULSE
      ? interpolate(frame - BEATS.PULSE, [0, 20], [panelDim, 0.1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : panelDim;

  // Demo step statuses
  const demoStep1Status: StepStatus = frame >= BEATS.DEMO_STEP_1 ? 'success' : 'pending';
  const demoStep2Status: StepStatus = frame >= BEATS.DEMO_STEP_2 ? 'success' : 'pending';
  const demoStep3Status: StepStatus = frame >= BEATS.DEMO_STEP_3 ? 'success' : 'pending';

  // Production step statuses
  const prodStep1Status: StepStatus = frame >= BEATS.PROD_STEP_1 ? 'success' : 'pending';
  const prodStuckStatus: StepStatus =
    frame >= BEATS.PROD_ERROR
      ? 'error'
      : frame >= BEATS.PROD_STUCK
        ? 'spinning'
        : 'pending';
  const prodStep3Status: StepStatus = 'grayed';

  // Retry counter
  const retryFrame = frame - BEATS.RETRY_LOOP;
  const retryCount =
    retryFrame >= 0
      ? Math.min(Math.floor(retryFrame / 8) + 1, 5)
      : 0;

  // Pipeline shake on final retry failure
  let pipelineShake = 0;
  if (frame >= BEATS.RETRY_FAILED && frame < BEATS.RETRY_FAILED + 6) {
    pipelineShake = Math.sin((frame - BEATS.RETRY_FAILED) * 3) * 4;
  }

  // Timeline arrow
  const showTimeline = frame >= BEATS.TIMELINE_ARROW;
  const timelineProgress = spring({
    frame: frame - BEATS.TIMELINE_ARROW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // 3 YEARS text
  const showThreeYears = frame >= BEATS.THREE_YEARS;
  const threeYearsProgress = spring({
    frame: frame - BEATS.THREE_YEARS,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Pulse
  let pulseScale = 1;
  if (frame >= BEATS.PULSE && frame < BEATS.PULSE + 20) {
    pulseScale = interpolate(frame - BEATS.PULSE, [0, 10, 20], [1, 1.05, 1]);
  }

  const panelStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          gap: 12,
          position: 'relative',
        }}
      >
        {/* ── Top Panel: DEMO ── */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: COLORS.bgSurface,
            border: `1px solid ${COLORS.panelBorder}`,
            opacity: panelFinalDim,
          }}
        >
          {/* Header */}
          {frame >= BEATS.DEMO_HEADER && (
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.solutionGreen,
                opacity: interpolate(demoHeaderProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(demoHeaderProgress, [0, 1], [15, 0])}px)`,
                marginBottom: 8,
              }}
            >
              DEMO
            </div>
          )}

          {/* Pipeline steps */}
          <PipelineStep
            label="Read email"
            status={demoStep1Status}
            bgColor={COLORS.solutionGreen}
            frame={frame}
            fps={fps}
            startFrame={BEATS.DEMO_STEP_1}
          />
          <StepArrow color={COLORS.textDim} />
          <PipelineStep
            label="Draft response"
            status={demoStep2Status}
            bgColor={COLORS.solutionGreen}
            frame={frame}
            fps={fps}
            startFrame={BEATS.DEMO_STEP_2}
          />
          <StepArrow color={COLORS.textDim} />
          <PipelineStep
            label="Send reply"
            status={demoStep3Status}
            bgColor={COLORS.solutionGreen}
            frame={frame}
            fps={fps}
            startFrame={BEATS.DEMO_STEP_3}
          />

          {/* Sparkle effect */}
          {frame >= BEATS.DEMO_STEP_3 && <Sparkles frame={frame} />}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 2,
            backgroundColor: COLORS.panelBorder,
            opacity: dividerOpacity * panelFinalDim,
          }}
        />

        {/* ── Bottom Panel: PRODUCTION ── */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: COLORS.bg,
            border: `1px solid ${COLORS.panelBorder}`,
            opacity: panelFinalDim,
            transform: `translateX(${pipelineShake}px)`,
          }}
        >
          {/* Header */}
          {frame >= BEATS.PROD_HEADER && (
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.errorRed,
                opacity: interpolate(prodHeaderProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(prodHeaderProgress, [0, 1], [15, 0])}px)`,
                marginBottom: 8,
              }}
            >
              PRODUCTION
            </div>
          )}

          {/* Pipeline steps */}
          <PipelineStep
            label="Read email"
            status={prodStep1Status}
            bgColor={COLORS.solutionGreen}
            frame={frame}
            fps={fps}
            startFrame={BEATS.PROD_STEP_1}
          />
          <StepArrow color={COLORS.textDim} />
          <PipelineStep
            label="Find reply button"
            status={prodStuckStatus}
            bgColor={COLORS.insightOrange}
            frame={frame}
            fps={fps}
            startFrame={BEATS.PROD_STUCK}
          />

          {/* Error message */}
          {frame >= BEATS.PROD_ERROR && (
            <div
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 26,
                color: COLORS.errorRed,
                marginLeft: 30,
                opacity: interpolate(
                  frame - BEATS.PROD_ERROR,
                  [0, 10],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            >
              Element not found: .btn-reply
            </div>
          )}

          <StepArrow color={COLORS.textDim} />
          <PipelineStep
            label="Send reply"
            status={prodStep3Status}
            bgColor={COLORS.textMuted}
            frame={frame}
            fps={fps}
            startFrame={BEATS.PROD_STUCK + 5}
          />

          {/* Retry counter */}
          {retryCount > 0 && frame < BEATS.RETRY_FAILED + 20 && (
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.insightOrange,
                marginTop: 8,
                marginLeft: 30,
              }}
            >
              Retry {retryCount}/5
            </div>
          )}

          {/* FAILED stamp */}
          <FailedStamp frame={frame} fps={fps} />
        </div>

        {/* ── Timeline Arrow (overlay) ── */}
        {showTimeline && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              zIndex: 20,
              opacity: interpolate(timelineProgress, [0, 1], [0, 1]),
            }}
          >
            {/* Arrow line */}
            <div
              style={{
                position: 'relative',
                width: 600,
                height: 40,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Line */}
              <div
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: COLORS.textMuted,
                }}
              />
              {/* Arrow tip */}
              <svg width={16} height={20} viewBox="0 0 16 20">
                <path d="M0 0 L16 10 L0 20" fill={COLORS.textMuted} />
              </svg>

              {/* MARKETING label (left) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -30,
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.insightOrange,
                }}
              >
                MARKETING
              </div>

              {/* REALITY label (right) */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -30,
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.techBlue,
                }}
              >
                REALITY
              </div>
            </div>

            {/* ~3 YEARS */}
            {showThreeYears && (
              <div
                style={{
                  opacity: interpolate(threeYearsProgress, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(threeYearsProgress, [0, 1], [0.5, 1]) * pulseScale})`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.title,
                    fontSize: 52,
                    color: COLORS.insightOrange,
                    fontWeight: 700,
                  }}
                >
                  ~3 YEARS
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
