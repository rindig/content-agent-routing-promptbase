import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface HouseMetaphorProps {
  startFrame: number;
  phase: 'paint' | 'structure' | 'full';
  width: number;
  height: number;
  x: number;
  y: number;
}

export const HouseMetaphor: React.FC<HouseMetaphorProps> = ({
  startFrame,
  phase,
  width,
  height,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const translateY = frame >= startFrame ? interpolate(entrance, [0, 1], [20, 0]) : 20;

  const showPaint = phase === 'paint' || phase === 'full';
  const showStructure = phase === 'structure' || phase === 'full';
  const paintOpacity = phase === 'full' ? 0.3 : phase === 'paint' ? 1 : 0.15;
  const structureGlow = phase === 'full' ? `0 0 20px ${COLORS.insightOrange}14` : 'none';

  // House dimensions relative to container
  const houseW = width * 0.8;
  const houseH = height * 0.7;
  const houseX = (width - houseW) / 2;
  const roofPeak = height * 0.05;
  const roofBase = height * 0.25;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Roof */}
        <polygon
          points={`${width / 2},${roofPeak} ${houseX},${roofBase} ${houseX + houseW},${roofBase}`}
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth={2}
          opacity={showPaint ? paintOpacity : 0.3}
        />

        {/* Outer walls */}
        <rect
          x={houseX}
          y={roofBase}
          width={houseW}
          height={houseH}
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth={2}
          opacity={showPaint ? paintOpacity : 0.3}
        />

        {/* Paint swatches */}
        {showPaint && (
          <>
            <rect x={houseX + 20} y={roofBase + 30} width={80} height={60} fill={COLORS.errorRed} opacity={paintOpacity * 0.5} rx={4} />
            <rect x={houseX + 120} y={roofBase + 30} width={80} height={60} fill={COLORS.techBlue} opacity={paintOpacity * 0.5} rx={4} />
            <rect x={houseX + 220} y={roofBase + 30} width={80} height={60} fill={COLORS.solutionGreen} opacity={paintOpacity * 0.5} rx={4} />
          </>
        )}

        {/* Structural elements */}
        {showStructure && (
          <g style={{ filter: structureGlow !== 'none' ? `drop-shadow(${structureGlow})` : 'none' }}>
            {/* Load-bearing walls (thick orange) */}
            <line x1={width / 2} y1={roofBase} x2={width / 2} y2={roofBase + houseH} stroke={COLORS.insightOrange} strokeWidth={4} />
            <line x1={houseX + houseW * 0.3} y1={roofBase + houseH * 0.5} x2={houseX + houseW * 0.7} y2={roofBase + houseH * 0.5} stroke={COLORS.insightOrange} strokeWidth={4} />

            {/* Plumbing (dashed blue) */}
            <line x1={houseX + 40} y1={roofBase + 20} x2={houseX + 40} y2={roofBase + houseH - 20} stroke={COLORS.techBlue} strokeWidth={2} strokeDasharray="8 4" />
            <line x1={houseX + 40} y1={roofBase + houseH * 0.6} x2={houseX + houseW * 0.4} y2={roofBase + houseH * 0.6} stroke={COLORS.techBlue} strokeWidth={2} strokeDasharray="8 4" />

            {/* Electrical (dotted orange-light) */}
            <line x1={houseX + houseW - 40} y1={roofBase + 30} x2={houseX + houseW - 40} y2={roofBase + houseH - 30} stroke={COLORS.insightOrange} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
            <line x1={houseX + houseW * 0.5} y1={roofBase + houseH * 0.3} x2={houseX + houseW - 40} y2={roofBase + houseH * 0.3} stroke={COLORS.insightOrange} strokeWidth={2} strokeDasharray="4 6" opacity={0.6} />
          </g>
        )}
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 500,
          fontSize: 32,
          color: phase === 'paint' ? COLORS.textMuted : COLORS.insightOrange,
          whiteSpace: 'nowrap',
        }}
      >
        {phase === 'paint' ? 'Paint = Words' : 'Structure = Architecture'}
      </div>
    </div>
  );
};
