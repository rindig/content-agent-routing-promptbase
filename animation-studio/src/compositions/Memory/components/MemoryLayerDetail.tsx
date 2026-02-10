import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type MemoryLayerDetailProps = {
  layer: 'registers' | 'cache' | 'ram' | 'disk';
  startFrame?: number;
  style?: React.CSSProperties;
};

// Actual data representations for each layer
const LAYER_DATA: Record<string, {
  color: string;
  title: string;
  subtitle: string;
  visual: 'registers' | 'cache' | 'ram' | 'disk';
  examples: Array<{ label: string; value: string; highlight?: boolean }>;
  code?: string[];
}> = {
  registers: {
    color: '#ef4444',
    title: 'Registers',
    subtitle: 'CPU\'s working memory - 64 bits each',
    visual: 'registers',
    examples: [
      { label: 'RAX', value: '0x00007FFD4A3B2C10', highlight: true },
      { label: 'RBX', value: '0x0000000000000042' },
      { label: 'RCX', value: '0x00000000000000FF' },
      { label: 'RDX', value: '0x0000000000000000' },
    ],
    code: [
      'mov rax, [rbp-8]   ; load variable',
      'add rax, 1         ; increment',
      'mov [rbp-8], rax   ; store back',
    ],
  },
  cache: {
    color: '#f97316',
    title: 'L1/L2 Cache',
    subtitle: 'Recently accessed data - spatial locality',
    visual: 'cache',
    examples: [
      { label: 'Line 0', value: 'arr[0] arr[1] arr[2] arr[3]', highlight: true },
      { label: 'Line 1', value: 'arr[4] arr[5] arr[6] arr[7]' },
      { label: 'Line 2', value: 'obj.x  obj.y  obj.z  ----' },
      { label: 'Line 3', value: 'str[0] str[1] str[2] str[3]' },
    ],
    code: [
      '// Cache hit: ~4 cycles',
      'for (int i = 0; i < 8; i++)',
      '    sum += arr[i];  // sequential',
    ],
  },
  ram: {
    color: '#eab308',
    title: 'RAM',
    subtitle: 'Working state of running programs',
    visual: 'ram',
    examples: [
      { label: '0x7FFD...100', value: 'Stack frame: main()', highlight: true },
      { label: '0x7FFD...0F0', value: 'local_var = 42' },
      { label: '0x5555...000', value: 'Heap: malloc(1024)' },
      { label: '0x4000...000', value: 'Code: .text section' },
    ],
    code: [
      'int* ptr = malloc(sizeof(int));',
      '*ptr = 42;  // Write to RAM',
      'printf("%d", *ptr);  // Read from RAM',
    ],
  },
  disk: {
    color: '#22c55e',
    title: 'Disk / SSD',
    subtitle: 'Persistent storage - survives reboot',
    visual: 'disk',
    examples: [
      { label: 'Sector 0', value: 'Boot loader (MBR)', highlight: true },
      { label: 'Inode 42', value: '/home/user/file.txt' },
      { label: 'Block 1024', value: 'File contents...' },
      { label: 'Journal', value: 'Transaction log' },
    ],
    code: [
      'fd = open("file.txt", O_RDWR);',
      'read(fd, buffer, 4096);  // ~0.1ms',
      'write(fd, data, 4096);   // persisted',
    ],
  },
};

export const MemoryLayerDetail: React.FC<MemoryLayerDetailProps> = ({
  layer,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = LAYER_DATA[layer];
  if (!data) return null;

  const containerProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(containerProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        gap: 50,
        alignItems: 'flex-start',
        opacity,
        ...style,
      }}
    >
      {/* Left: Data visualization */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 30,
          border: `2px solid ${data.color}40`,
          minWidth: 420,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: data.color,
            marginBottom: 8,
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            fontSize: 20,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textMuted,
            marginBottom: 24,
          }}
        >
          {data.subtitle}
        </div>

        {/* Data rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.examples.map((example, i) => {
            const rowDelay = startFrame + 20 + i * 8;
            const rowProgress = spring({
              frame: frame - rowDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: interpolate(rowProgress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(rowProgress, [0, 1], [-20, 0])}px)`,
                  padding: '10px 16px',
                  backgroundColor: example.highlight ? `${data.color}20` : 'transparent',
                  borderRadius: 8,
                  borderLeft: example.highlight ? `3px solid ${data.color}` : '3px solid transparent',
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    color: data.color,
                    minWidth: 100,
                  }}
                >
                  {example.label}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    color: COLORS.text,
                  }}
                >
                  {example.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Code example */}
      {data.code && (
        <div
          style={{
            backgroundColor: COLORS.code,
            borderRadius: 12,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 380,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Example Usage
          </div>
          {data.code.map((line, i) => {
            const lineDelay = startFrame + 40 + i * 6;
            const lineProgress = spring({
              frame: frame - lineDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const isComment = line.trim().startsWith('//');

            return (
              <div
                key={i}
                style={{
                  fontSize: 18,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: isComment ? COLORS.textMuted : COLORS.text,
                  lineHeight: 1.8,
                  opacity: interpolate(lineProgress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(lineProgress, [0, 1], [10, 0])}px)`,
                }}
              >
                {highlightCodeLine(line, data.color)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple syntax highlighting
const highlightCodeLine = (line: string, accentColor: string): React.ReactNode => {
  // Comments
  if (line.includes('//')) {
    const [code, comment] = line.split('//');
    return (
      <>
        {highlightCodePart(code, accentColor)}
        <span style={{ color: '#5c6370' }}>//{comment}</span>
      </>
    );
  }
  return highlightCodePart(line, accentColor);
};

const highlightCodePart = (code: string, accentColor: string): React.ReactNode => {
  const keywords = ['int', 'char', 'void', 'for', 'if', 'return', 'mov', 'add', 'sub'];
  const functions = ['malloc', 'printf', 'open', 'read', 'write', 'sizeof'];

  let result = code;

  // This is a simplified approach - just return colored code
  keywords.forEach(kw => {
    if (code.includes(kw)) {
      result = result.replace(new RegExp(`\\b${kw}\\b`, 'g'), `§kw§${kw}§/kw§`);
    }
  });

  functions.forEach(fn => {
    if (code.includes(fn)) {
      result = result.replace(new RegExp(`\\b${fn}\\b`, 'g'), `§fn§${fn}§/fn§`);
    }
  });

  // Parse and render
  const parts = result.split(/(§kw§.*?§\/kw§|§fn§.*?§\/fn§)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('§kw§')) {
          return <span key={i} style={{ color: '#c678dd' }}>{part.replace(/§\/?kw§/g, '')}</span>;
        }
        if (part.startsWith('§fn§')) {
          return <span key={i} style={{ color: '#61afef' }}>{part.replace(/§\/?fn§/g, '')}</span>;
        }
        // Highlight numbers
        return <span key={i} style={{ color: '#abb2bf' }}>{part}</span>;
      })}
    </>
  );
};

export default MemoryLayerDetail;
