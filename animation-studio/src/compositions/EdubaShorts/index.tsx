import React from 'react';
import { Composition, Folder } from 'remotion';
import { FPS, WIDTH, HEIGHT } from './constants';

// P1 — Layers Beneath
import { HelloWorldLayers } from './clips/P1-layers-beneath/HelloWorldLayers';
import { TOTAL_DURATION as HelloWorldLayers_DURATION } from './clips/P1-layers-beneath/HelloWorldLayers/timing';

// P3 — Methods, Not Tools
import { PromptArchitecture } from './clips/P3-methods-not-tools/PromptArchitecture';
import { TOTAL_DURATION as PromptArchitecture_DURATION } from './clips/P3-methods-not-tools/PromptArchitecture/timing';

// P4 — Builder's Architecture
import { APIsExplained } from './clips/P4-builders-architecture/APIsExplained';
import { TOTAL_DURATION as APIsExplained_DURATION } from './clips/P4-builders-architecture/APIsExplained/timing';

export const EdubaShorts: React.FC = () => {
  return (
    <Folder name="EdubaShorts">
      <Folder name="P1-layers-beneath">
        <Composition id="Eduba-HelloWorldLayers" component={HelloWorldLayers} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={HelloWorldLayers_DURATION} />
      </Folder>

      <Folder name="P3-methods-not-tools">
        <Composition id="Eduba-PromptArchitecture" component={PromptArchitecture} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={PromptArchitecture_DURATION} />
      </Folder>

      <Folder name="P4-builders-architecture">
        <Composition id="Eduba-APIsExplained" component={APIsExplained} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={APIsExplained_DURATION} />
      </Folder>
    </Folder>
  );
};
