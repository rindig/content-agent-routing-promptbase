import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';
import { MenuItem } from './MenuItem';

interface MenuCardProps {
  title: string;
  items: Array<{ endpoint: string; description: string }>;
  color: string;
  startFrame: number;
  itemsStartFrame?: number;
  highlightIndex?: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  title,
  items,
  color,
  startFrame,
  itemsStartFrame,
  highlightIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const scale = frame >= startFrame ? interpolate(entrance, [0, 1], [0.97, 1]) : 0.97;

  const effectiveItemsStart = itemsStartFrame ?? startFrame + 10;

  return (
    <div
      style={{
        width: 760,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 16,
        border: `2px solid ${color}4D`,
        opacity,
        transform: `scale(${scale})`,
        padding: '16px 0',
        margin: '0 auto',
      }}
    >
      {/* Terminal dots */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 20px',
          alignItems: 'center',
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.errorRed }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.insightOrange }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.solutionGreen }} />
      </div>

      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.textBody,
          padding: '12px 0',
        }}
      >
        {title}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          backgroundColor: `${COLORS.textDim}4D`,
          margin: '0 20px 12px',
        }}
      />

      {/* Items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {items.map((item, i) => (
          <MenuItem
            key={i}
            endpoint={item.endpoint}
            description={item.description}
            color={color}
            startFrame={effectiveItemsStart}
            staggerIndex={i}
            highlighted={highlightIndex === i}
          />
        ))}
      </div>
    </div>
  );
};
