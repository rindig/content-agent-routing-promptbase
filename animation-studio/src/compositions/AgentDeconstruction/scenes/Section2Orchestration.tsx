import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { AsyncPipeline } from '../components/AsyncPipeline';
import { ExplodedLayers } from '../components/ExplodedLayers';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * SECTION 2: The Orchestration Layer [3:30 - 6:30]
 * Duration: 5400 frames (180 seconds)
 *
 * Visual journey:
 * 1. [0-300] Traffic Controller - Orchestrator node appears centrally
 * 2. [300-1200] Multiple Providers - AsyncPipeline with requests flowing
 * 3. [1200-1800] Labels Appear - Rate Limiting, Retry Logic, Queue Management
 * 4. [1800-2700] Zoom to Provider - Inside view: Prompt → Model → Text
 * 5. [2700-3600] Familiar Examples - Quick flash showing this is old architecture
 * 6. [3600-5400] Transition - Return to ExplodedLayers with 30% badge on orchestration
 *
 * Key message: "None of this is AI. This is async programming."
 */
export const Section2Orchestration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const TRAFFIC_IN = 0;
  const PROVIDERS_IN = seconds(10);
  const LABELS_IN = seconds(40);
  const ZOOM_IN = seconds(60);
  const ZOOM_OUT = seconds(90);
  const EXAMPLES_IN = seconds(90);
  const EXAMPLES_OUT = seconds(120);
  const LAYERS_RETURN = seconds(140);
  const HOLD = seconds(170);

  // Phase calculations
  const isTrafficPhase = frame >= TRAFFIC_IN && frame < ZOOM_IN;
  const isZoomedPhase = frame >= ZOOM_IN && frame < ZOOM_OUT;
  const isExamplesPhase = frame >= EXAMPLES_IN && frame < EXAMPLES_OUT;
  const isLayersPhase = frame >= LAYERS_RETURN;

  // Pipeline opacity
  const pipelineOpacity = interpolate(
    frame,
    [TRAFFIC_IN, TRAFFIC_IN + 30, ZOOM_IN - 30, ZOOM_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Zoomed view opacity
  const zoomedOpacity = interpolate(
    frame,
    [ZOOM_IN, ZOOM_IN + 30, ZOOM_OUT - 30, ZOOM_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Examples opacity
  const examplesOpacity = interpolate(
    frame,
    [EXAMPLES_IN, EXAMPLES_IN + 20, EXAMPLES_OUT - 20, EXAMPLES_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Layers return opacity
  const layersOpacity = interpolate(
    frame,
    [LAYERS_RETURN, LAYERS_RETURN + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Show labels after a delay
  const showLabels = frame >= LABELS_IN;

  // Familiar system examples - using inline SVG icons
  const EXAMPLES = [
    { id: 'scraper', label: 'Web Scraper', detail: 'Async HTTP requests' },
    { id: 'trading', label: 'Trading System', detail: 'Rate-limited API calls' },
    { id: 'tickets', label: 'Ticket Reservation', detail: 'Queue management' },
  ];

  // Animated icons for examples
  const ExampleIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
    const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
    const rotation = frame * 0.5;

    if (type === 'scraper') {
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="24" cy="24" r="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,3" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }} />
          <circle cx="24" cy="24" r="5" fill={color} opacity={pulse} />
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return <circle key={angle} cx={24 + Math.cos(rad) * 12} cy={24 + Math.sin(rad) * 12} r="2" fill={color} opacity={0.6} />;
          })}
        </svg>
      );
    }
    if (type === 'trading') {
      const barHeight1 = 10 + Math.sin(frame * 0.1) * 6;
      const barHeight2 = 18 + Math.sin(frame * 0.1 + 1) * 6;
      const barHeight3 = 14 + Math.sin(frame * 0.1 + 2) * 6;
      return (
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="10" y={38 - barHeight1} width="8" height={barHeight1} rx="2" fill={color} opacity={0.7} />
          <rect x="20" y={38 - barHeight2} width="8" height={barHeight2} rx="2" fill={color} opacity={0.85} />
          <rect x="30" y={38 - barHeight3} width="8" height={barHeight3} rx="2" fill={color} opacity={0.7} />
          <path d="M8 30 L18 18 L28 24 L40 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="10" r="3" fill={color} opacity={pulse} />
        </svg>
      );
    }
    // tickets
    const queueOffset = (frame % 40) / 40;
    return (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="8" y="12" width="32" height="24" rx="4" fill="none" stroke={color} strokeWidth="2" />
        <line x1="8" y1="20" x2="40" y2="20" stroke={color} strokeWidth="1" opacity={0.4} />
        <rect x="12" y="14" width="6" height="4" rx="1" fill={color} opacity={0.5} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={16 + i * 10 + queueOffset * 10} cy="28" r="3" fill={color} opacity={0.4 + i * 0.2} />
        ))}
      </svg>
    );
  };

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.orchestration}
        particleCount={30}
        gradientDirection="radial"
        gradientColor="#0A0A18"
      />

      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
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
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.orchestration,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          The Orchestration Layer
        </span>
      </div>

      {/* AsyncPipeline phase */}
      {isTrafficPhase && pipelineOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pipelineOpacity,
          }}
        >
          <AsyncPipeline
            startFrame={TRAFFIC_IN}
            showLabels={showLabels}
            showQueue={true}
            showRetry={true}
            scale={0.95}
          />
        </AbsoluteFill>
      )}

      {/* Zoomed provider view */}
      {isZoomedPhase && zoomedOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: zoomedOpacity,
          }}
        >
          <AsyncPipeline
            startFrame={ZOOM_IN}
            zoomedProvider="anthropic"
            scale={1}
          />
        </AbsoluteFill>
      )}

      {/* Familiar examples phase */}
      {isExamplesPhase && examplesOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: examplesOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
            }}
          >
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 32,
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: 20,
              }}
            >
              You've seen this architecture before
            </div>

            <div
              style={{
                display: 'flex',
                gap: 40,
              }}
            >
              {EXAMPLES.map((example, i) => {
                const exampleProgress = spring({
                  frame: frame - EXAMPLES_IN - i * 10,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });

                return (
                  <div
                    key={example.label}
                    style={{
                      position: 'relative',
                      width: 240,
                      padding: '30px 24px',
                      backgroundColor: `${COLORS.orchestration}10`,
                      border: `2px solid ${COLORS.orchestration}50`,
                      borderRadius: 16,
                      textAlign: 'center',
                      opacity: interpolate(exampleProgress, [0, 1], [0, 1]),
                      transform: `
                        translateY(${interpolate(exampleProgress, [0, 1], [30, 0])}px)
                        scale(${interpolate(exampleProgress, [0, 1], [0.9, 1])})
                      `,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Corner brackets */}
                    <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    {/* Scan line */}
                    <div style={{ position: 'absolute', top: `${((frame % 50) / 50) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.orchestration}30, transparent)`, pointerEvents: 'none' }} />

                    <div style={{ marginBottom: 16 }}>
                      <ExampleIcon type={example.id} color={COLORS.orchestration} />
                    </div>
                    <div
                      style={{
                        fontFamily: TYPOGRAPHY.display.fontFamily,
                        fontSize: 20,
                        fontWeight: 600,
                        color: COLORS.textPrimary,
                        marginBottom: 8,
                      }}
                    >
                      {example.label}
                    </div>
                    <div
                      style={{
                        fontFamily: TYPOGRAPHY.body.fontFamily,
                        fontSize: 14,
                        color: COLORS.textMuted,
                      }}
                    >
                      {example.detail}
                    </div>
                    {/* Type badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '3px 8px',
                        backgroundColor: COLORS.orchestration,
                        borderRadius: 4,
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 9,
                        fontWeight: 700,
                        color: COLORS.background,
                      }}
                    >
                      CODE
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key insight */}
            <div
              style={{
                marginTop: 30,
                opacity: interpolate(
                  spring({
                    frame: frame - EXAMPLES_IN - 40,
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
                  fontSize: 24,
                  color: COLORS.textMuted,
                }}
              >
                Same patterns.{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.orchestration,
                  fontWeight: 600,
                }}
              >
                Decades old.
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Return to ExplodedLayers */}
      {isLayersPhase && layersOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: layersOpacity,
          }}
        >
          <ExplodedLayers
            startFrame={LAYERS_RETURN}
            explodeAmount={0.7}
            showPercentages={true}
            highlightLayer="orchestration"
            scale={0.85}
          />

          {/* Annotation */}
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - LAYERS_RETURN - 30,
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
                fontSize: 28,
                color: COLORS.orchestration,
                fontWeight: 600,
              }}
            >
              30%
            </span>
            <span
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 28,
                color: COLORS.textMuted,
              }}
            >
              {' '}of the system — traditional async code
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Bottom caption during pipeline phase */}
      {isTrafficPhase && frame >= seconds(25) && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({
                frame: frame - seconds(25),
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
              fontSize: 22,
              color: COLORS.textMuted,
            }}
          >
            None of this is AI. This is{' '}
          </span>
          <span
            style={{
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 22,
              color: COLORS.orchestration,
              fontWeight: 600,
            }}
          >
            async programming
          </span>
          <span
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 22,
              color: COLORS.textMuted,
            }}
          >
            .
          </span>
        </div>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default Section2Orchestration;
