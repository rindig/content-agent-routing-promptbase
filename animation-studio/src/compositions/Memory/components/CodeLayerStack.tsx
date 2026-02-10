import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type CodeLayer = {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  code: string[];
};

const LAYERS: CodeLayer[] = [
  {
    id: 'python',
    label: 'Python AST',
    color: '#3b82f6',
    bgColor: '#1e3a5f',
    code: [
      'Module(body=[',
      '  Expr(value=Call(',
      '    func=Name(id="print")',
      '    args=[Constant("hello")]',
      '  ))',
      '])',
    ],
  },
  {
    id: 'c',
    label: 'C Interpreter',
    color: '#8b5cf6',
    bgColor: '#3d2a5c',
    code: [
      'PyObject* builtin_print(',
      '    PyObject *args) {',
      '  PyObject *str = PyTuple',
      '    _GetItem(args, 0);',
      '  fputs(PyUnicode_AS',
      '    DATA(str), stdout);',
      '}',
    ],
  },
  {
    id: 'asm',
    label: 'Assembly',
    color: '#f59e0b',
    bgColor: '#4a3a1a',
    code: [
      'push   rbp',
      'mov    rbp, rsp',
      'lea    rdi, [rip+0x1234]',
      'call   puts@PLT',
      'mov    eax, 0',
      'pop    rbp',
      'ret',
    ],
  },
  {
    id: 'machine',
    label: 'Machine Code',
    color: '#10b981',
    bgColor: '#1a3a2a',
    code: [
      '55 48 89 e5',
      '48 8d 3d 34 12 00 00',
      'e8 00 00 00 00',
      'b8 00 00 00 00',
      '5d c3',
    ],
  },
];

type CodeLayerStackProps = {
  startFrame?: number;
  style?: React.CSSProperties;
};

export const CodeLayerStack: React.FC<CodeLayerStackProps> = ({
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        ...style,
      }}
    >
      {LAYERS.map((layer, i) => {
        const layerDelay = startFrame + i * 18;
        const progress = spring({
          frame: frame - layerDelay,
          fps,
          config: { damping: 18, stiffness: 160, mass: 0.7 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const x = interpolate(progress, [0, 1], [-60, 0]);
        const scale = interpolate(progress, [0, 0.5, 1], [0.9, 1.02, 1]);

        // Scrolling code effect
        const scrollOffset = ((frame - layerDelay) * 0.5) % 100;

        return (
          <div
            key={layer.id}
            style={{
              opacity,
              transform: `translateX(${x}px) scale(${scale})`,
              display: 'flex',
              borderRadius: 12,
              overflow: 'hidden',
              border: `2px solid ${layer.color}50`,
              boxShadow: `0 4px 20px ${layer.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* Label section */}
            <div
              style={{
                backgroundColor: layer.color,
                padding: '18px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 180,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {layer.label}
              </span>
            </div>

            {/* Code section */}
            <div
              style={{
                backgroundColor: layer.bgColor,
                padding: '12px 24px',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                minWidth: 380,
              }}
            >
              {/* Scrolling code background */}
              <div
                style={{
                  position: 'absolute',
                  top: -scrollOffset,
                  left: 24,
                  right: 24,
                  opacity: 0.4,
                }}
              >
                {[...layer.code, ...layer.code].map((line, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 14,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      color: layer.color,
                      whiteSpace: 'nowrap',
                      lineHeight: 1.8,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              {/* Main code display */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {layer.code.slice(0, 3).map((line, j) => {
                  const lineDelay = layerDelay + 20 + j * 4;
                  const lineProgress = spring({
                    frame: frame - lineDelay,
                    fps,
                    config: SPRING_CONFIGS.snappy,
                  });

                  return (
                    <div
                      key={j}
                      style={{
                        fontSize: 18,
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.7,
                        opacity: interpolate(lineProgress, [0, 1], [0, 1]),
                        transform: `translateX(${interpolate(lineProgress, [0, 1], [10, 0])}px)`,
                      }}
                    >
                      {highlightCode(line, layer.id)}
                    </div>
                  );
                })}
              </div>

              {/* Gradient fade at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 30,
                  background: `linear-gradient(transparent, ${layer.bgColor})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Simple syntax highlighting based on layer type
const highlightCode = (code: string, layerId: string): React.ReactNode => {
  switch (layerId) {
    case 'python':
      return highlightPythonAST(code);
    case 'c':
      return highlightC(code);
    case 'asm':
      return highlightAsm(code);
    case 'machine':
      return highlightHex(code);
    default:
      return code;
  }
};

const highlightPythonAST = (code: string): React.ReactNode => {
  // Highlight node types in blue, strings in green
  const parts = code.split(/(".*?")/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('"')) {
          return <span key={i} style={{ color: '#98c379' }}>{part}</span>;
        }
        // Highlight keywords
        const withKeywords = part.replace(
          /(Module|Expr|Call|Name|Constant|body|func|args|id|value)/g,
          '<kw>$1</kw>'
        );
        if (withKeywords.includes('<kw>')) {
          const kwParts = withKeywords.split(/(<kw>.*?<\/kw>)/g);
          return kwParts.map((p, j) => {
            if (p.startsWith('<kw>')) {
              return <span key={`${i}-${j}`} style={{ color: '#61afef' }}>{p.replace(/<\/?kw>/g, '')}</span>;
            }
            return <span key={`${i}-${j}`} style={{ color: '#abb2bf' }}>{p}</span>;
          });
        }
        return <span key={i} style={{ color: '#abb2bf' }}>{part}</span>;
      })}
    </>
  );
};

const highlightC = (code: string): React.ReactNode => {
  const keywords = ['PyObject', 'return', 'void', 'int', 'char'];
  let result = code;
  keywords.forEach(kw => {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), `<kw>${kw}</kw>`);
  });

  if (result.includes('<kw>')) {
    const parts = result.split(/(<kw>.*?<\/kw>)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('<kw>')) {
            return <span key={i} style={{ color: '#c678dd' }}>{part.replace(/<\/?kw>/g, '')}</span>;
          }
          return <span key={i} style={{ color: '#abb2bf' }}>{part}</span>;
        })}
      </>
    );
  }
  return <span style={{ color: '#abb2bf' }}>{code}</span>;
};

const highlightAsm = (code: string): React.ReactNode => {
  const instructions = ['push', 'pop', 'mov', 'lea', 'call', 'ret', 'add', 'sub'];
  const registers = ['rbp', 'rsp', 'rdi', 'rip', 'eax'];

  let parts: React.ReactNode[] = [];
  const words = code.split(/(\s+)/);

  words.forEach((word, i) => {
    const cleanWord = word.toLowerCase();
    if (instructions.includes(cleanWord)) {
      parts.push(<span key={i} style={{ color: '#c678dd' }}>{word}</span>);
    } else if (registers.includes(cleanWord)) {
      parts.push(<span key={i} style={{ color: '#e5c07b' }}>{word}</span>);
    } else if (/^0x[0-9a-f]+$/i.test(word) || /^\d+$/.test(word)) {
      parts.push(<span key={i} style={{ color: '#d19a66' }}>{word}</span>);
    } else {
      parts.push(<span key={i} style={{ color: '#abb2bf' }}>{word}</span>);
    }
  });

  return <>{parts}</>;
};

const highlightHex = (code: string): React.ReactNode => {
  const bytes = code.split(' ');
  return (
    <>
      {bytes.map((byte, i) => (
        <span key={i}>
          <span style={{ color: '#56b6c2' }}>{byte}</span>
          {i < bytes.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
};

export default CodeLayerStack;
