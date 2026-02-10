import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  EARTH_IN: 10,
  YEAR_LABEL: 15,
  ZOOM_OUT: 30,
  PARTICLE_START: 35,
  LIGHTYEARS_LABEL: 40,
  ATMO_ENTRY: 55,
  PARTICLE_HEAT: 60,
  BUILDING_ZOOM: 90,
  ROOF_PENETRATE: 100,
  CHIP_ZOOM: 120,
  IMPACT_FLASH: 130,
  BIT_FLIP_TEXT: 135,
};

/** Trail dot behind the cosmic ray particle */
const TrailDot: React.FC<{
  x: number;
  y: number;
  opacity: number;
  size: number;
  color: string;
}> = ({ x, y, opacity, size, color }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      opacity,
    }}
  />
);

export const Scene2_CosmicZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Global zoom scale across the scene ---
  const zoomScale = interpolate(
    frame,
    [0, BEATS.ZOOM_OUT, BEATS.ATMO_ENTRY, BEATS.BUILDING_ZOOM, BEATS.CHIP_ZOOM, 149],
    [1.0, 0.6, 2.0, 5.0, 12.0, 12.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Earth entrance ---
  const earthSpring = spring({
    frame: frame - BEATS.EARTH_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const earthScale = interpolate(earthSpring, [0, 1], [0.8, 1.0]);
  const earthOpacity = interpolate(
    frame,
    [BEATS.EARTH_IN, BEATS.EARTH_IN + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Particle position along diagonal path ---
  const particleProgress = interpolate(
    frame,
    [BEATS.PARTICLE_START, 149],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  // Particle starts top-right, ends center (on the chip)
  const particleX = interpolate(particleProgress, [0, 1], [900, 540]);
  const particleY = interpolate(particleProgress, [0, 1], [100, 960]);
  const particleVisible = frame >= BEATS.PARTICLE_START;

  // Particle color: purple trail, shifts to white on atmospheric entry
  const particleColorBlend = interpolate(
    frame,
    [BEATS.ATMO_ENTRY, BEATS.ATMO_ENTRY + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Particle glow during atmospheric entry
  const heatGlow = interpolate(
    frame,
    [BEATS.PARTICLE_HEAT, BEATS.PARTICLE_HEAT + 15],
    [0, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Impact flash ---
  const impactActive = frame >= BEATS.IMPACT_FLASH;
  const impactProgress = interpolate(
    frame,
    [BEATS.IMPACT_FLASH, BEATS.IMPACT_FLASH + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const impactScale = interpolate(impactProgress, [0, 0.4, 1], [0, 2.5, 0]);
  const impactOpacity = interpolate(impactProgress, [0, 0.2, 1], [1, 0.8, 0]);

  // --- Ring ripple ---
  const rippleRadius = interpolate(impactProgress, [0, 1], [0, 80]);
  const rippleOpacity = interpolate(impactProgress, [0, 1], [1, 0]);

  // --- Roof penetration flash ---
  const roofFlashActive = frame >= BEATS.ROOF_PENETRATE && frame < BEATS.ROOF_PENETRATE + 8;
  const roofFlashProgress = interpolate(
    frame,
    [BEATS.ROOF_PENETRATE, BEATS.ROOF_PENETRATE + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Trail dots: 4 positions behind the particle
  const trailPositions = [0.92, 0.84, 0.76, 0.68].map((ratio) => {
    const trailP = Math.max(0, particleProgress * ratio);
    return {
      x: interpolate(trailP, [0, 1], [900, 540]),
      y: interpolate(trailP, [0, 1], [100, 960]),
    };
  });
  const trailOpacities = [0.8, 0.5, 0.3, 0.1];

  // Dim everything after impact for BIT FLIP text
  const postImpactDim = interpolate(
    frame,
    [BEATS.BIT_FLIP_TEXT, BEATS.BIT_FLIP_TEXT + 10],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <SceneContainer background={COLORS.bgNavy} fadeIn fadeInDuration={15}>
      {/* Zoomable layer */}
      <AbsoluteFill
        style={{
          transform: `scale(${zoomScale})`,
          transformOrigin: '50% 50%',
          opacity: postImpactDim,
        }}
      >
        {/* Earth */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 150,
            top: 960 - 150,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #1E3A5F, #0B1120)',
            transform: `scale(${earthScale})`,
            opacity: earthOpacity,
            boxShadow: `0 0 40px rgba(139,92,246,0.3), inset 0 0 60px rgba(11,17,32,0.8)`,
          }}
        >
          {/* Atmosphere ring */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `2px solid ${COLORS.aiPurple}`,
              opacity: 0.3,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Year label */}
      {frame >= BEATS.YEAR_LABEL && (
        <div
          style={{
            position: 'absolute',
            top: LAYOUT.contentZoneTop - 60,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <AnimatedText
            variant="label"
            color="#C9A227"
            startFrame={BEATS.YEAR_LABEL}
            springPreset="snappy"
            entrance="fade"
            align="center"
          >
            2003 -- BELGIUM
          </AnimatedText>
        </div>
      )}

      {/* Light years label */}
      {frame >= BEATS.LIGHTYEARS_LABEL && (
        <div
          style={{
            position: 'absolute',
            top: 200,
            right: 80,
          }}
        >
          <AnimatedText
            variant="label"
            size={24}
            color={COLORS.textMuted}
            startFrame={BEATS.LIGHTYEARS_LABEL}
            entrance="fade"
          >
            MILLIONS OF LIGHT YEARS
          </AnimatedText>
        </div>
      )}

      {/* Particle trail */}
      {particleVisible && (
        <AbsoluteFill>
          {trailPositions.map((pos, i) => (
            <TrailDot
              key={i}
              x={pos.x}
              y={pos.y}
              opacity={trailOpacities[i]}
              size={4}
              color={particleColorBlend > 0.5 ? '#FFFFFF' : '#C4B5FD'}
            />
          ))}
        </AbsoluteFill>
      )}

      {/* Main particle */}
      {particleVisible && !impactActive && (
        <div
          style={{
            position: 'absolute',
            left: particleX - 3,
            top: particleY - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: particleColorBlend > 0.5 ? '#FFFFFF' : '#C4B5FD',
            boxShadow: heatGlow > 0
              ? `0 0 ${30 * heatGlow}px rgba(251,191,36,${heatGlow})`
              : `0 0 8px rgba(196,181,253,0.6)`,
          }}
        />
      )}

      {/* Building silhouette (visible during building zoom) */}
      {frame >= BEATS.BUILDING_ZOOM && (
        <AbsoluteFill
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: '50% 50%',
            opacity: postImpactDim,
          }}
        >
          {/* Building rectangle */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 100,
              top: 960 - 200,
              width: 200,
              height: 300,
              backgroundColor: '#0D1117',
              border: `1px solid ${COLORS.panelBorder}`,
              borderRadius: 4,
            }}
          >
            {/* Server rack inside */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 30,
                  top: 60 + i * 60,
                  width: 140,
                  height: 40,
                  backgroundColor: '#1A1A24',
                  border: `1px solid ${COLORS.panelBorder}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  gap: 6,
                }}
              >
                {/* LED dots */}
                {[0, 1].map((d) => (
                  <div
                    key={d}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: COLORS.techBlue,
                      boxShadow: `0 0 4px ${COLORS.techBlue}`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Roof penetration flash */}
          {roofFlashActive && (
            <div
              style={{
                position: 'absolute',
                left: 540 - 15,
                top: 960 - 215,
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: interpolate(roofFlashProgress, [0, 1], [1, 0]),
                transform: `scale(${interpolate(roofFlashProgress, [0, 1], [1, 3])})`,
              }}
            />
          )}

          {/* Chip (visible during chip zoom) */}
          {frame >= BEATS.CHIP_ZOOM && (
            <div
              style={{
                position: 'absolute',
                left: 540 - 40,
                top: 960 - 20,
                width: 80,
                height: 40,
                backgroundColor: '#1E293B',
                border: `1px solid ${COLORS.panelBorder}`,
                borderRadius: 2,
                boxShadow: impactActive
                  ? `0 0 20px rgba(239,68,68,0.5)`
                  : 'none',
              }}
            >
              {/* Pin lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 10 + i * 14,
                      top: -8,
                      width: 2,
                      height: 8,
                      backgroundColor: COLORS.textDim,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 10 + i * 14,
                      bottom: -8,
                      width: 2,
                      height: 8,
                      backgroundColor: COLORS.textDim,
                    }}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Impact flash */}
      {impactActive && (
        <AbsoluteFill>
          {/* Bright center flash */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 20,
              top: 960 - 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#FBBF24',
              opacity: impactOpacity,
              transform: `scale(${impactScale})`,
            }}
          />
          {/* Ring ripple */}
          <div
            style={{
              position: 'absolute',
              left: 540 - rippleRadius,
              top: 960 - rippleRadius,
              width: rippleRadius * 2,
              height: rippleRadius * 2,
              borderRadius: '50%',
              border: `2px solid ${COLORS.aiPurple}`,
              opacity: rippleOpacity,
            }}
          />
        </AbsoluteFill>
      )}

      {/* BIT FLIP text */}
      {frame >= BEATS.BIT_FLIP_TEXT && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 960 + 80,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ShinyText
            startFrame={BEATS.BIT_FLIP_TEXT}
            color={COLORS.aiPurple}
            shineColor="#C4B5FD"
            fontSize={56}
            fontWeight={700}
            duration={30}
          >
            BIT FLIP
          </ShinyText>
        </div>
      )}
    </SceneContainer>
  );
};
