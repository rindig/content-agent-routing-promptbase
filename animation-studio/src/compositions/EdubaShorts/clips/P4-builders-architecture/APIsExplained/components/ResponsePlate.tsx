import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface ResponsePlateProps {
  label: string;
  color: string;
  size: number;
  startFrame: number;
  x?: number;
  y?: number;
}

export const ResponsePlate: React.FC<ResponsePlateProps> = ({
  label,
  color,
  size,
  startFrame,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const scale = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: `${color}26`,
    border: `2px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `scale(${scale})`,
    fontFamily: TYPOGRAPHY.body.fontFamily,
    fontWeight: 500,
    fontSize: 24,
    color: '#E5E7EB',
  };

  if (x !== undefined && y !== undefined) {
    return (
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
        }}
      >
        <div style={style}>
          {label}
        </div>
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: -(size * 0.25),
            left: -(size * 0.25),
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
            pointerEvents: 'none',
            transform: `scale(${scale})`,
          }}
        />
      </div>
    );
  }

  return (
    <div style={style}>
      {label}
    </div>
  );
};
