import React from 'react';
import { Composition, Folder } from 'remotion';
import { FPS, WIDTH, HEIGHT } from './constants';

// Theme A — AI Failures
import { S01_LibraryNotFound } from './clips/S01_LibraryNotFound';
import { TOTAL_DURATION as S01_DURATION } from './clips/S01_LibraryNotFound/timing';
import { S06_FixOneBreakThree } from './clips/S06_FixOneBreakThree';
import { TOTAL_DURATION as S06_DURATION } from './clips/S06_FixOneBreakThree/timing';
import { S17_CompanyStoppedAI } from './clips/S17_CompanyStoppedAI';
import { TOTAL_DURATION as S17_DURATION } from './clips/S17_CompanyStoppedAI/timing';

// Theme B — Physics/Uncertainty
import { S02_CosmicRay } from './clips/S02_CosmicRay';
import { TOTAL_DURATION as S02_DURATION } from './clips/S02_CosmicRay/timing';
import { S03_MarioTeleported } from './clips/S03_MarioTeleported';
import { TOTAL_DURATION as S03_DURATION } from './clips/S03_MarioTeleported/timing';
import { S09_QuantumPhysics } from './clips/S09_QuantumPhysics';
import { TOTAL_DURATION as S09_DURATION } from './clips/S09_QuantumPhysics/timing';
import { S14_NeverDeterministic } from './clips/S14_NeverDeterministic';
import { TOTAL_DURATION as S14_DURATION } from './clips/S14_NeverDeterministic/timing';

// Theme C — Code Reality
import { S04_SpreadsheetAI } from './clips/S04_SpreadsheetAI';
import { TOTAL_DURATION as S04_DURATION } from './clips/S04_SpreadsheetAI/timing';
import { S07_CodeNeverRead } from './clips/S07_CodeNeverRead';
import { TOTAL_DURATION as S07_DURATION } from './clips/S07_CodeNeverRead/timing';
import { S08_OneLineTwelveThousand } from './clips/S08_OneLineTwelveThousand';
import { TOTAL_DURATION as S08_DURATION } from './clips/S08_OneLineTwelveThousand/timing';
import { S13_RealReasonAIWrong } from './clips/S13_RealReasonAIWrong';
import { TOTAL_DURATION as S13_DURATION } from './clips/S13_RealReasonAIWrong/timing';
import { S19_PoetryNotMath } from './clips/S19_PoetryNotMath';
import { TOTAL_DURATION as S19_DURATION } from './clips/S19_PoetryNotMath/timing';
import { S22_SmarterModel } from './clips/S22_SmarterModel';
import { TOTAL_DURATION as S22_DURATION } from './clips/S22_SmarterModel/timing';
import { S23_EatingFoodSupply } from './clips/S23_EatingFoodSupply';
import { TOTAL_DURATION as S23_DURATION } from './clips/S23_EatingFoodSupply/timing';

// Theme D — History/Abstraction
import { S05_475MillionTypo } from './clips/S05_475MillionTypo';
import { TOTAL_DURATION as S05_DURATION } from './clips/S05_475MillionTypo/timing';
import { S10_ErrorMessageLying } from './clips/S10_ErrorMessageLying';
import { TOTAL_DURATION as S10_DURATION } from './clips/S10_ErrorMessageLying/timing';
import { S11_NobodyBelievedHer } from './clips/S11_NobodyBelievedHer';
import { TOTAL_DURATION as S11_DURATION } from './clips/S11_NobodyBelievedHer/timing';
import { S12_LoomStartedEverything } from './clips/S12_LoomStartedEverything';
import { TOTAL_DURATION as S12_DURATION } from './clips/S12_LoomStartedEverything/timing';
import { S16_EverythingOldNewAgain } from './clips/S16_EverythingOldNewAgain';
import { TOTAL_DURATION as S16_DURATION } from './clips/S16_EverythingOldNewAgain/timing';
import { S18_OldestComputerWater } from './clips/S18_OldestComputerWater';
import { TOTAL_DURATION as S18_DURATION } from './clips/S18_OldestComputerWater/timing';
import { S20_SolvedThisOnce } from './clips/S20_SolvedThisOnce';
import { TOTAL_DURATION as S20_DURATION } from './clips/S20_SolvedThisOnce/timing';

// Theme E — Buzzwords
import { S15_ModelDoesntMatter } from './clips/S15_ModelDoesntMatter';
import { TOTAL_DURATION as S15_DURATION } from './clips/S15_ModelDoesntMatter/timing';
import { S24_AgentsArentWhat } from './clips/S24_AgentsArentWhat';
import { TOTAL_DURATION as S24_DURATION } from './clips/S24_AgentsArentWhat/timing';
import { S21_VoiceProblem } from './clips/S21_VoiceProblem';
import { TOTAL_DURATION as S21_DURATION } from './clips/S21_VoiceProblem/timing';

// Theme F — Industry
import { F1_NewModelChanges } from './clips/F1_NewModelChanges';
import { TOTAL_DURATION as F1_DURATION } from './clips/F1_NewModelChanges/timing';
import { F2_VoiceCloning30s } from './clips/F2_VoiceCloning30s';
import { TOTAL_DURATION as F2_DURATION } from './clips/F2_VoiceCloning30s/timing';
import { F3_AICodingActually } from './clips/F3_AICodingActually';
import { TOTAL_DURATION as F3_DURATION } from './clips/F3_AICodingActually/timing';

export const EdubaShorts: React.FC = () => {
  return (
    <Folder name="EdubaShorts">
      <Folder name="A-AIFailures">
        <Composition id="EdubaS01-LibraryNotFound" component={S01_LibraryNotFound} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S01_DURATION} />
        <Composition id="EdubaS06-FixOneBreakThree" component={S06_FixOneBreakThree} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S06_DURATION} />
        <Composition id="EdubaS17-CompanyStoppedAI" component={S17_CompanyStoppedAI} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S17_DURATION} />
      </Folder>

      <Folder name="B-Physics">
        <Composition id="EdubaS02-CosmicRay" component={S02_CosmicRay} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S02_DURATION} />
        <Composition id="EdubaS03-MarioTeleported" component={S03_MarioTeleported} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S03_DURATION} />
        <Composition id="EdubaS09-QuantumPhysics" component={S09_QuantumPhysics} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S09_DURATION} />
        <Composition id="EdubaS14-NeverDeterministic" component={S14_NeverDeterministic} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S14_DURATION} />
      </Folder>

      <Folder name="C-CodeReality">
        <Composition id="EdubaS04-SpreadsheetAI" component={S04_SpreadsheetAI} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S04_DURATION} />
        <Composition id="EdubaS07-CodeNeverRead" component={S07_CodeNeverRead} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S07_DURATION} />
        <Composition id="EdubaS08-OneLineTwelveThousand" component={S08_OneLineTwelveThousand} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S08_DURATION} />
        <Composition id="EdubaS13-RealReasonAIWrong" component={S13_RealReasonAIWrong} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S13_DURATION} />
        <Composition id="EdubaS19-PoetryNotMath" component={S19_PoetryNotMath} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S19_DURATION} />
        <Composition id="EdubaS22-SmarterModel" component={S22_SmarterModel} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S22_DURATION} />
        <Composition id="EdubaS23-EatingFoodSupply" component={S23_EatingFoodSupply} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S23_DURATION} />
      </Folder>

      <Folder name="D-History">
        <Composition id="EdubaS05-475MillionTypo" component={S05_475MillionTypo} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S05_DURATION} />
        <Composition id="EdubaS10-ErrorMessageLying" component={S10_ErrorMessageLying} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S10_DURATION} />
        <Composition id="EdubaS11-NobodyBelievedHer" component={S11_NobodyBelievedHer} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S11_DURATION} />
        <Composition id="EdubaS12-LoomStartedEverything" component={S12_LoomStartedEverything} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S12_DURATION} />
        <Composition id="EdubaS16-EverythingOldNewAgain" component={S16_EverythingOldNewAgain} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S16_DURATION} />
        <Composition id="EdubaS18-OldestComputerWater" component={S18_OldestComputerWater} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S18_DURATION} />
        <Composition id="EdubaS20-SolvedThisOnce" component={S20_SolvedThisOnce} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S20_DURATION} />
      </Folder>

      <Folder name="E-Buzzwords">
        <Composition id="EdubaS15-ModelDoesntMatter" component={S15_ModelDoesntMatter} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S15_DURATION} />
        <Composition id="EdubaS24-AgentsArentWhat" component={S24_AgentsArentWhat} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S24_DURATION} />
        <Composition id="EdubaS21-VoiceProblem" component={S21_VoiceProblem} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={S21_DURATION} />
      </Folder>

      <Folder name="F-Industry">
        <Composition id="EdubaF1-NewModelChanges" component={F1_NewModelChanges} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={F1_DURATION} />
        <Composition id="EdubaF2-VoiceCloning30s" component={F2_VoiceCloning30s} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={F2_DURATION} />
        <Composition id="EdubaF3-AICodingActually" component={F3_AICodingActually} fps={FPS} width={WIDTH} height={HEIGHT} durationInFrames={F3_DURATION} />
      </Folder>

    </Folder>
  );
};
