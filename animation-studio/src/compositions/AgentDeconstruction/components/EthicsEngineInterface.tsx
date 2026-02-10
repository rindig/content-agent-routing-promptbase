import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type MetricResult = {
  label: string;
  value: number;
  maxValue: number;
  color: string;
};

type DimensionResult = {
  label: string;
  score: string;
  color: string;
};

const METRICS: MetricResult[] = [
  { label: 'Test-Retest Reliability', value: 90, maxValue: 100, color: COLORS.ethicsSuccess },
  { label: 'Internal Consistency', value: 87, maxValue: 100, color: COLORS.ethicsSuccess },
  { label: 'Cross-Model Validity', value: 82, maxValue: 100, color: COLORS.ethicsAccent },
];

const DIMENSIONS: DimensionResult[] = [
  { label: 'Openness', score: '78/100', color: '#8B5CF6' },
  { label: 'Conscientiousness', score: '85/100', color: '#3B82F6' },
  { label: 'Extraversion', score: '42/100', color: '#EC4899' },
  { label: 'Agreeableness', score: '91/100', color: '#10B981' },
  { label: 'Neuroticism', score: '23/100', color: '#F59E0B' },
];

const MORAL_FOUNDATIONS = [
  { label: 'Care/Harm', value: 0.82 },
  { label: 'Fairness', value: 0.88 },
  { label: 'Loyalty', value: 0.45 },
  { label: 'Authority', value: 0.38 },
  { label: 'Sanctity', value: 0.31 },
];

type EthicsEngineInterfaceProps = {
  startFrame?: number;
  showResults?: boolean;
  explodeProgress?: number; // 0-1, how much layers are separating
};

export const EthicsEngineInterface: React.FC<EthicsEngineInterfaceProps> = ({
  startFrame = 0,
  showResults = true,
  explodeProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <div
      style={{
        width: 1100,
        backgroundColor: COLORS.ethicsInterface,
        borderRadius: 16,
        border: `1px solid ${COLORS.ethicsAccent}40`,
        boxShadow: `0 0 60px ${COLORS.ethicsAccent}20, 0 20px 60px rgba(0,0,0,0.5)`,
        overflow: 'hidden',
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        transform: `
          scale(${interpolate(baseProgress, [0, 1], [0.95, 1])})
          translateY(${explodeProgress * -20}px)
        `,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 30px',
          borderBottom: `1px solid ${COLORS.ethicsAccent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${COLORS.ethicsAccent}10 0%, transparent 50%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: COLORS.ethicsSuccess,
              boxShadow: `0 0 10px ${COLORS.ethicsSuccess}`,
            }}
          />
          <span
            style={{
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 18,
              color: COLORS.textPrimary,
              fontWeight: 600,
            }}
          >
            ETHICS ENGINE v2.4
          </span>
        </div>
        <span
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.textMuted,
          }}
        >
          Model: Claude-3.5-Sonnet
        </span>
      </div>

      {/* Main Content */}
      <div style={{ padding: 30, display: 'flex', gap: 30 }}>
        {/* Left Panel - Metrics */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${explodeProgress * -50}px)`,
            opacity: interpolate(explodeProgress, [0, 0.5], [1, 0.7]),
          }}
        >
          <h3
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 16,
              color: COLORS.textMuted,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Reliability Metrics
          </h3>
          {METRICS.map((metric, i) => {
            const delay = startFrame + 30 + i * 15;
            const metricProgress = spring({
              frame: frame - delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const barWidth = showResults
              ? interpolate(metricProgress, [0, 1], [0, metric.value])
              : 0;

            return (
              <div key={metric.label} style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontSize: 14,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {metric.label}
                  </span>
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.stats.fontFamily,
                      fontSize: 14,
                      color: metric.color,
                      fontWeight: 600,
                    }}
                  >
                    {Math.round(barWidth)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    backgroundColor: `${metric.color}20`,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      backgroundColor: metric.color,
                      borderRadius: 4,
                      boxShadow: `0 0 10px ${metric.color}60`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Panel - Personality */}
        <div
          style={{
            flex: 1.2,
            transform: `translateY(${explodeProgress * 30}px)`,
          }}
        >
          <h3
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 16,
              color: COLORS.textMuted,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Personality Dimensions
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {DIMENSIONS.map((dim, i) => {
              const delay = startFrame + 45 + i * 10;
              const dimProgress = spring({
                frame: frame - delay,
                fps,
                config: SPRING_CONFIGS.snappy,
              });

              return (
                <div
                  key={dim.label}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: `${dim.color}15`,
                    border: `1px solid ${dim.color}40`,
                    borderRadius: 8,
                    opacity: showResults ? interpolate(dimProgress, [0, 1], [0, 1]) : 0,
                    transform: `scale(${interpolate(dimProgress, [0, 1], [0.8, 1])})`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontSize: 13,
                      color: COLORS.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {dim.label}
                  </div>
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.stats.fontFamily,
                      fontSize: 18,
                      color: dim.color,
                      fontWeight: 600,
                    }}
                  >
                    {dim.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Moral Foundations */}
        <div
          style={{
            flex: 0.9,
            transform: `translateX(${explodeProgress * 50}px)`,
            opacity: interpolate(explodeProgress, [0, 0.5], [1, 0.7]),
          }}
        >
          <h3
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 16,
              color: COLORS.textMuted,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Moral Foundations
          </h3>
          {MORAL_FOUNDATIONS.map((foundation, i) => {
            const delay = startFrame + 60 + i * 8;
            const foundationProgress = spring({
              frame: frame - delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const value = showResults
              ? interpolate(foundationProgress, [0, 1], [0, foundation.value])
              : 0;

            return (
              <div
                key={foundation.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 13,
                    color: COLORS.textMuted,
                    width: 80,
                  }}
                >
                  {foundation.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    backgroundColor: `${COLORS.ethicsAccent}20`,
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${value * 100}%`,
                      height: '100%',
                      backgroundColor: COLORS.ethicsAccent,
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.stats.fontFamily,
                    fontSize: 13,
                    color: COLORS.ethicsAccent,
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  {value.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div
        style={{
          padding: '16px 30px',
          borderTop: `1px solid ${COLORS.ethicsAccent}20`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.textDim,
          }}
        >
          Assessment Complete • 847 items administered • 3 personas evaluated
        </span>
        <span
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.ethicsSuccess,
          }}
        >
          ● 90% Test-Retest Reliability
        </span>
      </div>
    </div>
  );
};

export default EthicsEngineInterface;
