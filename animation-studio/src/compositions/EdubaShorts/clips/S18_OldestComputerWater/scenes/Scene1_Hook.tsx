import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  MODERN_ICON_IN: 0,
  REWIND_START: 15,
  REWIND_DURATION: 35,
  ICON_MORPH_1: 20,
  ICON_MORPH_2: 30,
  ICON_MORPH_3: 40,
  DATE_LAND: 50,
  LOCATION_IN: 70,
};

// ── Modern Computer Icon ──
const ModernMonitor: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Monitor */}
    <div
      style={{
        width: 200,
        height: 140,
        borderRadius: 12,
        border: `2px solid ${COLORS.techBlue}`,
        backgroundColor: COLORS.bgSurfaceAlt,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 2,
          height: 20,
          backgroundColor: COLORS.techBlue,
        }}
      />
    </div>
    {/* Stand */}
    <div
      style={{
        width: 4,
        height: 16,
        backgroundColor: COLORS.techBlue,
        marginTop: -1,
      }}
    />
    <div
      style={{
        width: 60,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.techBlue,
      }}
    />
  </div>
);

// ── Mainframe Box ──
const MainframeBox: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: 4,
        border: `2px solid ${interpolateColor(0.5)}`,
        backgroundColor: 'rgba(26,26,36,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {/* Tape reels */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `2px solid ${interpolateColor(0.5)}`,
          }}
        />
      ))}
      {/* Lights */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: interpolateColor(0.5),
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ── Loom Shape ──
const LoomShape: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        width: 140,
        height: 160,
        border: `2px solid ${COLORS.historyGold}`,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
      }}
    >
      {/* Top beam */}
      <div style={{ width: '100%', height: 3, backgroundColor: COLORS.historyGold }} />
      {/* Threads */}
      <div style={{ display: 'flex', gap: 10, flex: 1, alignItems: 'stretch', paddingTop: 8 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 2,
              backgroundColor: COLORS.historyGold,
              opacity: 0.5,
              height: '100%',
            }}
          />
        ))}
      </div>
      {/* Bottom beam */}
      <div style={{ width: '100%', height: 3, backgroundColor: COLORS.historyGold }} />
    </div>
  </div>
);

// ── Ancient Theater Arch ──
const TheaterArch: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      {/* Arch top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 20,
          right: 20,
          height: 60,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          border: `2px solid ${COLORS.historyGold}`,
          borderBottom: 'none',
        }}
      />
      {/* Left column */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: 20,
          width: 16,
          height: 100,
          backgroundColor: 'transparent',
          border: `2px solid ${COLORS.historyGold}`,
          borderRadius: 3,
        }}
      />
      {/* Right column */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          right: 20,
          width: 16,
          height: 100,
          backgroundColor: 'transparent',
          border: `2px solid ${COLORS.historyGold}`,
          borderRadius: 3,
        }}
      />
    </div>
  </div>
);

// Helper: interpolate color between techBlue and historyGold
function interpolateColor(t: number): string {
  // Simple hex lerp between #3B82F6 (techBlue) and #C9A227 (historyGold)
  const r1 = 59, g1 = 130, b1 = 246;
  const r2 = 201, g2 = 162, b2 = 39;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Icon entrance ──
  const iconEnter = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const iconScale = interpolate(iconEnter, [0, 1], [0.3, 1]);
  const iconOpacity = interpolate(iconEnter, [0, 1], [0, 1]);

  // ── Rewind progress (frames 15-50, 35 frames) ──
  const rewindRaw = interpolate(
    frame,
    [BEATS.REWIND_START, BEATS.REWIND_START + BEATS.REWIND_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Deceleration curve (fast start, slow end)
  const rewindProgress = 1 - Math.pow(1 - rewindRaw, 3);

  // ── Year counter ──
  const yearValue = Math.round(2026 - (2026 - 62) * rewindProgress);
  const isRewindActive = frame >= BEATS.REWIND_START;
  const isRewindDone = frame >= BEATS.DATE_LAND;

  // ── Color transition ──
  const colorT = interpolate(
    frame,
    [BEATS.REWIND_START, BEATS.DATE_LAND],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const yearColor = interpolateColor(colorT);

  // ── Icon morphing: cross-fade between 4 states ──
  const morphT = interpolate(
    frame,
    [BEATS.MODERN_ICON_IN, BEATS.ICON_MORPH_1, BEATS.ICON_MORPH_2, BEATS.ICON_MORPH_3],
    [0, 1, 2, 3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const modernOpacity = interpolate(morphT, [0, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mainframeOpacity = interpolate(morphT, [0.5, 1, 1.5, 2], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const loomOpacity = interpolate(morphT, [1.5, 2, 2.5, 3], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const archOpacity = interpolate(morphT, [2.5, 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Date landing animation ──
  const dateLandProgress = spring({
    frame: Math.max(0, frame - BEATS.DATE_LAND),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const dateLandScale = interpolate(dateLandProgress, [0, 1], [0.5, 1]);
  const dateLandOpacity = interpolate(dateLandProgress, [0, 1], [0, 1]);

  // ── Location label ──
  const locationProgress = spring({
    frame: Math.max(0, frame - BEATS.LOCATION_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const locationY = interpolate(locationProgress, [0, 1], [20, 0]);
  const locationOpacity = interpolate(locationProgress, [0, 1], [0, 1]);

  // ── Background color transition ──
  const bgBlend = interpolate(
    frame,
    [BEATS.REWIND_START, BEATS.DATE_LAND + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={8}
    >
      {/* Warm bg overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.bgWarm,
          opacity: bgBlend,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Morphing icon area */}
        <div
          style={{
            position: 'relative',
            width: 200,
            height: 180,
            transform: `scale(${iconScale})`,
            opacity: iconOpacity,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ModernMonitor opacity={modernOpacity} />
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MainframeBox opacity={mainframeOpacity} />
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoomShape opacity={loomOpacity} />
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TheaterArch opacity={archOpacity} />
          </div>
        </div>

        {/* Year counter / Date label */}
        {!isRewindDone && (
          <div
            style={{
              ...TYPOGRAPHY.code,
              fontSize: isRewindActive ? 40 : 28,
              color: isRewindActive ? yearColor : COLORS.techBlue,
              fontVariantNumeric: 'tabular-nums',
              transition: 'none',
            }}
          >
            {isRewindActive ? yearValue : '2026'}
          </div>
        )}

        {/* Landed date: "62 CE" */}
        {isRewindDone && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 72,
                color: COLORS.historyGold,
                opacity: dateLandOpacity,
                transform: `scale(${dateLandScale})`,
              }}
            >
              62 CE
            </div>

            {/* Alexandria label */}
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.historyGold,
                opacity: locationOpacity,
                transform: `translateY(${locationY}px)`,
              }}
            >
              Alexandria
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
