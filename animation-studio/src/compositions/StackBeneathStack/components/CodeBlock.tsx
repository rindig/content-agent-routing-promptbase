import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

type Language = 'python' | 'c' | 'asm' | 'hex' | 'bytecode';

type CodeBlockProps = {
  code: string;
  language: Language;
  highlightLines?: number[];
  highlightColor?: string;
  typewriter?: boolean;
  typewriterDelay?: number;
  startFrame?: number;
  fontSize?: number;
  style?: React.CSSProperties;
};

// Simple syntax highlighting based on language
const highlightSyntax = (code: string, language: Language): React.ReactNode[] => {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    let highlighted: React.ReactNode;

    switch (language) {
      case 'python':
        highlighted = highlightPython(line);
        break;
      case 'c':
        highlighted = highlightC(line);
        break;
      case 'asm':
        highlighted = highlightAsm(line);
        break;
      case 'hex':
        highlighted = highlightHex(line);
        break;
      case 'bytecode':
        highlighted = highlightBytecode(line);
        break;
      default:
        highlighted = line;
    }

    return (
      <div key={lineIndex} style={{ minHeight: '1.4em' }}>
        {highlighted}
      </div>
    );
  });
};

const highlightPython = (line: string): React.ReactNode => {
  // Match print function and string
  const printMatch = line.match(/^(\s*)(print)(\()(".*?"|'.*?')(\))$/);
  if (printMatch) {
    const [, indent, func, paren1, str, paren2] = printMatch;
    return (
      <>
        {indent}
        <span style={{ color: COLORS.syntaxFunction }}>{func}</span>
        <span style={{ color: COLORS.text }}>{paren1}</span>
        <span style={{ color: COLORS.syntaxString }}>{str}</span>
        <span style={{ color: COLORS.text }}>{paren2}</span>
      </>
    );
  }

  // Highlight keywords
  const keywords = ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None'];
  let result = line;

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    if (regex.test(result)) {
      return <span dangerouslySetInnerHTML={{ __html: result.replace(regex, `<span style="color: ${COLORS.syntaxKeyword}">$1</span>`) }} />;
    }
  }

  return <span style={{ color: COLORS.text }}>{line}</span>;
};

const highlightC = (line: string): React.ReactNode => {
  // Comments
  if (line.trim().startsWith('//')) {
    return <span style={{ color: COLORS.syntaxComment }}>{line}</span>;
  }

  // Simple keyword highlighting
  const keywords = ['if', 'else', 'return', 'void', 'int', 'char', 'NULL', 'PyObject', 'PyErr_Format', 'Py_TYPE'];
  let highlighted = line;

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `__KW_START__${keyword}__KW_END__`);
  }

  // String literals
  highlighted = highlighted.replace(/"([^"]*)"/g, `__STR_START__"$1"__STR_END__`);

  // Convert markers to spans
  const parts = highlighted.split(/(__KW_START__|__KW_END__|__STR_START__|__STR_END__)/);
  let inKeyword = false;
  let inString = false;

  return (
    <>
      {parts.map((part, i) => {
        if (part === '__KW_START__') {
          inKeyword = true;
          return null;
        }
        if (part === '__KW_END__') {
          inKeyword = false;
          return null;
        }
        if (part === '__STR_START__') {
          inString = true;
          return null;
        }
        if (part === '__STR_END__') {
          inString = false;
          return null;
        }

        if (inKeyword) {
          return <span key={i} style={{ color: COLORS.syntaxKeyword }}>{part}</span>;
        }
        if (inString) {
          return <span key={i} style={{ color: COLORS.syntaxString }}>{part}</span>;
        }
        return <span key={i} style={{ color: COLORS.text }}>{part}</span>;
      })}
    </>
  );
};

const highlightAsm = (line: string): React.ReactNode => {
  // Instructions (push, mov, sub, etc.)
  const instructions = ['push', 'pop', 'mov', 'sub', 'add', 'call', 'ret', 'jmp', 'je', 'jne'];
  const registers = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'rbp', 'rsp', 'eax', 'ebx', 'ecx', 'edx'];

  let result = line;

  // Check for label (ends with :)
  if (line.trim().endsWith(':')) {
    return <span style={{ color: COLORS.syntaxFunction }}>{line}</span>;
  }

  // Highlight instructions
  for (const instr of instructions) {
    const regex = new RegExp(`\\b(${instr})\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, `<span style="color: ${COLORS.syntaxKeyword}">$1</span>`);
    }
  }

  // Highlight registers
  for (const reg of registers) {
    const regex = new RegExp(`\\b(${reg})\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, `<span style="color: ${COLORS.primary}">$1</span>`);
    }
  }

  // Highlight numbers
  result = result.replace(/\b(\d+)\b/g, `<span style="color: ${COLORS.syntaxNumber}">$1</span>`);

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
};

const highlightHex = (line: string): React.ReactNode => {
  // Split into hex values and comments
  const commentIndex = line.indexOf(';');

  if (commentIndex >= 0) {
    const hex = line.substring(0, commentIndex);
    const comment = line.substring(commentIndex);

    return (
      <>
        <span style={{ color: COLORS.accent }}>{hex}</span>
        <span style={{ color: COLORS.syntaxComment }}>{comment}</span>
      </>
    );
  }

  return <span style={{ color: COLORS.accent }}>{line}</span>;
};

const highlightBytecode = (line: string): React.ReactNode => {
  // Match INSTRUCTION  NUMBER (description)
  const match = line.match(/^(\s*)([A-Z_]+)(\s+)(\d+)(\s*\(.*\))?$/);

  if (match) {
    const [, indent, instruction, space1, num, desc] = match;
    return (
      <>
        {indent}
        <span style={{ color: COLORS.syntaxKeyword }}>{instruction}</span>
        {space1}
        <span style={{ color: COLORS.syntaxNumber }}>{num}</span>
        {desc && <span style={{ color: COLORS.textMuted }}>{desc}</span>}
      </>
    );
  }

  return <span style={{ color: COLORS.text }}>{line}</span>;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  highlightLines = [],
  highlightColor = COLORS.warning,
  typewriter = false,
  typewriterDelay = 2,
  startFrame = 0,
  fontSize = 18,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate visible code for typewriter effect
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

  // Spring entrance animation
  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const translateY = interpolate(entranceProgress, [0, 1], [10, 0]);

  const lines = visibleCode.split('\n');
  const highlightedLines = highlightSyntax(visibleCode, language);

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        padding: '16px 24px',
        fontFamily: TYPOGRAPHY.code.fontFamily,
        fontSize,
        lineHeight: 1.6,
        opacity,
        transform: `translateY(${translateY}px)`,
        border: `1px solid ${COLORS.surfaceAlt}`,
        ...style,
      }}
    >
      {highlightedLines.slice(0, lines.length).map((line, index) => {
        const isHighlighted = highlightLines.includes(index + 1);

        return (
          <div
            key={index}
            style={{
              backgroundColor: isHighlighted ? `${highlightColor}20` : 'transparent',
              marginLeft: -24,
              marginRight: -24,
              paddingLeft: 24,
              paddingRight: 24,
              borderLeft: isHighlighted ? `3px solid ${highlightColor}` : '3px solid transparent',
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
