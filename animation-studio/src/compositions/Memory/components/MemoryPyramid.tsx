import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type MemoryLayer = {
  id: string;
  label: string;
  size: string;
  speed: string;
  color: string;
};

const LAYERS: MemoryLayer[] = [
  { id: 'registers', label: 'Registers', size: '64 bits each', speed: '1 cycle', color: '#ef4444' },
  { id: 'cache', label: 'Cache', size: 'KB → MB', speed: '~10 cycles', color: '#f97316' },
  { id: 'ram', label: 'RAM', size: 'GB', speed: '~100 cycles', color: '#eab308' },
  { id: 'disk', label: 'Disk / SSD', size: 'TB', speed: '~10,000 cycles', color: '#22c55e' },
  { id: 'archive', label: 'Archive / Tape', size: 'PB', speed: '~1,000,000 cycles', color: '#3b82f6' },
];

type MemoryPyramidProps = {
  startFrame?: number;
  /** Which layer to highlight (by id) */
  highlightLayer?: string;
  /** Show stats for highlighted layer */
  showStats?: boolean;
  /** Show speed/capacity labels on sides */
  showSideLabels?: boolean;
  /** Animate data flow particles */
  showDataFlow?: boolean;
  style?: React.CSSProperties;
};

export const MemoryPyramid: React.FC<MemoryPyramidProps> = ({
  startFrame = 0,
  highlightLayer,
  showStats = false,
  showSideLabels = true,
  showDataFlow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pyramidWidth = 700;
  const pyramidHeight = 500;
  const layerHeight = pyramidHeight / LAYERS.length;

  return (
    <div
      style={{
        position: 'relative',
        width: pyramidWidth + 300, // Extra space for labels
        height: pyramidHeight + 60,
        ...style,
      }}
    >
      {/* Side labels */}
      {showSideLabels && (
        <>
          {/* Speed label - left side */}
          <div
            style={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontSize: 20,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              whiteSpace: 'nowrap',
            }}
          >
            ← FASTER
          </div>

          {/* Capacity label - right side */}
          <div
            style={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              fontSize: 20,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              whiteSpace: 'nowrap',
            }}
          >
            LARGER →
          </div>
        </>
      )}

      {/* Pyramid layers */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 30,
          width: pyramidWidth,
          height: pyramidHeight,
        }}
      >
        {LAYERS.map((layer, i) => {
          const layerDelay = startFrame + i * 12;
          const progress = spring({
            frame: frame - layerDelay,
            fps,
            config: { damping: 18, stiffness: 150, mass: 0.8 },
          });

          // Pyramid shape: top is narrow, bottom is wide
          const topWidthPercent = 20 + i * 16;
          const bottomWidthPercent = 20 + (i + 1) * 16;

          const isHighlighted = highlightLayer === layer.id;
          const dimmed = highlightLayer && !isHighlighted;

          // Glow pulse for highlighted layer
          const pulse = isHighlighted ? Math.sin(frame / 10) * 0.3 + 1 : 1;

          const opacity = interpolate(progress, [0, 1], [0, dimmed ? 0.3 : 1]);
          const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1]);

          return (
            <div
              key={layer.id}
              style={{
                position: 'absolute',
                top: i * layerHeight,
                left: '50%',
                transform: `translateX(-50%) scale(${scale})`,
                opacity,
              }}
            >
              {/* Trapezoid shape using clip-path */}
              <div
                style={{
                  width: pyramidWidth * (bottomWidthPercent / 100),
                  height: layerHeight - 4,
                  background: isHighlighted
                    ? `linear-gradient(135deg, ${layer.color} 0%, ${layer.color}dd 100%)`
                    : `linear-gradient(135deg, ${layer.color}99 0%, ${layer.color}66 100%)`,
                  clipPath: `polygon(
                    ${((bottomWidthPercent - topWidthPercent) / bottomWidthPercent) * 50}% 0%,
                    ${100 - ((bottomWidthPercent - topWidthPercent) / bottomWidthPercent) * 50}% 0%,
                    100% 100%,
                    0% 100%
                  )`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: isHighlighted
                    ? `0 0 ${30 * pulse}px ${layer.color}60, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'box-shadow 0.3s',
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontWeight: 600,
                    color: '#fff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    marginTop: layerHeight * 0.15,
                  }}
                >
                  {layer.label}
                </span>
              </div>

              {/* Stats popup for highlighted layer */}
              {isHighlighted && showStats && (
                <div
                  style={{
                    position: 'absolute',
                    right: -220,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: COLORS.surface,
                    border: `2px solid ${layer.color}`,
                    borderRadius: 12,
                    padding: '16px 24px',
                    minWidth: 180,
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      color: layer.color,
                      marginBottom: 8,
                    }}
                  >
                    {layer.size}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      color: COLORS.textMuted,
                    }}
                  >
                    {layer.speed}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Data flow particles */}
        {showDataFlow && (
          <DataFlowParticles frame={frame} pyramidHeight={pyramidHeight} />
        )}
      </div>
    </div>
  );
};

// Animated particles flowing through the pyramid
const DataFlowParticles: React.FC<{
  frame: number;
  pyramidHeight: number;
}> = ({ frame, pyramidHeight }) => {
  const particles = Array.from({ length: 8 }, (_, i) => {
    const speed = 0.8 + (i % 3) * 0.3;
    const offset = i * 30;
    const y = ((frame * speed + offset) % (pyramidHeight + 100)) - 50;
    const x = Math.sin((frame + i * 20) / 30) * 30;
    const opacity = y < 50 || y > pyramidHeight - 50 ? 0.3 : 0.8;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `calc(50% + ${x}px)`,
          top: y,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: COLORS.accent,
          opacity,
          boxShadow: `0 0 10px ${COLORS.accent}`,
          transform: 'translateX(-50%)',
        }}
      />
    );
  });

  return <>{particles}</>;
};

export default MemoryPyramid;
