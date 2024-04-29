import { OneShot } from "../sampler/OneShot/OneShot";
import { OneShotPreset } from "../sampler/OneShot/OneShotPresets";
import {
  PadLooperPreset,
  StepSequencerPadLooperPresets,
} from "../sampler/Pad/PadLooperPreset";
import { TransposerPreset } from "../sampler/Transposer/TransposerPreset";
import { BinauralPreset } from "../synths/binaural/Binaural";

export interface LeftRightSampler {
  type: "transposer" | "padLooper" | "oneShot";
  sampler: TransposerPreset | PadLooperPreset | OneShotPreset;
}

export interface StepSequencerPreset {
  id: string;
  tempo: number;
  sequenceLength: number;
  padLoopers?: StepSequencerPadLooperPresets;
  left: LeftRightSampler;
  right: LeftRightSampler;
  transposers?: TransposerPreset[];
  oneShots?: OneShotPreset;
  displayName: string;
  binaural: BinauralPreset;
  nature: PadLooperPreset;
  mood: "major" | "minor";
  imgSrc: string;
}
