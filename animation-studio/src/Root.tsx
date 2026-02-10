import React from 'react';
import { Composition, Folder } from 'remotion';

// Compositions
import { AgentDeconstruction, AGENT_CONFIG } from './compositions/AgentDeconstruction';
import { Memory, MEMORY_CONFIG } from './compositions/Memory';
import { StackBeneathStack, STACK_CONFIG } from './compositions/StackBeneathStack';
import { HowIMakeTheseAnimations, HIMA_CONFIG } from './compositions/HowIMakeTheseAnimations';

// Eduba Shorts
import { EdubaShorts } from './compositions/EdubaShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Videos">
        <Composition
          id="HowIMakeTheseAnimations"
          component={HowIMakeTheseAnimations}
          {...HIMA_CONFIG}
        />
        <Composition
          id="AgentDeconstruction"
          component={AgentDeconstruction}
          {...AGENT_CONFIG}
        />
        <Composition
          id="StackBeneathStack"
          component={StackBeneathStack}
          {...STACK_CONFIG}
        />
        <Composition
          id="Memory"
          component={Memory}
          {...MEMORY_CONFIG}
        />
      </Folder>
      <EdubaShorts />
    </>
  );
};
