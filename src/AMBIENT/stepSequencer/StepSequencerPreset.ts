import { OneShot } from "../sampler/OneShot/OneShot";
import { OneShotPreset } from "../sampler/OneShot/OneShotPresets";
import {
  PadLooperPreset,
  StepSequencerPadLooperPresets,
} from "../sampler/Pad/PadLooperPreset";
import { TransposerPreset } from "../sampler/Transposer/TransposerPreset";
import { BinauralPreset } from "../synths/binaural/Binaural";

export interface XYSampler {
  type: "transposer" | "padLooper" | "oneShot";
  sampler: TransposerPreset | PadLooperPreset | OneShotPreset;
}

export interface LeftRight {
  left: XYSampler;
  right: XYSampler;
}

export interface TopBottom {
  top: XYSampler;
  bottom: XYSampler;
}

export enum XYFunctions {
  setFilterFrequency = "setFilterFrequency",
  setTransposerProbability = "setTransposerProbability",
  crossFadeLeftRight = "crossFadeLeftRight",
  crossFadeTopBottom = "crossFadeTopBottom",
  setReverbSendGain = "setReverbSendGain",
}

export interface StepSequencerPreset {
  id: string;
  tempo: number;
  sequenceLength: number;
  leftRight?: LeftRight;
  topBottom?: TopBottom;
  xFunction: XYFunctions;
  yFunction: XYFunctions;
  padLoopers?: StepSequencerPadLooperPresets;
  transposers?: TransposerPreset[];
  oneShots?: OneShotPreset;
  displayName: string;
  binaural: BinauralPreset;
  imgSrc: string;
  isPremiumContent: boolean;
}
