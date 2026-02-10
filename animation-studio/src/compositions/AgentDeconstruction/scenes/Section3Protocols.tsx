import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { JSONFlow } from '../components/JSONFlow';
import { ProtocolTimeline } from '../components/ProtocolTimeline';
import { MCPArchitecture } from '../components/MCPArchitecture';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * SECTION 3: How Systems Talk [6:30 - 9:30]
 * Duration: 5400 frames (180 seconds)
 *
 * Visual journey:
 * 1. [0-450] Two Boxes - Simple "Your Code" ↔ "AI Provider" with "?"
 * 2. [450-900] API Definition - What is an API? A contract.
 * 3. [900-1500] JSON Flow - Animated JSON request/response
 * 4. [1500-2400] Many Connections = Mess - N×M problem visualization
 * 5. [2400-3900] Historical Timeline - USB→HTTP→LSP→MCP pattern
 * 6. [3900-5100] MCP Architecture - Host/Client/Server diagram
 * 7. [5100-5400] Hold
 *
 * Key message: "An API is a contract... This is what MCP is."
 */
export const Section3Protocols: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const TWO_BOXES = 0;
  const API_DEFINITION = seconds(15);
  const JSON_FLOW = seconds(30);
  const MESS_IN = seconds(50);
  const MESS_OUT = seconds(80);
  const TIMELINE_IN = seconds(80);
  const TIMELINE_CYCLE = seconds(90); // Start cycling through eras
  const MCP_IN = seconds(130);

  // Phase calculations
  const isTwoBoxesPhase = frame < API_DEFINITION;
  const isAPIPhase = frame >= API_DEFINITION && frame < JSON_FLOW;
  const isJSONPhase = frame >= JSON_FLOW && frame < MESS_IN;
  const isMessPhase = frame >= MESS_IN && frame < MESS_OUT;
  const isTimelinePhase = frame >= TIMELINE_IN && frame < MCP_IN;
  const isMCPPhase = frame >= MCP_IN;

  // Calculate active era for timeline
  const getActiveEra = () => {
    if (frame < TIMELINE_CYCLE) return -1;
    const eraFrame = frame - TIMELINE_CYCLE;
    const framesPerEra = seconds(10);
    const era = Math.floor(eraFrame / framesPerEra);
    if (era > 3) return -1; // Show all after cycling
    return era;
  };

  // Opacity calculations
  const twoBoxesOpacity = interpolate(
    frame,
    [TWO_BOXES, TWO_BOXES + 30, API_DEFINITION - 30, API_DEFINITION],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const apiOpacity = interpolate(
    frame,
    [API_DEFINITION, API_DEFINITION + 30, JSON_FLOW - 30, JSON_FLOW],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const jsonOpacity = interpolate(
    frame,
    [JSON_FLOW, JSON_FLOW + 30, MESS_IN - 30, MESS_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const messOpacity = interpolate(
    frame,
    [MESS_IN, MESS_IN + 30, MESS_OUT - 30, MESS_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const timelineOpacity = interpolate(
    frame,
    [TIMELINE_IN, TIMELINE_IN + 30, MCP_IN - 30, MCP_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const mcpOpacity = interpolate(
    frame,
    [MCP_IN, MCP_IN + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Section title visibility - hide during timeline and MCP phases to prevent overlap
  const sectionTitleOpacity = interpolate(
    frame,
    [0, 30, TIMELINE_IN - 60, TIMELINE_IN - 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // API Definition Icon Component
  const APIIcon: React.FC = () => {
    const dataFlow = (frame % 60) / 60;
    const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;
    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Left box (Code) */}
        <rect x="5" y="35" width="35" height="50" rx="6" fill={`${COLORS.orchestration}30`} stroke={COLORS.orchestration} strokeWidth="2" />
        <text x="22" y="65" fontSize="14" fill={COLORS.orchestration} textAnchor="middle" fontFamily={TYPOGRAPHY.code.fontFamily}>{`{ }`}</text>

        {/* Right box (AI) */}
        <rect x="80" y="35" width="35" height="50" rx="6" fill={`${COLORS.ai}30`} stroke={COLORS.ai} strokeWidth="2" />
        <circle cx="97" cy="60" r="10" fill={COLORS.ai} opacity={pulse} />

        {/* Connection arrows */}
        <path d="M45 52 L70 52" stroke={COLORS.dataProcessing} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
        <path d="M70 68 L45 68" stroke={COLORS.dataProcessing} strokeWidth="3" strokeLinecap="round" opacity={0.8} />
        {/* Arrow heads */}
        <path d="M65 47 L72 52 L65 57" fill="none" stroke={COLORS.dataProcessing} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 63 L43 68 L50 73" fill="none" stroke={COLORS.dataProcessing} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data packets */}
        <circle cx={45 + dataFlow * 25} cy="52" r="4" fill={COLORS.dataProcessing} opacity={0.9} />
        <circle cx={70 - dataFlow * 25} cy="68" r="4" fill={COLORS.dataProcessing} opacity={0.9} />

        {/* API label */}
        <rect x="42" y="85" width="36" height="20" rx="6" fill={COLORS.dataProcessing} />
        <text x="60" y="99" fontSize="12" fill={COLORS.background} textAnchor="middle" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="700">API</text>
      </svg>
    );
  };

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={isMCPPhase ? COLORS.mcp : COLORS.dataProcessing}
        particleCount={25}
        gradientDirection="radial"
        gradientColor="#0A0A12"
      />

      {/* Section title - hidden during timeline/MCP phases */}
      {sectionTitleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: sectionTitleOpacity,
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 24,
              fontWeight: 500,
              color: COLORS.dataProcessing,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            How Systems Talk
          </span>
        </div>
      )}

      {/* Two Boxes Phase - Simple diagram */}
      {isTwoBoxesPhase && twoBoxesOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: twoBoxesOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 80,
            }}
          >
            {/* Your Code */}
            <div
              style={{
                position: 'relative',
                width: 200,
                height: 130,
                backgroundColor: `${COLORS.orchestration}15`,
                border: `3px solid ${COLORS.orchestration}`,
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(
                  spring({ frame, fps, config: SPRING_CONFIGS.snappy }),
                  [0, 1],
                  [0, 1]
                ),
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.6 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 50) / 50) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.orchestration}40, transparent)`, pointerEvents: 'none' }} />
              {/* Icon */}
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: 8 }}>
                <rect x="6" y="6" width="28" height="28" rx="4" fill="none" stroke={COLORS.orchestration} strokeWidth="2" />
                <line x1="6" y1="14" x2="34" y2="14" stroke={COLORS.orchestration} strokeWidth="1" opacity={0.4} />
                <rect x="10" y="18" width={12 + ((frame % 30) / 30) * 8} height="3" rx="1" fill={COLORS.orchestration} opacity={0.7} />
                <rect x="10" y="24" width="16" height="3" rx="1" fill={COLORS.orchestration} opacity={0.5} />
              </svg>
              <span style={{ fontFamily: TYPOGRAPHY.display.fontFamily, fontSize: 20, fontWeight: 600, color: COLORS.orchestration }}>
                Your Code
              </span>
              {/* Type badge */}
              <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', backgroundColor: COLORS.orchestration, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 9, fontWeight: 700, color: COLORS.background }}>
                CODE
              </div>
            </div>

            {/* Animated question marks */}
            <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                {[0, 1, 2].map((i) => {
                  const offset = Math.sin(frame * 0.05 + i * 2) * 5;
                  const opacity = interpolate(spring({ frame: frame - 30 - i * 10, fps, config: SPRING_CONFIGS.gentle }), [0, 1], [0, 0.4 + i * 0.2]);
                  return (
                    <text key={i} x={30 + i * 10} y={35 + offset} fontSize="32" fontFamily={TYPOGRAPHY.display.fontFamily} fill={COLORS.textMuted} opacity={opacity}>?</text>
                  );
                })}
              </svg>
            </div>

            {/* AI Provider */}
            <div
              style={{
                position: 'relative',
                width: 200,
                height: 130,
                backgroundColor: `${COLORS.ai}15`,
                border: `3px solid ${COLORS.ai}`,
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(
                  spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy }),
                  [0, 1],
                  [0, 1]
                ),
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 50) / 50) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.ai}40, transparent)`, pointerEvents: 'none' }} />
              {/* Neural network icon */}
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: 8 }}>
                <circle cx="12" cy="12" r="5" fill={COLORS.ai} opacity={Math.sin(frame * 0.1) * 0.3 + 0.7} />
                <circle cx="28" cy="12" r="5" fill={COLORS.ai} opacity={Math.sin(frame * 0.1 + 1) * 0.3 + 0.7} />
                <circle cx="20" cy="28" r="5" fill={COLORS.ai} opacity={Math.sin(frame * 0.1 + 2) * 0.3 + 0.7} />
                <line x1="12" y1="12" x2="28" y2="12" stroke={COLORS.ai} strokeWidth="1.5" opacity={0.4} />
                <line x1="12" y1="12" x2="20" y2="28" stroke={COLORS.ai} strokeWidth="1.5" opacity={0.4} />
                <line x1="28" y1="12" x2="20" y2="28" stroke={COLORS.ai} strokeWidth="1.5" opacity={0.4} />
              </svg>
              <span style={{ fontFamily: TYPOGRAPHY.display.fontFamily, fontSize: 20, fontWeight: 600, color: COLORS.ai }}>
                AI Provider
              </span>
              {/* Type badge */}
              <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', backgroundColor: COLORS.ai, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 9, fontWeight: 700, color: COLORS.background }}>
                AI
              </div>
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({ frame: frame - 45, fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 28, color: COLORS.textMuted }}>
              How do they communicate?
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* API Definition Phase - NEW */}
      {isAPIPhase && apiOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: apiOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
            }}
          >
            {/* API Icon */}
            <div
              style={{
                opacity: interpolate(
                  spring({ frame: frame - API_DEFINITION, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
                transform: `scale(${interpolate(
                  spring({ frame: frame - API_DEFINITION, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0.8, 1]
                )})`,
              }}
            >
              <APIIcon />
            </div>

            {/* API Title */}
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 64,
                fontWeight: 700,
                color: COLORS.dataProcessing,
                letterSpacing: 6,
                textShadow: `0 0 40px ${COLORS.dataProcessing}40`,
                opacity: interpolate(
                  spring({ frame: frame - API_DEFINITION - 10, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              API
            </div>

            {/* Full Name */}
            <div
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 22,
                color: COLORS.textMuted,
                letterSpacing: 2,
                opacity: interpolate(
                  spring({ frame: frame - API_DEFINITION - 20, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              Application Programming Interface
            </div>

            {/* Definition Box */}
            <div
              style={{
                position: 'relative',
                maxWidth: 650,
                padding: '28px 40px',
                backgroundColor: `${COLORS.dataProcessing}10`,
                border: `2px solid ${COLORS.dataProcessing}60`,
                borderRadius: 16,
                marginTop: 20,
                opacity: interpolate(
                  spring({ frame: frame - API_DEFINITION - 35, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
                transform: `translateY(${interpolate(
                  spring({ frame: frame - API_DEFINITION - 35, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [20, 0]
                )}px)`,
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.dataProcessing}`, borderLeft: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
              <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: `2px solid ${COLORS.dataProcessing}`, borderRight: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.dataProcessing}`, borderLeft: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
              <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: `2px solid ${COLORS.dataProcessing}`, borderRight: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 60) / 60) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.dataProcessing}30, transparent)`, pointerEvents: 'none' }} />

              <div
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 28,
                  color: COLORS.textPrimary,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                A{' '}
                <span style={{ color: COLORS.dataProcessing, fontWeight: 600 }}>contract</span>{' '}
                that defines how two systems communicate
              </div>
            </div>

            {/* Request/Response explanation */}
            <div
              style={{
                display: 'flex',
                gap: 50,
                marginTop: 30,
                opacity: interpolate(
                  spring({ frame: frame - API_DEFINITION - 55, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              {[
                { label: 'Request', desc: 'What you send', color: COLORS.orchestration },
                { label: 'Response', desc: 'What you get back', color: COLORS.ai },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    position: 'relative',
                    padding: '18px 32px',
                    backgroundColor: `${item.color}15`,
                    border: `2px solid ${item.color}60`,
                    borderRadius: 12,
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner brackets */}
                  <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `2px solid ${item.color}`, borderLeft: `2px solid ${item.color}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}`, opacity: 0.5 }} />
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.display.fontFamily,
                      fontSize: 22,
                      fontWeight: 600,
                      color: item.color,
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontSize: 16,
                      color: COLORS.textMuted,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* JSON Flow Phase */}
      {isJSONPhase && jsonOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: jsonOpacity,
          }}
        >
          <JSONFlow startFrame={JSON_FLOW} showRequest={true} showResponse={true} />
        </AbsoluteFill>
      )}

      {/* Messy Connections Phase */}
      {isMessPhase && messOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: messOpacity,
          }}
        >
          <JSONFlow startFrame={MESS_IN} showMess={true} scale={0.95} />
        </AbsoluteFill>
      )}

      {/* Timeline Phase - scaled down and pushed down to prevent overlap */}
      {isTimelinePhase && timelineOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: timelineOpacity,
            paddingTop: 20,
          }}
        >
          <ProtocolTimeline
            startFrame={TIMELINE_IN}
            activeEra={getActiveEra()}
            showSolution={true}
            scale={0.82}
          />
        </AbsoluteFill>
      )}

      {/* MCP Architecture Phase */}
      {isMCPPhase && mcpOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: mcpOpacity,
          }}
        >
          <MCPArchitecture
            startFrame={MCP_IN}
            showFlow={true}
            scale={0.9}
          />
        </AbsoluteFill>
      )}

      {/* Bottom insight during JSON phase */}
      {isJSONPhase && (
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({
                frame: frame - JSON_FLOW - seconds(4),
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 22,
              color: COLORS.textPrimary,
            }}
          >
            Structured data in, structured data out
          </span>
        </div>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default Section3Protocols;
