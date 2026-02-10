/**
 * Scene 3E: Spec Detail Levels
 * [3:15 - 3:35] — 600 frames
 *
 * "You can write specs at different levels of detail depending on where
 *  you want control. A loose spec means Claude makes more interpretive
 *  choices. A tight spec means you're directing every beat. Neither is
 *  wrong. It depends on where you want your creative energy to go."
 *
 * Visual: Slider between loose and tight, showing tradeoffs
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

// Timeline
const PHASE = {
  SPECTRUM_INTRO: 0,
  LOOSE_VIS: 150,
  TIGHT_VIS: 300,
  NEITHER_WRONG: 450,
  ENERGY_CLOSE: 540,
};

// ============================================================
// SPECTRUM SLIDER
// ============================================================
const SpectrumSlider: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const sliderOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const sliderY = interpolate(entrance, [0, 1], [30, 0]);

  // Knob position: 0 = center, -1 = left (loose), 1 = right (tight), back to 0
  const knobPosition = (() => {
    if (frame < PHASE.LOOSE_VIS) return 0;
    if (frame < PHASE.LOOSE_VIS + 60) {
      // Animate to loose (left)
      const p = spring({ frame: frame - PHASE.LOOSE_VIS, fps, config: SPRING_CONFIGS.snappy });
      return interpolate(p, [0, 1], [0, -1]);
    }
    if (frame < PHASE.TIGHT_VIS) return -1;
    if (frame < PHASE.TIGHT_VIS + 60) {
      // Animate to tight (right)
      const p = spring({ frame: frame - PHASE.TIGHT_VIS, fps, config: SPRING_CONFIGS.snappy });
      return interpolate(p, [0, 1], [-1, 1]);
    }
    if (frame < PHASE.NEITHER_WRONG) return 1;
    if (frame < PHASE.NEITHER_WRONG + 60) {
      // Animate to center
      const p = spring({ frame: frame - PHASE.NEITHER_WRONG, fps, config: SPRING_CONFIGS.gentle });
      return interpolate(p, [0, 1], [1, 0]);
    }
    return 0;
  })();

  const sliderWidth = 700;
  const knobX = sliderWidth / 2 + knobPosition * (sliderWidth / 2 - 20);

  // Glow based on position
  const isLoose = knobPosition < -0.3;
  const isTight = knobPosition > 0.3;
  const knobColor = isLoose ? COLORS.spec : isTight ? COLORS.build : COLORS.textMuted;
  const pulse = Math.sin(frame * 0.08) * 4 + 8;

  return (
    <div
      style={{
        opacity: sliderOpacity,
        transform: `translateY(${sliderY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      {/* Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: sliderWidth,
        }}
      >
        <div
          style={{
            fontSize: SIZES.label,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontWeight: 700,
            color: isLoose ? COLORS.spec : COLORS.textDim,
            letterSpacing: '0.08em',
            transition: 'color 0.3s',
          }}
        >
          LOOSE
        </div>
        <div
          style={{
            fontSize: SIZES.label,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontWeight: 700,
            color: isTight ? COLORS.build : COLORS.textDim,
            letterSpacing: '0.08em',
            transition: 'color 0.3s',
          }}
        >
          TIGHT
        </div>
      </div>

      {/* Slider track */}
      <div style={{ position: 'relative', width: sliderWidth, height: 12 }}>
        <div
          style={{
            width: '100%',
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${COLORS.spec}60, ${COLORS.textDim}40, ${COLORS.build}60)`,
            position: 'absolute',
            top: 2,
          }}
        />
        {/* Active glow on track */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: knobX - 40,
            width: 80,
            height: 12,
            borderRadius: 6,
            background: `${knobColor}30`,
            filter: `blur(8px)`,
          }}
        />
        {/* Knob */}
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: knobX - 14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: `0 0 ${pulse}px ${knobColor}, 0 2px 8px rgba(0,0,0,0.5)`,
            border: `3px solid ${knobColor}`,
          }}
        />
      </div>
    </div>
  );
};

// ============================================================
// LOOSE SPEC VISUALIZATION
// ============================================================
const LooseSpecVis: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Exit when tight starts
  const exit = interpolate(frame, [PHASE.TIGHT_VIS - 30, PHASE.TIGHT_VIS], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < startFrame || frame > PHASE.TIGHT_VIS + 15) return null;

  // Branching paths from spec
  const pathProgress = interpolate(frame, [startFrame + 40, startFrame + 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: opacity * exit,
        display: 'flex',
        gap: 60,
        alignItems: 'center',
      }}
    >
      {/* Sparse spec doc */}
      <div
        style={{
          width: 200,
          height: 260,
          backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.spec}`,
          borderRadius: 12,
          padding: 20,
          position: 'relative',
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}` }} />
        <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}` }} />
        <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}` }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}` }} />

        {/* Sparse content - few bullet points */}
        <div style={{ marginTop: 16 }}>
          {['Scene: Opening', '• Make it dramatic', '• Show the tools'].map((line, i) => {
            const lineEntrance = spring({
              frame: frame - startFrame - 15 - i * 12,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const lineOpacity = interpolate(lineEntrance, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: i === 0 ? COLORS.spec : COLORS.textMuted,
                  marginBottom: 14,
                  opacity: lineOpacity,
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>

        {/* Lots of empty space */}
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div style={{ height: 1, backgroundColor: `${COLORS.textDim}20` }} />
          <div style={{ fontSize: 11, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim, marginTop: 8, textAlign: 'center' }}>
            ···
          </div>
        </div>
      </div>

      {/* Branching paths SVG */}
      <svg width="280" height="200" viewBox="0 0 280 200">
        {/* Multiple branching outputs */}
        {[
          { endY: 30, label: 'Output A', color: COLORS.spec },
          { endY: 80, label: 'Output B', color: `${COLORS.spec}CC` },
          { endY: 130, label: 'Output C', color: `${COLORS.spec}99` },
          { endY: 170, label: 'Output D', color: `${COLORS.spec}66` },
        ].map((path, i) => {
          const pathDelay = i * 0.15;
          const draw = Math.max(0, Math.min(1, (pathProgress - pathDelay) / (1 - pathDelay)));
          return (
            <g key={i}>
              <path
                d={`M 0 100 Q 80 100 140 ${path.endY + 10} L ${200 * draw + 60} ${path.endY + 10 + (100 - path.endY - 10) * (1 - draw) * 0.2}`}
                stroke={path.color}
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${draw * 300} 300`}
                opacity={0.7}
              />
              {draw > 0.8 && (
                <text
                  x={270}
                  y={path.endY + 15}
                  fill={path.color}
                  fontSize="12"
                  fontFamily={TYPOGRAPHY.code.fontFamily}
                  opacity={Math.min(1, (draw - 0.8) * 5)}
                >
                  {path.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Question marks */}
        {pathProgress > 0.5 && (
          <text
            x="140"
            y="115"
            fill={COLORS.textMuted}
            fontSize="24"
            fontFamily={TYPOGRAPHY.display.fontFamily}
            textAnchor="middle"
            opacity={Math.sin(frame * 0.06) * 0.3 + 0.5}
          >
            ?
          </text>
        )}
      </svg>

      {/* Label */}
      <div style={{ position: 'absolute', top: -40, width: '100%', textAlign: 'center' }}>
        <span
          style={{
            fontSize: 22,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textMuted,
          }}
        >
          Claude makes <span style={{ color: COLORS.spec, fontWeight: 600 }}>interpretive choices</span>
        </span>
      </div>
    </div>
  );
};

// ============================================================
// TIGHT SPEC VISUALIZATION
// ============================================================
const TightSpecVis: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Exit when neither-wrong starts
  const exit = interpolate(frame, [PHASE.NEITHER_WRONG - 30, PHASE.NEITHER_WRONG], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < startFrame || frame > PHASE.NEITHER_WRONG + 15) return null;

  // Single path progress
  const pathProgress = interpolate(frame, [startFrame + 40, startFrame + 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: opacity * exit,
        display: 'flex',
        gap: 60,
        alignItems: 'center',
      }}
    >
      {/* Dense spec doc */}
      <div
        style={{
          width: 200,
          height: 260,
          backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.build}`,
          borderRadius: 12,
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.build}`, borderLeft: `2px solid ${COLORS.build}` }} />
        <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.build}`, borderRight: `2px solid ${COLORS.build}` }} />
        <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.build}`, borderLeft: `2px solid ${COLORS.build}` }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.build}`, borderRight: `2px solid ${COLORS.build}` }} />

        {/* Dense content */}
        <div style={{ marginTop: 8 }}>
          {[
            { text: '# Scene 1: Hook', color: COLORS.build, bold: true },
            { text: '[0:00-0:08] 240fr', color: COLORS.textDim, bold: false },
            { text: '• Text: 84px, white', color: COLORS.textMuted, bold: false },
            { text: '• Spring: snappy d20', color: COLORS.textMuted, bold: false },
            { text: '• GlitchText on word', color: COLORS.textMuted, bold: false },
            { text: '• CountUp 168→0:58', color: COLORS.textMuted, bold: false },
            { text: '• Particle burst @150', color: COLORS.textMuted, bold: false },
            { text: '• Hold + breathe 210', color: COLORS.textMuted, bold: false },
            { text: '• Glow: #22C55E', color: COLORS.textMuted, bold: false },
          ].map((line, i) => {
            const lineEntrance = spring({
              frame: frame - startFrame - 8 - i * 6,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const lineOpacity = interpolate(lineEntrance, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: line.color,
                  marginBottom: 6,
                  opacity: lineOpacity,
                  fontWeight: line.bold ? 600 : 400,
                  lineHeight: 1.2,
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Scan line */}
        <div
          style={{
            position: 'absolute',
            top: `${((frame % 120) / 120) * 100}%`,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.build}30, transparent)`,
          }}
        />
      </div>

      {/* Single precise path */}
      <svg width="280" height="200" viewBox="0 0 280 200">
        <path
          d={`M 0 100 L ${260 * pathProgress} 100`}
          stroke={COLORS.build}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        {pathProgress > 0.9 && (
          <polygon
            points={`${260 * pathProgress - 8},92 ${260 * pathProgress},100 ${260 * pathProgress - 8},108`}
            fill={COLORS.build}
            opacity={Math.min(1, (pathProgress - 0.9) * 10)}
          />
        )}
        {/* Single output */}
        {pathProgress > 0.8 && (
          <g opacity={Math.min(1, (pathProgress - 0.8) * 5)}>
            <rect x="240" y="80" width="36" height="40" rx="4" fill={COLORS.surface} stroke={COLORS.build} strokeWidth="2" />
            <text x="258" y="105" textAnchor="middle" fill={COLORS.build} fontSize="10" fontFamily={TYPOGRAPHY.code.fontFamily}>
              OUT
            </text>
          </g>
        )}
        {/* Precision indicator */}
        {pathProgress > 0.5 && (
          <text
            x="130"
            y="85"
            fill={COLORS.build}
            fontSize="14"
            fontFamily={TYPOGRAPHY.code.fontFamily}
            textAnchor="middle"
            opacity={0.6}
          >
            precise
          </text>
        )}
      </svg>

      {/* Label */}
      <div style={{ position: 'absolute', top: -40, width: '100%', textAlign: 'center' }}>
        <span
          style={{
            fontSize: 22,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textMuted,
          }}
        >
          You direct <span style={{ color: COLORS.build, fontWeight: 600 }}>every beat</span>
        </span>
      </div>
    </div>
  );
};

// ============================================================
// NEITHER IS WRONG
// ============================================================
const NeitherWrong: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exit = interpolate(frame, [PHASE.ENERGY_CLOSE - 15, PHASE.ENERGY_CLOSE], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < startFrame) return null;

  // Check animations
  const check1 = spring({ frame: frame - startFrame - 20, fps, config: { damping: 15, stiffness: 300, mass: 0.5 } });
  const check2 = spring({ frame: frame - startFrame - 40, fps, config: { damping: 15, stiffness: 300, mass: 0.5 } });

  return (
    <div
      style={{
        opacity: opacity * exit,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
      }}
    >
      <div
        style={{
          fontSize: SIZES.body,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.text,
        }}
      >
        Neither is wrong
      </div>

      <div style={{ display: 'flex', gap: 80 }}>
        {/* Loose check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" rx="6" fill={COLORS.spec} opacity={0.2} stroke={COLORS.spec} strokeWidth="2" />
            <path
              d="M12 20 L18 26 L28 14"
              stroke={COLORS.spec}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={40}
              strokeDashoffset={40 * (1 - check1)}
            />
          </svg>
          <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.spec }}>LOOSE</span>
        </div>

        {/* Tight check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect x="4" y="4" width="32" height="32" rx="6" fill={COLORS.build} opacity={0.2} stroke={COLORS.build} strokeWidth="2" />
            <path
              d="M12 20 L18 26 L28 14"
              stroke={COLORS.build}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={40}
              strokeDashoffset={40 * (1 - check2)}
            />
          </svg>
          <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build }}>TIGHT</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ENERGY CLOSE
// ============================================================
const EnergyClose: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  if (frame < startFrame) return null;

  // Energy particle flowing along slider
  const particleX = ((frame - startFrame) % 80) / 80;
  const energyPulse = Math.sin(frame * 0.1) * 3 + 6;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <div
        style={{
          fontSize: SIZES.body,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Where do you want your{' '}
        <span
          style={{
            color: COLORS.emphasis,
            fontWeight: 700,
            textShadow: `0 0 ${energyPulse}px ${COLORS.emphasis}60`,
          }}
        >
          creative energy
        </span>
        ?
      </div>

      {/* Mini slider with energy particle */}
      <svg width="400" height="40" viewBox="0 0 400 40">
        <rect x="40" y="17" width="320" height="6" rx="3" fill={`${COLORS.textDim}40`} />
        <text x="20" y="24" fill={COLORS.spec} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily} textAnchor="middle">L</text>
        <text x="380" y="24" fill={COLORS.build} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily} textAnchor="middle">T</text>

        {/* Flowing energy dot */}
        <circle
          cx={60 + particleX * 280}
          cy={20}
          r={6}
          fill={COLORS.emphasis}
          opacity={0.9}
        >
        </circle>
        <circle
          cx={60 + particleX * 280}
          cy={20}
          r={12}
          fill={COLORS.emphasis}
          opacity={0.2}
        />
      </svg>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3E_SpecDetailLevels: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Spectrum slider - always visible */}
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <SpectrumSlider />
      </div>

      {/* Loose spec visualization */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <LooseSpecVis startFrame={PHASE.LOOSE_VIS} />
      </div>

      {/* Tight spec visualization */}
      <div
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <TightSpecVis startFrame={PHASE.TIGHT_VIS} />
      </div>

      {/* Neither is wrong */}
      {frame >= PHASE.NEITHER_WRONG && frame < PHASE.ENERGY_CLOSE + 15 && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <NeitherWrong startFrame={PHASE.NEITHER_WRONG} />
        </div>
      )}

      {/* Energy close */}
      {frame >= PHASE.ENERGY_CLOSE && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <EnergyClose startFrame={PHASE.ENERGY_CLOSE} />
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene3E_SpecDetailLevels;
