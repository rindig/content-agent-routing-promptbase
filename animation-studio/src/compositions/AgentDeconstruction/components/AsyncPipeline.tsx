import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * AsyncPipeline: Visualizes the orchestration layer
 *
 * Shows:
 * - Central orchestrator node with animated circuit pattern
 * - Multiple AI providers with custom icons
 * - Requests flowing as glowing dots with trails
 * - Queue visualization
 * - Retry animation
 */

type Provider = {
  id: string;
  name: string;
  concurrent: number;
  color: string;
  angle: number;
};

const PROVIDERS: Provider[] = [
  { id: 'openai', name: 'OpenAI', concurrent: 3, color: '#10B981', angle: -60 },
  { id: 'anthropic', name: 'Anthropic', concurrent: 5, color: '#F59E0B', angle: 60 },
  { id: 'llama', name: 'Llama', concurrent: 10, color: '#8B5CF6', angle: 180 },
];

// SVG Icons for providers
const OrchestratorIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const pulse = Math.sin(frame * 0.08) * 0.15 + 0.85;
  const rotation = frame * 0.3;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {/* Outer rotating ring */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="8,4"
        opacity={0.4}
        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
      />
      {/* Inner circle */}
      <circle cx="20" cy="20" r="12" fill={`${color}20`} stroke={color} strokeWidth="2" />
      {/* Center hub */}
      <circle cx="20" cy="20" r="5" fill={color} opacity={pulse} />
      {/* Connection points */}
      {[0, 120, 240].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 20 + Math.cos(rad) * 12;
        const y = 20 + Math.sin(rad) * 12;
        const dotPulse = Math.sin(frame * 0.1 + i) * 0.3 + 0.7;
        return (
          <circle
            key={angle}
            cx={x}
            cy={y}
            r="3"
            fill={color}
            opacity={dotPulse}
          />
        );
      })}
    </svg>
  );
};

const ProviderIcon: React.FC<{ frame: number; color: string; type: string }> = ({ frame, color, type }) => {
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;

  if (type === 'openai') {
    // Neural network icon
    return (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="8" r="4" fill={color} opacity={pulse} />
        <circle cx="8" cy="24" r="4" fill={color} opacity={Math.sin(frame * 0.1 + 1) * 0.2 + 0.8} />
        <circle cx="24" cy="24" r="4" fill={color} opacity={Math.sin(frame * 0.1 + 2) * 0.2 + 0.8} />
        <line x1="16" y1="12" x2="8" y2="20" stroke={color} strokeWidth="2" opacity={0.6} />
        <line x1="16" y1="12" x2="24" y2="20" stroke={color} strokeWidth="2" opacity={0.6} />
        <line x1="8" y1="24" x2="24" y2="24" stroke={color} strokeWidth="2" opacity={0.4} />
      </svg>
    );
  }

  if (type === 'anthropic') {
    // Abstract A shape
    const scanLine = (frame % 30) / 30;
    return (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path
          d="M16 4 L6 28 L12 28 L14 22 L18 22 L20 28 L26 28 L16 4"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <line x1="12" y1="18" x2="20" y2="18" stroke={color} strokeWidth="2" />
        {/* Scan line */}
        <line
          x1="6"
          y1={4 + scanLine * 24}
          x2="26"
          y2={4 + scanLine * 24}
          stroke={color}
          strokeWidth="1"
          opacity={0.5}
        />
      </svg>
    );
  }

  // Llama - abstract computing icon
  const rotation = frame * 0.5;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <rect x="8" y="8" width="16" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill={color} opacity={pulse} />
      {/* Spinning indicator */}
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="4,12"
        opacity={0.4}
        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
      />
    </svg>
  );
};

// Internal animation for nodes
const NodeInternalAnimation: React.FC<{ frame: number; color: string; isOrchestrator?: boolean }> = ({
  frame,
  color,
  isOrchestrator
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: isOrchestrator ? 16 : 12,
        pointerEvents: 'none',
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${((frame % 90) / 90) * 100}%`,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />
      {/* Floating binary/code text */}
      {[0, 1, 2].map((i) => {
        const yOffset = ((frame * 0.3 + i * 40) % 120) - 20;
        const xPos = 10 + i * 35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: xPos,
              top: yOffset,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 8,
              color: color,
              opacity: 0.2,
            }}
          >
            {isOrchestrator ? 'async' : '0x'}
          </div>
        );
      })}
    </div>
  );
};

// Corner brackets for boxes
const CornerBrackets: React.FC<{ color: string; size?: number }> = ({ color, size = 8 }) => (
  <>
    <div style={{ position: 'absolute', top: 4, left: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', top: 4, right: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, left: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, right: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
  </>
);

type RequestDot = {
  id: number;
  targetProvider: string;
  startFrame: number;
  isRetry?: boolean;
  queuePosition?: number;
};

type AsyncPipelineProps = {
  startFrame?: number;
  showLabels?: boolean;
  showQueue?: boolean;
  showRetry?: boolean;
  highlightProvider?: string | null;
  zoomedProvider?: string | null;
  scale?: number;
};

export const AsyncPipeline: React.FC<AsyncPipelineProps> = ({
  startFrame = 0,
  showLabels = false,
  showQueue = true,
  showRetry = true,
  highlightProvider = null,
  zoomedProvider = null,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;

  const baseProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Layout
  const centerX = 450;
  const centerY = 300;
  const providerRadius = 250;

  // Generate flowing requests
  const generateRequests = (): RequestDot[] => {
    const requests: RequestDot[] = [];
    const providers = ['openai', 'anthropic', 'llama'];

    for (let i = 0; i < 30; i++) {
      const provider = providers[i % 3];
      requests.push({
        id: i,
        targetProvider: provider,
        startFrame: i * 12 + 30,
        isRetry: i === 7 || i === 15 || i === 22,
        queuePosition: i % 5 === 0 ? Math.floor(i / 5) : undefined,
      });
    }

    return requests;
  };

  const requests = generateRequests();

  // Calculate dot position along path
  const getDotPosition = (request: RequestDot) => {
    const provider = PROVIDERS.find((p) => p.id === request.targetProvider);
    if (!provider) return null;

    const dotFrame = adjustedFrame - request.startFrame;
    if (dotFrame < 0) return null;

    const travelDuration = seconds(1.5);
    let progress = dotFrame / travelDuration;

    if (request.isRetry && progress > 1) {
      const returnProgress = (dotFrame - travelDuration) / travelDuration;
      if (returnProgress > 1) return null;
      progress = 1 - returnProgress;
    } else if (progress > 1) {
      return null;
    }

    const angleRad = (provider.angle * Math.PI) / 180;
    const targetX = centerX + Math.cos(angleRad) * providerRadius;
    const targetY = centerY + Math.sin(angleRad) * providerRadius;

    const x = interpolate(progress, [0, 1], [centerX, targetX]);
    const y = interpolate(progress, [0, 1], [centerY, targetY]);

    const queueOffset = request.queuePosition
      ? Math.sin(dotFrame * 0.1) * 5 + request.queuePosition * 15
      : 0;

    return {
      x,
      y: y + queueOffset,
      isRetry: request.isRetry && dotFrame > travelDuration,
      opacity: interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.8]),
    };
  };

  // Zoomed view into a single provider
  if (zoomedProvider) {
    const provider = PROVIDERS.find((p) => p.id === zoomedProvider);
    if (!provider) return null;

    return (
      <div
        style={{
          width: 900,
          height: 500,
          position: 'relative',
          transform: `scale(${scale})`,
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 40,
          }}
        >
          {/* Input box */}
          <div
            style={{
              position: 'relative',
              padding: '20px 32px',
              backgroundColor: `${COLORS.orchestration}15`,
              border: `2px solid ${COLORS.orchestration}`,
              borderRadius: 12,
            }}
          >
            <CornerBrackets color={COLORS.orchestration} />
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 20,
                color: COLORS.orchestration,
              }}
            >
              Prompt
            </div>
          </div>

          {/* Arrow with flowing dot */}
          <div style={{ position: 'relative', width: 60 }}>
            <svg width={60} height={40}>
              <defs>
                <marker id="zoom-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={provider.color} />
                </marker>
              </defs>
              <line x1={5} y1={20} x2={50} y2={20} stroke={provider.color} strokeWidth={2} markerEnd="url(#zoom-arrow)" />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: 5 + ((adjustedFrame % 30) / 30) * 40,
                top: 15,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: provider.color,
                boxShadow: `0 0 10px ${provider.color}`,
              }}
            />
          </div>

          {/* Provider box */}
          <div
            style={{
              position: 'relative',
              padding: '40px 60px',
              backgroundColor: `${provider.color}15`,
              border: `3px solid ${provider.color}`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: `0 0 40px ${provider.color}30`,
              overflow: 'hidden',
            }}
          >
            <NodeInternalAnimation frame={adjustedFrame} color={provider.color} />
            <CornerBrackets color={provider.color} size={10} />
            <ProviderIcon frame={adjustedFrame} color={provider.color} type={provider.id} />
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 28,
                fontWeight: 700,
                color: provider.color,
                marginTop: 12,
              }}
            >
              {provider.name}
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 14,
                color: COLORS.textMuted,
                marginTop: 4,
              }}
            >
              Model processes text
            </div>
            {/* Type badge */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '4px 10px',
                backgroundColor: COLORS.ai,
                borderRadius: 6,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.background,
                border: `1px solid ${COLORS.ai}`,
              }}
            >
              AI
            </div>
          </div>

          {/* Arrow */}
          <div style={{ position: 'relative', width: 60 }}>
            <svg width={60} height={40}>
              <defs>
                <marker id="zoom-arrow2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.ai} />
                </marker>
              </defs>
              <line x1={5} y1={20} x2={50} y2={20} stroke={COLORS.ai} strokeWidth={2} markerEnd="url(#zoom-arrow2)" />
            </svg>
          </div>

          {/* Output box */}
          <div
            style={{
              position: 'relative',
              padding: '20px 32px',
              backgroundColor: `${COLORS.ai}15`,
              border: `2px solid ${COLORS.ai}`,
              borderRadius: 12,
            }}
          >
            <CornerBrackets color={COLORS.ai} />
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 20,
                color: COLORS.ai,
              }}
            >
              Text
            </div>
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 22, color: COLORS.textMuted }}>
            The model has{' '}
          </span>
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 22, color: COLORS.ai, fontWeight: 600 }}>
            no awareness
          </span>
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 22, color: COLORS.textMuted }}>
            {' '}of queues, retries, or concurrency
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 900,
        height: 600,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* Central Orchestrator */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 90,
          top: centerY - 60,
          width: 180,
          height: 120,
          backgroundColor: `${COLORS.orchestration}15`,
          border: `3px solid ${COLORS.orchestration}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${COLORS.orchestration}30`,
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
          transform: `scale(${interpolate(baseProgress, [0, 1], [0.8, 1])})`,
          overflow: 'hidden',
        }}
      >
        <NodeInternalAnimation frame={adjustedFrame} color={COLORS.orchestration} isOrchestrator />
        <CornerBrackets color={COLORS.orchestration} size={10} />
        <OrchestratorIcon frame={adjustedFrame} color={COLORS.orchestration} />
        <div
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.orchestration,
            marginTop: 8,
          }}
        >
          Orchestrator
        </div>
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 11,
            color: COLORS.textMuted,
            marginTop: 2,
          }}
        >
          async/await
        </div>
        {/* Type badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '4px 10px',
            backgroundColor: COLORS.orchestration,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.background,
            border: `1px solid ${COLORS.orchestration}`,
            boxShadow: `0 0 8px ${COLORS.orchestration}80`,
          }}
        >
          CODE
        </div>
      </div>

      {/* Provider nodes */}
      {PROVIDERS.map((provider, i) => {
        const providerProgress = spring({
          frame: adjustedFrame - 15 - i * 10,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const angleRad = (provider.angle * Math.PI) / 180;
        const x = centerX + Math.cos(angleRad) * providerRadius;
        const y = centerY + Math.sin(angleRad) * providerRadius;

        const isHighlighted = highlightProvider === provider.id || highlightProvider === null;
        const dimmed = highlightProvider !== null && !isHighlighted;

        return (
          <div
            key={provider.id}
            style={{
              position: 'absolute',
              left: x - 80,
              top: y - 55,
              width: 160,
              height: 110,
              backgroundColor: `${provider.color}15`,
              border: `2px solid ${provider.color}`,
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: dimmed ? 0.3 : interpolate(providerProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(providerProgress, [0, 1], [0.8, 1])})`,
              boxShadow: isHighlighted && highlightProvider
                ? `0 0 30px ${provider.color}50`
                : 'none',
              overflow: 'hidden',
            }}
          >
            <NodeInternalAnimation frame={adjustedFrame} color={provider.color} />
            <CornerBrackets color={provider.color} />
            <ProviderIcon frame={adjustedFrame} color={provider.color} type={provider.id} />
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 16,
                fontWeight: 600,
                color: provider.color,
                marginTop: 6,
              }}
            >
              {provider.name}
            </div>
            {/* Concurrency badge */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                padding: '3px 8px',
                backgroundColor: `${provider.color}30`,
                borderRadius: 4,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 9,
                fontWeight: 600,
                color: provider.color,
              }}
            >
              {provider.concurrent}x
            </div>
            {/* Type badge */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                padding: '4px 10px',
                backgroundColor: COLORS.ai,
                borderRadius: 6,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.background,
                border: `1px solid ${COLORS.ai}`,
                boxShadow: `0 0 8px ${COLORS.ai}80`,
              }}
            >
              AI
            </div>
          </div>
        );
      })}

      {/* Connection lines with animated dashes */}
      <svg
        width={900}
        height={600}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          {PROVIDERS.map((provider) => (
            <linearGradient
              key={`grad-${provider.id}`}
              id={`line-grad-${provider.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={COLORS.orchestration} stopOpacity={0.8} />
              <stop offset="100%" stopColor={provider.color} stopOpacity={0.8} />
            </linearGradient>
          ))}
        </defs>
        {PROVIDERS.map((provider, i) => {
          const lineProgress = spring({
            frame: adjustedFrame - 25 - i * 8,
            fps,
            config: SPRING_CONFIGS.gentle,
          });

          const angleRad = (provider.angle * Math.PI) / 180;
          const x = centerX + Math.cos(angleRad) * providerRadius;
          const y = centerY + Math.sin(angleRad) * providerRadius;

          const isHighlighted = highlightProvider === provider.id || highlightProvider === null;
          const dashOffset = -adjustedFrame * 0.5;

          return (
            <line
              key={provider.id}
              x1={centerX}
              y1={centerY}
              x2={centerX + (x - centerX) * lineProgress}
              y2={centerY + (y - centerY) * lineProgress}
              stroke={`url(#line-grad-${provider.id})`}
              strokeWidth={2}
              strokeDasharray="8,4"
              strokeDashoffset={dashOffset}
              opacity={isHighlighted ? 0.6 : 0.15}
            />
          );
        })}
      </svg>

      {/* Flowing request dots with glow */}
      {requests.map((request) => {
        const pos = getDotPosition(request);
        if (!pos) return null;

        const provider = PROVIDERS.find((p) => p.id === request.targetProvider);
        const color = pos.isRetry ? COLORS.error : (provider?.color || COLORS.orchestration);

        return (
          <React.Fragment key={request.id}>
            {/* Glow trail */}
            <div
              style={{
                position: 'absolute',
                left: pos.x - 12,
                top: pos.y - 12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: color,
                filter: 'blur(8px)',
                opacity: pos.opacity * 0.4,
              }}
            />
            {/* Main dot */}
            <div
              style={{
                position: 'absolute',
                left: pos.x - 6,
                top: pos.y - 6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}80, 0 0 20px ${color}40`,
                opacity: pos.opacity,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* Labels */}
      {showLabels && (
        <>
          {/* Rate Limiting label */}
          <div
            style={{
              position: 'absolute',
              top: 50,
              right: 100,
              padding: '10px 18px',
              backgroundColor: `${COLORS.dataProcessing}15`,
              border: `2px solid ${COLORS.dataProcessing}60`,
              borderRadius: 8,
              opacity: interpolate(
                spring({ frame: adjustedFrame - seconds(2), fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <CornerBrackets color={COLORS.dataProcessing} size={6} />
            <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, color: COLORS.dataProcessing }}>
              Rate Limiting
            </span>
          </div>

          {/* Retry Logic label */}
          {showRetry && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: 100,
                padding: '10px 18px',
                backgroundColor: `${COLORS.error}15`,
                border: `2px solid ${COLORS.error}60`,
                borderRadius: 8,
                opacity: interpolate(
                  spring({ frame: adjustedFrame - seconds(3), fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <CornerBrackets color={COLORS.error} size={6} />
              <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, color: COLORS.error }}>
                Retry Logic
              </span>
            </div>
          )}

          {/* Queue Management label */}
          {showQueue && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                right: 100,
                padding: '10px 18px',
                backgroundColor: `${COLORS.orchestration}15`,
                border: `2px solid ${COLORS.orchestration}60`,
                borderRadius: 8,
                opacity: interpolate(
                  spring({ frame: adjustedFrame - seconds(2.5), fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <CornerBrackets color={COLORS.orchestration} size={6} />
              <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, color: COLORS.orchestration }}>
                Queue Management
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AsyncPipeline;
