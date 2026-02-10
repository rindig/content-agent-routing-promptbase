import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  PANEL_IN: 0,
  CODE_TYPE: 10,
  GHOST_LIBS: 30,
  LIB_CARDS: 50,
  ARROW_UP: 70,
  LABEL: 85,
};

// ── Code lines with syntax coloring metadata ──
const CODE_LINES = [
  { text: 'import requests', keyword: 'import', lib: 'requests' },
  { text: 'from bs4 import BeautifulSoup', keyword: 'from', lib: 'bs4' },
  { text: 'import pandas as pd', keyword: 'import', lib: 'pandas' },
];

// ── Library card data ──
const LIBRARIES = [
  { name: 'requests', version: 'v2.31', stars: '52K' },
  { name: 'beautifulsoup4', version: 'v4.12', stars: '8K' },
  { name: 'pandas', version: 'v2.2', stars: '43K' },
];

// ── Typewriter code line ──
const TypewriterLine: React.FC<{
  line: typeof CODE_LINES[0];
  frame: number;
  startFrame: number;
  charsPerFrame: number;
}> = ({ line, frame, startFrame, charsPerFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const visibleChars = Math.min(
    Math.floor(relFrame * charsPerFrame),
    line.text.length
  );
  const visibleText = line.text.slice(0, visibleChars);

  // Color the keywords and library names
  const coloredParts: React.ReactNode[] = [];
  const keywords = ['import', 'from', 'as'];
  let remaining = visibleText;
  let keyIndex = 0;

  // Simple tokenizer: split by spaces and color keywords/lib names
  const tokens = remaining.split(' ');
  tokens.forEach((token, i) => {
    if (keywords.includes(token)) {
      coloredParts.push(
        <span key={keyIndex++} style={{ color: COLORS.aiPurple }}>{token}</span>
      );
    } else if (
      token === line.lib ||
      token === 'BeautifulSoup' ||
      token === 'pd' ||
      token === 'bs4'
    ) {
      coloredParts.push(
        <span key={keyIndex++} style={{ color: COLORS.techBlue }}>{token}</span>
      );
    } else {
      coloredParts.push(
        <span key={keyIndex++} style={{ color: COLORS.codeText }}>{token}</span>
      );
    }
    if (i < tokens.length - 1) {
      coloredParts.push(<span key={keyIndex++}> </span>);
    }
  });

  // Blinking cursor
  const cursorVisible = visibleChars < line.text.length
    ? Math.floor(relFrame / 8) % 2 === 0
    : false;

  return (
    <div style={{ marginBottom: 6, minHeight: 36 }}>
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 28,
          lineHeight: 1.6,
        }}
      >
        {coloredParts}
        {cursorVisible && (
          <span style={{ color: COLORS.textPrimary, opacity: 0.8 }}>|</span>
        )}
      </span>
    </div>
  );
};

// ── Ghost library icon ──
const GhostLib: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  targetY: number;
}> = ({ frame, fps, startFrame, targetY }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > 15) return null;

  const progress = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const y = interpolate(progress, [0, 1], [80, targetY]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 0.8, 0.4]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.35, 0.3, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: `translateX(-50%) translateY(${y}px) scale(${scale})`,
        opacity,
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: COLORS.techBlue,
      }}
    />
  );
};

// ── Library card ──
const LibraryCard: React.FC<{
  lib: typeof LIBRARIES[0];
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ lib, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const y = interpolate(enterProgress, [0, 1], [30, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: 8,
        padding: '10px 20px',
        width: 860,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        marginBottom: 6,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 26,
          color: COLORS.techBlue,
        }}
      >
        {lib.name}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 20,
            color: COLORS.textDim,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {lib.version}
        </span>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 20,
            color: COLORS.insightOrange,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {lib.stars} ★
        </span>
      </div>
    </div>
  );
};

// ── Extraction arrow (one-way, dashed, upward) ──
const ExtractionArrow: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const arrowHeight = 60;
  const dashOffset = arrowHeight * (1 - drawProgress);
  const opacity = interpolate(drawProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        opacity,
        margin: '8px 0',
      }}
    >
      <svg width={40} height={arrowHeight}>
        {/* Dashed line going up */}
        <line
          x1={20}
          y1={arrowHeight - 5}
          x2={20}
          y2={10}
          stroke={COLORS.techBlue}
          strokeWidth={3}
          strokeDasharray="6 4"
          strokeDashoffset={dashOffset}
        />
        {/* Arrowhead at top */}
        <polygon
          points="12,16 20,4 28,16"
          fill={COLORS.techBlue}
          opacity={drawProgress}
        />
      </svg>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel entrance
  const panelProgress = spring({
    frame: frame - BEATS.PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);
  const panelScale = interpolate(panelProgress, [0, 1], [0.96, 1]);

  // Label fade in
  const labelOpacity = frame >= BEATS.LABEL
    ? interpolate(frame - BEATS.LABEL, [0, 5], [0, 1], {
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
        }}
      >
        {/* Code editor panel */}
        <div
          style={{
            width: 860,
            backgroundColor: COLORS.codeBg,
            borderRadius: 12,
            padding: '20px 28px 24px',
            opacity: panelOpacity,
            transform: `scale(${panelScale})`,
            border: `1px solid ${COLORS.panelBorder}`,
            position: 'relative',
          }}
        >
          {/* Top bar with file tab */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: `1px solid ${COLORS.panelBorder}`,
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 20,
                color: COLORS.aiPurple,
                marginLeft: 12,
                textTransform: 'none',
                letterSpacing: 1,
              }}
            >
              AI Copilot
            </span>
          </div>

          {/* Typewriter code lines */}
          {CODE_LINES.map((line, i) => {
            const lineStart = BEATS.CODE_TYPE + i * 8;
            return (
              <TypewriterLine
                key={i}
                line={line}
                frame={frame}
                startFrame={lineStart}
                charsPerFrame={0.67}
              />
            );
          })}

          {/* Ghost library icons */}
          {[0, 1, 2].map((i) => (
            <GhostLib
              key={i}
              frame={frame}
              fps={fps}
              startFrame={BEATS.GHOST_LIBS + i * 6}
              targetY={-40 - i * 36}
            />
          ))}
        </div>

        {/* Extraction arrow */}
        <ExtractionArrow frame={frame} fps={fps} startFrame={BEATS.ARROW_UP} />

        {/* Library cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {LIBRARIES.map((lib, i) => (
            <LibraryCard
              key={lib.name}
              lib={lib}
              frame={frame}
              fps={fps}
              startFrame={BEATS.LIB_CARDS + i * 4}
            />
          ))}
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: labelOpacity,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.errorRed,
            }}
          >
            PULLED SILENTLY. NO RETURN.
          </span>
        </div>
      </div>
    </SceneContainer>
  );
};
