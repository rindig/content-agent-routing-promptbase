/**
 * Scene 4C: The Jonny Burger Insight
 * [5:05 - 5:40] — 1050 frames
 *
 * "A video is just a function of images over time." — Jonny Burger
 * Core conceptual scene explaining how Remotion works.
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = {
  SCENE_BUILDING: 0,
  RENDERING: 150,
  QUOTE: 300,
  TIME_AXIS: 510,
  REACT_CONNECTION: 690,
  FRAME_47: 840,
  VIDEO_REVEAL: 960,
};

export const Scene4C_JonnyBurger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase transitions
  const phaseFade = (start: number, next: number) => {
    const entrance = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return { opacity: (frame >= start ? interpolate(entrance, [0, 1], [0, 1]) : 0) * (frame < next + 15 ? exit : 0) };
  };

  // Scene building boxes
  const buildEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const buildFade = interpolate(frame, [PHASE.RENDERING - 30, PHASE.RENDERING], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Quote entrance
  const quoteEntrance = spring({ frame: frame - PHASE.QUOTE, fps, config: SPRING_CONFIGS.gentle });
  const quoteOpacity = frame >= PHASE.QUOTE ? interpolate(quoteEntrance, [0, 1], [0, 1]) : 0;
  const quoteFade = interpolate(frame, [PHASE.TIME_AXIS - 30, PHASE.TIME_AXIS], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Time axis
  const timeEntrance = spring({ frame: frame - PHASE.TIME_AXIS, fps, config: SPRING_CONFIGS.gentle });
  const timeOpacity = frame >= PHASE.TIME_AXIS ? interpolate(timeEntrance, [0, 1], [0, 1]) : 0;
  const timeFade = interpolate(frame, [PHASE.REACT_CONNECTION - 30, PHASE.REACT_CONNECTION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // React connection
  const reactEntrance = spring({ frame: frame - PHASE.REACT_CONNECTION, fps, config: SPRING_CONFIGS.gentle });
  const reactOpacity = frame >= PHASE.REACT_CONNECTION ? interpolate(reactEntrance, [0, 1], [0, 1]) : 0;
  const reactFade = interpolate(frame, [PHASE.FRAME_47 - 30, PHASE.FRAME_47], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Frame 47
  const frame47Entrance = spring({ frame: frame - PHASE.FRAME_47, fps, config: SPRING_CONFIGS.gentle });
  const frame47Opacity = frame >= PHASE.FRAME_47 ? interpolate(frame47Entrance, [0, 1], [0, 1]) : 0;
  const frame47Fade = interpolate(frame, [PHASE.VIDEO_REVEAL - 30, PHASE.VIDEO_REVEAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Video reveal
  const videoEntrance = spring({ frame: frame - PHASE.VIDEO_REVEAL, fps, config: SPRING_CONFIGS.gentle });
  const videoOpacity = frame >= PHASE.VIDEO_REVEAL ? interpolate(videoEntrance, [0, 1], [0, 1]) : 0;

  // Rapidly incrementing frame number for final reveal
  const rapidFrame = frame >= PHASE.VIDEO_REVEAL ? Math.floor((frame - PHASE.VIDEO_REVEAL) * 8) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Phase 1: Scene building */}
      {frame < PHASE.RENDERING + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: interpolate(buildEntrance, [0, 1], [0, 1]) * buildFade }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 32, textAlign: 'center' }}>
            Then it builds <span style={{ color: COLORS.build, fontWeight: 600 }}>scenes</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Scene 1', 'Scene 2', 'Scene 3', '...'].map((s, i) => {
              const boxEntrance = spring({ frame: frame - 20 - i * 15, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{ opacity: interpolate(boxEntrance, [0, 1], [0, 1]), transform: `scale(${interpolate(boxEntrance, [0, 1], [0.8, 1])})` }}>
                  <div style={{
                    width: 120, height: 80, backgroundColor: COLORS.surface, border: `2px solid ${COLORS.build}`, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4,
                  }}>
                    <span style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build }}>{`<${s} />`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 2: Rendering filmstrip */}
      {frame >= PHASE.RENDERING && frame < PHASE.QUOTE + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: (frame >= PHASE.RENDERING ? spring({ frame: frame - PHASE.RENDERING, fps, config: SPRING_CONFIGS.gentle }) : 0) * (interpolate(frame, [PHASE.QUOTE - 30, PHASE.QUOTE], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 24, textAlign: 'center' }}>
            Renders <span style={{ color: COLORS.build }}>frame by frame</span> into video
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const filmEntrance = spring({ frame: frame - PHASE.RENDERING - 20 - i * 5, fps, config: SPRING_CONFIGS.snappy });
              const brightness = 0.3 + (i / 12) * 0.5;
              return (
                <div key={i} style={{ opacity: interpolate(filmEntrance, [0, 1], [0, 1]) }}>
                  <div style={{ width: 50, height: 36, backgroundColor: `${COLORS.build}${Math.floor(brightness * 255).toString(16).padStart(2, '0')}`, borderRadius: 2, border: `1px solid ${COLORS.build}40` }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 3: Jonny Burger quote */}
      {frame >= PHASE.QUOTE && frame < PHASE.TIME_AXIS + 15 && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', opacity: quoteOpacity * quoteFade, textAlign: 'center' }}>
          <div style={{
            padding: '40px 60px', backgroundColor: `${COLORS.surface}E0`, border: `1px solid ${COLORS.build}30`,
            borderRadius: 16, maxWidth: 700,
          }}>
            <div style={{ fontSize: 44, fontFamily: TYPOGRAPHY.quote.fontFamily, color: '#FEF3C7', lineHeight: 1.4, fontStyle: 'italic' }}>
              "A video is just a function
              <br />of images over time."
            </div>
            <div style={{ fontSize: 24, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 24 }}>
              — Jonny Burger
            </div>
          </div>
          {/* Mathematical notation */}
          <div style={{ marginTop: 32, fontSize: 28, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build, opacity: 0.8 }}>
            video = f(time) → images
          </div>
        </div>
      )}

      {/* Phase 4: Time axis with frames */}
      {frame >= PHASE.TIME_AXIS && frame < PHASE.REACT_CONNECTION + 15 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: timeOpacity * timeFade }}>
          <svg width="700" height="200" viewBox="0 0 700 200">
            {/* Time axis */}
            <line x1="50" y1="150" x2="650" y2="150" stroke={COLORS.textDim} strokeWidth="2" />
            <polygon points="645,145 655,150 645,155" fill={COLORS.textDim} />
            <text x="660" y="155" fill={COLORS.textMuted} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>t</text>

            {/* Frame points with images */}
            {[0, 1, 2, 3, 4, 5].map((t, i) => {
              const px = 100 + i * 100;
              const dotEntrance = spring({ frame: frame - PHASE.TIME_AXIS - 20 - i * 12, fps, config: SPRING_CONFIGS.snappy });
              const dotOpacity = interpolate(dotEntrance, [0, 1], [0, 1]);
              const barHeight = 20 + i * 8 + Math.sin(i * 1.5) * 10;
              return (
                <g key={i} opacity={dotOpacity}>
                  <circle cx={px} cy={150} r={4} fill={COLORS.build} />
                  <text x={px} y={170} textAnchor="middle" fill={COLORS.textMuted} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>t={t}</text>
                  {/* Mini image frame */}
                  <rect x={px - 20} y={90 - barHeight / 2} width={40} height={barHeight} rx={3} fill={`${COLORS.build}${Math.floor((0.2 + i * 0.12) * 255).toString(16).padStart(2, '0')}`} stroke={COLORS.build} strokeWidth="1" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Phase 5: React connection */}
      {frame >= PHASE.REACT_CONNECTION && frame < PHASE.FRAME_47 + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: reactOpacity * reactFade, textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
            {/* Normal React */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textDim, marginBottom: 8 }}>Normal React</div>
              <div style={{ padding: '12px 20px', backgroundColor: COLORS.surface, border: `1px solid ${COLORS.textDim}40`, borderRadius: 8 }}>
                <span style={{ fontSize: 18, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted }}>state = <span style={{ color: COLORS.time, textDecoration: 'line-through', opacity: 0.5 }}>userInput</span></span>
              </div>
            </div>

            <div style={{ fontSize: 32, color: COLORS.textDim }}>→</div>

            {/* Remotion React */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build, marginBottom: 8 }}>Remotion</div>
              <div style={{ padding: '12px 20px', backgroundColor: COLORS.surface, border: `2px solid ${COLORS.build}`, borderRadius: 8 }}>
                <span style={{ fontSize: 18, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build }}>state = <span style={{ fontWeight: 700 }}>frameNumber</span></span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build, opacity: 0.7 }}>
            useCurrentFrame()
          </div>
        </div>
      )}

      {/* Phase 6: Frame 47 example */}
      {frame >= PHASE.FRAME_47 && frame < PHASE.VIDEO_REVEAL + 15 && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: frame47Opacity * frame47Fade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 24 }}>
            What does <span style={{ color: COLORS.build, fontWeight: 600 }}>frame 47</span> look like?
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            {[46, 47, 48, 49].map((f, i) => {
              const itemEntrance = spring({ frame: frame - PHASE.FRAME_47 - 20 - i * 15, fps, config: SPRING_CONFIGS.snappy });
              const isHighlight = f === 47;
              return (
                <div key={f} style={{ opacity: interpolate(itemEntrance, [0, 1], [0, 1]), textAlign: 'center' }}>
                  <div style={{
                    width: isHighlight ? 140 : 100, height: isHighlight ? 90 : 70,
                    backgroundColor: COLORS.surface, border: `2px solid ${isHighlight ? COLORS.build : COLORS.textDim}40`,
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: '60%', height: '40%', backgroundColor: `${COLORS.build}${Math.floor((0.2 + i * 0.15) * 255).toString(16).padStart(2, '0')}`, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 14, fontFamily: TYPOGRAPHY.code.fontFamily, color: isHighlight ? COLORS.build : COLORS.textDim, marginTop: 8, fontWeight: isHighlight ? 700 : 400 }}>
                    Frame {f}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Phase 7: Rapid frame count = video */}
      {frame >= PHASE.VIDEO_REVEAL && (
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', opacity: videoOpacity, textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build, fontWeight: 700, marginBottom: 16 }}>
            Frame {Math.min(rapidFrame, 9999)}
          </div>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginTop: 24 }}>
            Do that for every frame{' '}
            <span style={{ color: COLORS.build, fontWeight: 700 }}>=</span>{' '}
            <span style={{ color: COLORS.refine, fontWeight: 700 }}>video</span>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4C_JonnyBurger;
