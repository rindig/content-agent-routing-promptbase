import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
};

type AmbientBackgroundProps = {
  /** Base background color */
  color?: string;
  /** Number of floating particles */
  particleCount?: number;
  /** Particle color */
  particleColor?: string;
  /** Show subtle grid */
  showGrid?: boolean;
  /** Grid color */
  gridColor?: string;
  /** Gradient overlay direction */
  gradientDirection?: 'radial' | 'top' | 'bottom' | 'none';
  /** Gradient color (mixed with background) */
  gradientColor?: string;
  style?: React.CSSProperties;
};

// Seeded random for consistent particles
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  color = '#0a0a0a',
  particleCount = 30,
  particleColor = '#3b82f6',
  showGrid = false,
  gridColor = 'rgba(255,255,255,0.03)',
  gradientDirection = 'radial',
  gradientColor = '#1a1a2e',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Generate particles once
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      size: 2 + seededRandom(i * 3.3) * 4,
      speed: 0.1 + seededRandom(i * 4.4) * 0.3,
      opacity: 0.1 + seededRandom(i * 5.5) * 0.3,
      delay: seededRandom(i * 6.6) * 200,
    }));
  }, [particleCount]);

  // Gradient based on direction
  const getGradient = () => {
    switch (gradientDirection) {
      case 'radial':
        return `radial-gradient(ellipse at 50% 50%, ${gradientColor} 0%, ${color} 70%)`;
      case 'top':
        return `linear-gradient(to bottom, ${gradientColor} 0%, ${color} 50%)`;
      case 'bottom':
        return `linear-gradient(to top, ${gradientColor} 0%, ${color} 50%)`;
      default:
        return color;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: color, ...style }}>
      {/* Gradient overlay */}
      {gradientDirection !== 'none' && (
        <AbsoluteFill
          style={{
            background: getGradient(),
          }}
        />
      )}

      {/* Subtle grid */}
      {showGrid && (
        <AbsoluteFill
          style={{
            backgroundImage: `
              linear-gradient(${gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.5,
          }}
        />
      )}

      {/* Floating particles */}
      {particles.map((particle, i) => {
        // Slow floating motion
        const time = (frame + particle.delay) / fps;
        const floatY = Math.sin(time * particle.speed * 2) * 20;
        const floatX = Math.cos(time * particle.speed * 1.5) * 10;

        // Pulse opacity
        const pulseOpacity = particle.opacity * (0.7 + Math.sin(time * particle.speed * 3) * 0.3);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particleColor,
              opacity: pulseOpacity,
              transform: `translate(${floatX}px, ${floatY}px)`,
              boxShadow: `0 0 ${particle.size * 2}px ${particleColor}40`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Subtle vignette overlay
 */
export const Vignette: React.FC<{ intensity?: number; color?: string }> = ({
  intensity = 0.6,
  color = '#000000',
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${color} 100%)`,
      opacity: intensity,
      pointerEvents: 'none',
    }}
  />
);

/**
 * Animated gradient that slowly shifts
 */
export const ShiftingGradient: React.FC<{
  color1?: string;
  color2?: string;
  speed?: number;
}> = ({
  color1 = '#0a0a1a',
  color2 = '#1a0a2a',
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time = frame / fps;
  const angle = (time * speed * 30) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color1} 100%)`,
      }}
    />
  );
};

export default AmbientBackground;
