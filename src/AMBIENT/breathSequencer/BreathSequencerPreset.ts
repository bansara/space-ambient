import { TransposerPreset } from "../sampler/Transposer/TransposerPreset";
import { BreathPattern } from "./BreathSequencer";

export interface BreathSequencerPreset {
  id: string;
  displayName: string;
  breathPattern: BreathPattern;
  breatheTransposer: TransposerPreset;
  holdTransposer?: TransposerPreset;
}
