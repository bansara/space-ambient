import {
  PadLooperPreset,
  StepSequencerPadLooperPresets,
} from "../sampler/Pad/PadLooperPreset";
import { TransposerPreset } from "../sampler/Transposer/TransposerPreset";
import { BinauralPreset } from "../synths/binaural/Binaural";

export interface StepSequencerPreset {
  id: string;
  tempo: number;
  sequenceLength: number;
  padLoopers?: StepSequencerPadLooperPresets;
  transposers?: TransposerPreset[];
  oneShots?: URL[];
  displayName: string;
  binaural: BinauralPreset;
  nature: PadLooperPreset;
  mood: "major" | "minor";
  imgSrc: string;
}
