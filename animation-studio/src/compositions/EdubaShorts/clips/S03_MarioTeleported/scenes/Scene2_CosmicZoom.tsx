import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  TV_FRAME: 5,
  ROOM_ZOOM: 15,
  BUILDING_ZOOM: 45,
  STARS_IN: 55,
  SPACE_ZOOM: 75,
  EARTH_ARC: 80,
  PARTICLE_ORIGIN: 110,
  COSMIC_RAY_LABEL: 115,
  PARTICLE_DESCENT: 130,
  ATMO_ENTRY: 145,
  ROOF_PENETRATE: 155,
  CONSOLE_IMPACT: 170,
  RAM_LABEL: 178,
  CHIP_ZOOM: 195,
};

// Deterministic star positions
const STARS_FEW = [
  { x: 120, y: 180 },
  { x: 780, y: 120 },
  { x: 420, y: 80 },
  { x: 650, y: 220 },
  { x: 260, y: 160 },
];

const STARS_MANY = [
  { x: 90, y: 100 },
  { x: 200, y: 350 },
  { x: 350, y: 50 },
  { x: 500, y: 280 },
  { x: 620, y: 130 },
  { x: 740, y: 320 },
  { x: 850, y: 80 },
  { x: 150, y: 450 },
  { x: 400, y: 400 },
  { x: 700, y: 450 },
  { x: 50, y: 550 },
  { x: 950, y: 200 },
];

export const Scene2_CosmicZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Overall zoom scale ---
  // Phase 1: Zoom out (0 -> space)
  const zoomOutScale = interpolate(
    frame,
    [BEATS.SCENE_IN, BEATS.TV_FRAME, BEATS.ROOM_ZOOM, BEATS.BUILDING_ZOOM, BEATS.SPACE_ZOOM],
    [1.0, 0.7, 0.35, 0.15, 0.06],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Phase 2: Zoom back in (following particle)
  const zoomInScale = interpolate(
    frame,
    [BEATS.PARTICLE_DESCENT, BEATS.ATMO_ENTRY, BEATS.CONSOLE_IMPACT, BEATS.CHIP_ZOOM, 210],
    [0.06, 0.15, 0.35, 0.7, 3.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const currentScale = frame < BEATS.PARTICLE_DESCENT ? zoomOutScale : zoomInScale;

  // --- TV Frame (appears at BEATS.TV_FRAME) ---
  const tvProgress = spring({
    frame: frame - BEATS.TV_FRAME,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const tvOpacity = interpolate(tvProgress, [0, 1], [0, 1]);

  // --- Room (appears at BEATS.ROOM_ZOOM) ---
  const roomProgress = spring({
    frame: frame - BEATS.ROOM_ZOOM,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const roomOpacity = interpolate(roomProgress, [0, 1], [0, 0.3]);

  // --- Building (appears at BEATS.BUILDING_ZOOM) ---
  const buildingProgress = spring({
    frame: frame - BEATS.BUILDING_ZOOM,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const buildingOpacity = interpolate(buildingProgress, [0, 1], [0, 0.2]);

  // --- Stars ---
  const starsOpacity = interpolate(
    frame,
    [BEATS.STARS_IN, BEATS.STARS_IN + 20],
    [0, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Earth arc ---
  const earthProgress = spring({
    frame: frame - BEATS.EARTH_ARC,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const earthOpacity = interpolate(earthProgress, [0, 1], [0, 1]);

  // --- Particle ---
  const particleVisible = frame >= BEATS.PARTICLE_ORIGIN;
  const particleX = interpolate(
    frame,
    [BEATS.PARTICLE_ORIGIN, BEATS.PARTICLE_DESCENT, BEATS.CONSOLE_IMPACT, BEATS.CHIP_ZOOM],
    [800, 600, 540, 540],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const particleY = interpolate(
    frame,
    [BEATS.PARTICLE_ORIGIN, BEATS.PARTICLE_DESCENT, BEATS.ATMO_ENTRY, BEATS.CONSOLE_IMPACT, BEATS.CHIP_ZOOM],
    [200, 400, 700, 960, 960],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Particle heating (brightens as enters atmosphere)
  const isInAtmosphere = frame >= BEATS.ATMO_ENTRY;
  const particleColor = isInAtmosphere ? '#FFFFFF' : COLORS.particleTrail;
  const particleGlow = isInAtmosphere ? COLORS.impactFlash : COLORS.particleTrail;

  // --- Cosmic ray label ---
  const cosmicLabelProgress = spring({
    frame: frame - BEATS.COSMIC_RAY_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const cosmicLabelOpacity = interpolate(cosmicLabelProgress, [0, 1], [0, 1]);
  // Fade out label as particle descends
  const cosmicLabelFadeOut = interpolate(
    frame,
    [BEATS.PARTICLE_DESCENT, BEATS.PARTICLE_DESCENT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Roof penetration flash ---
  const roofFlashProgress = interpolate(
    frame,
    [BEATS.ROOF_PENETRATE, BEATS.ROOF_PENETRATE + 8],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const roofFlashScale = interpolate(
    frame,
    [BEATS.ROOF_PENETRATE, BEATS.ROOF_PENETRATE + 8],
    [1, 2.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Console impact ---
  const consoleImpactProgress = interpolate(
    frame,
    [BEATS.CONSOLE_IMPACT, BEATS.CONSOLE_IMPACT + 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const consoleFlashScale = interpolate(consoleImpactProgress, [0, 0.5, 1], [0, 2, 0]);
  const consoleGlowOpacity = interpolate(
    frame,
    [BEATS.CONSOLE_IMPACT, BEATS.CONSOLE_IMPACT + 5, BEATS.CONSOLE_IMPACT + 15],
    [0, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- RAM label ---
  const ramLabelProgress = spring({
    frame: frame - BEATS.RAM_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // --- Chip zoom phase ---
  const chipPhase = frame >= BEATS.CHIP_ZOOM;
  const chipProgress = spring({
    frame: frame - BEATS.CHIP_ZOOM,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const chipOpacity = interpolate(chipProgress, [0, 1], [0, 1]);

  // Impact glow on chip
  const chipImpactPulse = frame >= BEATS.CHIP_ZOOM + 5
    ? 0.5 + Math.sin((frame - BEATS.CHIP_ZOOM) * 0.3) * 0.3
    : 0;

  // Dim everything during chip zoom
  const priorLayersDim = interpolate(
    frame,
    [BEATS.CHIP_ZOOM, BEATS.CHIP_ZOOM + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background={COLORS.bgNavy} fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* --- Zoom container --- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${currentScale})`,
            opacity: priorLayersDim,
          }}
        >
          {/* Earth arc (far zoom) */}
          {frame >= BEATS.EARTH_ARC && (
            <div
              style={{
                position: 'absolute',
                bottom: -600,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 3000,
                height: 1200,
                borderRadius: '50%',
                background: 'linear-gradient(to top, #1E3A5F 0%, #0B1120 100%)',
                opacity: earthOpacity,
              }}
            />
          )}

          {/* Atmosphere band */}
          {frame >= BEATS.EARTH_ARC && (
            <div
              style={{
                position: 'absolute',
                bottom: 590,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 3200,
                height: 30,
                borderRadius: '50%',
                background: `linear-gradient(to top, rgba(139,92,246,0.05), transparent)`,
                opacity: earthOpacity,
              }}
            />
          )}

          {/* Stars (few for building phase) */}
          {frame >= BEATS.STARS_IN && STARS_FEW.map((star, i) => (
            <div
              key={`s-${i}`}
              style={{
                position: 'absolute',
                left: star.x,
                top: star.y,
                width: 2,
                height: 2,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: interpolate(
                  frame,
                  [BEATS.STARS_IN + i * 5, BEATS.STARS_IN + i * 5 + 10],
                  [0, 0.4],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            />
          ))}

          {/* Stars (many for space phase) */}
          {frame >= BEATS.SPACE_ZOOM && STARS_MANY.map((star, i) => (
            <div
              key={`sm-${i}`}
              style={{
                position: 'absolute',
                left: star.x,
                top: star.y,
                width: 2,
                height: 2,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: interpolate(
                  frame,
                  [BEATS.SPACE_ZOOM + i * 3, BEATS.SPACE_ZOOM + i * 3 + 8],
                  [0, 0.5],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            />
          ))}

          {/* Building silhouette */}
          {frame >= BEATS.BUILDING_ZOOM && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: buildingOpacity,
              }}
            >
              {/* Building body */}
              <div
                style={{
                  width: 200,
                  height: 260,
                  border: `1px solid ${COLORS.textMuted}`,
                  borderBottom: 'none',
                  position: 'relative',
                }}
              >
                {/* Roof triangle */}
                <div
                  style={{
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '110px solid transparent',
                    borderRight: '110px solid transparent',
                    borderBottom: `40px solid ${COLORS.textMuted}`,
                    opacity: 0.3,
                  }}
                />
              </div>

              {/* Room inside building */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '60%',
                  transform: 'translate(-50%, -50%)',
                  opacity: roomOpacity * 3,
                }}
              >
                {/* Room walls */}
                <div style={{ width: 100, height: 70, border: `1px solid ${COLORS.textMuted}`, position: 'relative' }}>
                  {/* TV */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 15,
                      top: 10,
                      width: 40,
                      height: 30,
                      backgroundColor: COLORS.bgSurface,
                      border: `2px solid ${COLORS.bgSurfaceAlt}`,
                      opacity: tvOpacity,
                    }}
                  >
                    {/* Game screen hint */}
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(107,147,214,0.15)' }} />
                  </div>

                  {/* Console */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 62,
                      top: 30,
                      width: 12,
                      height: 10,
                      backgroundColor: COLORS.textMuted,
                      opacity: tvOpacity * 0.6,
                      boxShadow: consoleGlowOpacity > 0
                        ? `0 0 20px rgba(139,92,246,${consoleGlowOpacity})`
                        : 'none',
                    }}
                  />

                  {/* Floor line */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      backgroundColor: COLORS.textMuted,
                      opacity: 0.3,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Roof penetration flash */}
          {frame >= BEATS.ROOF_PENETRATE && frame < BEATS.ROOF_PENETRATE + 8 && (
            <div
              style={{
                position: 'absolute',
                left: particleX,
                top: particleY - 100,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                opacity: roofFlashProgress,
                transform: `translate(-50%, -50%) scale(${roofFlashScale})`,
              }}
            />
          )}

          {/* Console impact flash */}
          {frame >= BEATS.CONSOLE_IMPACT && frame < BEATS.CONSOLE_IMPACT + 12 && (
            <div
              style={{
                position: 'absolute',
                left: particleX,
                top: particleY,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: COLORS.impactFlash,
                opacity: 1 - consoleImpactProgress,
                transform: `translate(-50%, -50%) scale(${consoleFlashScale})`,
              }}
            />
          )}

          {/* Cosmic ray particle */}
          {particleVisible && (
            <>
              {/* Trail dots */}
              {[0.8, 0.5, 0.3, 0.1, 0.05].map((opacity, i) => {
                const trailOffset = (i + 1) * 18;
                const trailY = particleY - trailOffset;
                const trailX = particleX + (i + 1) * 4;
                return (
                  <div
                    key={`trail-${i}`}
                    style={{
                      position: 'absolute',
                      left: trailX,
                      top: trailY,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: COLORS.particleTrail,
                      opacity,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}

              {/* Main particle */}
              <div
                style={{
                  position: 'absolute',
                  left: particleX,
                  top: particleY,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: particleColor,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${isInAtmosphere ? 20 : 10}px ${particleGlow}`,
                }}
              />
            </>
          )}

          {/* Cosmic ray label */}
          {frame >= BEATS.COSMIC_RAY_LABEL && frame < BEATS.PARTICLE_DESCENT + 15 && (
            <div
              style={{
                position: 'absolute',
                left: particleX + 20,
                top: particleY - 15,
                opacity: cosmicLabelOpacity * cosmicLabelFadeOut,
                fontFamily: 'Inter, sans-serif',
                fontSize: 24,
                fontWeight: 500,
                color: COLORS.aiPurple,
                textTransform: 'uppercase' as const,
                letterSpacing: 2,
                whiteSpace: 'nowrap',
              }}
            >
              COSMIC RAY
            </div>
          )}
        </div>

        {/* --- Chip zoom phase (overlays everything) --- */}
        {chipPhase && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: chipOpacity,
            }}
          >
            {/* Chip rectangle */}
            <div
              style={{
                width: 280,
                height: 160,
                border: `2px solid ${COLORS.techBlue}`,
                borderRadius: 8,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Pin lines — left */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`pl-${i}`}
                  style={{
                    position: 'absolute',
                    left: -20,
                    top: 20 + i * 22,
                    width: 20,
                    height: 1,
                    backgroundColor: COLORS.techBlue,
                    opacity: 0.4,
                  }}
                />
              ))}
              {/* Pin lines — right */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`pr-${i}`}
                  style={{
                    position: 'absolute',
                    right: -20,
                    top: 20 + i * 22,
                    width: 20,
                    height: 1,
                    backgroundColor: COLORS.techBlue,
                    opacity: 0.4,
                  }}
                />
              ))}

              {/* Impact glow on chip */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: COLORS.errorRed,
                  opacity: chipImpactPulse,
                  boxShadow: `0 0 16px rgba(239,68,68,${chipImpactPulse})`,
                }}
              />

              {/* Chip label */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 14,
                  color: COLORS.techBlue,
                  opacity: 0.5,
                }}
              >
                RAM
              </div>
            </div>

            {/* "BIT FLIP" text below chip */}
            {frame >= BEATS.CHIP_ZOOM + 10 && (
              <div style={{ marginTop: 30 }}>
                <ShinyText
                  color={COLORS.aiPurple}
                  shineColor="#FFFFFF"
                  fontSize={56}
                  fontWeight={700}
                  duration={30}
                  startFrame={BEATS.CHIP_ZOOM + 10}
                >
                  BIT FLIP
                </ShinyText>
              </div>
            )}

            {/* RAM label spring in */}
            <div
              style={{
                marginTop: 12,
                opacity: interpolate(ramLabelProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(ramLabelProgress, [0, 1], [15, 0])}px)`,
              }}
            >
              <ShinyText
                color={COLORS.techBlue}
                shineColor="#FFFFFF"
                fontSize={36}
                fontWeight={600}
                duration={40}
                startFrame={BEATS.RAM_LABEL}
              >
                MEMORY
              </ShinyText>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
