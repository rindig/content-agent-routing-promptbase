import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

// Syntax colors
const SYNTAX = {
  keyword: '#c678dd',    // Purple
  function: '#61afef',   // Blue
  string: '#98c379',     // Green
  number: '#d19a66',     // Orange
  comment: '#5c6370',    // Gray
  text: '#abb2bf',       // Light gray
};

type CodeBlockProps = {
  code: string;
  language?: 'python' | 'javascript' | 'plain';
  typewriter?: boolean;
  typewriterDelay?: number;
  startFrame?: number;
  fontSize?: number;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  style?: React.CSSProperties;
};

const highlightPython = (line: string): React.ReactNode => {
  // Match print function call
  const printMatch = line.match(/^(\s*)(print)(\()(.*)(\))$/);
  if (printMatch) {
    const [, indent, func, paren1, args, paren2] = printMatch;
    return (
      <>
        {indent}
        <span style={{ color: SYNTAX.function }}>{func}</span>
        <span style={{ color: SYNTAX.text }}>{paren1}</span>
        <span style={{ color: SYNTAX.string }}>{args}</span>
        <span style={{ color: SYNTAX.text }}>{paren2}</span>
      </>
    );
  }

  // Keywords
  const keywords = ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while', 'True', 'False', 'None'];
  for (const kw of keywords) {
    if (line.includes(kw)) {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      const parts = line.split(regex);
      return (
        <>
          {parts.map((part, i) =>
            part === kw ? (
              <span key={i} style={{ color: SYNTAX.keyword }}>{part}</span>
            ) : (
              <span key={i} style={{ color: SYNTAX.text }}>{part}</span>
            )
          )}
        </>
      );
    }
  }

  // Strings
  const stringMatch = line.match(/(".*?"|'.*?')/);
  if (stringMatch) {
    const idx = line.indexOf(stringMatch[1]);
    return (
      <>
        <span style={{ color: SYNTAX.text }}>{line.slice(0, idx)}</span>
        <span style={{ color: SYNTAX.string }}>{stringMatch[1]}</span>
        <span style={{ color: SYNTAX.text }}>{line.slice(idx + stringMatch[1].length)}</span>
      </>
    );
  }

  return <span style={{ color: SYNTAX.text }}>{line}</span>;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  typewriter = false,
  typewriterDelay = 2,
  startFrame = 0,
  fontSize = 32,
  showLineNumbers = false,
  highlightLines = [],
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typewriter effect
  let visibleCode = code;
  if (typewriter) {
    const adjustedFrame = frame - startFrame;
    if (adjustedFrame < 0) {
      visibleCode = '';
    } else {
      const charsToShow = Math.floor(adjustedFrame / typewriterDelay);
      visibleCode = code.slice(0, Math.min(charsToShow, code.length));
    }
  }

  // Entrance animation
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [15, 0]);

  const lines = visibleCode.split('\n');

  return (
    <div
      style={{
        backgroundColor: COLORS.code,
        borderRadius: 12,
        padding: '24px 32px',
        fontFamily: TYPOGRAPHY.code.fontFamily,
        fontSize,
        lineHeight: 1.6,
        opacity,
        transform: `translateY(${translateY}px)`,
        border: `1px solid rgba(255,255,255,0.1)`,
        ...style,
      }}
    >
      {lines.map((line, index) => {
        const isHighlighted = highlightLines.includes(index + 1);
        const highlighted = language === 'python' ? highlightPython(line) : line;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              marginLeft: -32,
              marginRight: -32,
              paddingLeft: showLineNumbers ? 16 : 32,
              paddingRight: 32,
              borderLeft: isHighlighted ? `3px solid ${COLORS.accent}` : '3px solid transparent',
            }}
          >
            {showLineNumbers && (
              <span
                style={{
                  width: 40,
                  color: SYNTAX.comment,
                  userSelect: 'none',
                  textAlign: 'right',
                  marginRight: 16,
                }}
              >
                {index + 1}
              </span>
            )}
            <span style={{ flex: 1, minHeight: '1em' }}>{highlighted || ' '}</span>
          </div>
        );
      })}

      {/* Blinking cursor for typewriter */}
      {typewriter && visibleCode.length < code.length && (
        <span
          style={{
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
            color: COLORS.text,
          }}
        >
          ▌
        </span>
      )}
    </div>
  );
};

export default CodeBlock;
