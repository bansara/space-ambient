import { Binaural } from "../../synths/binaural/Binaural";
import { PadLooper } from "../Pad/PadLooper";
import { PadLooperPreset } from "../Pad/PadLooperPreset";
import { Transposer } from "../Transposer/Transposer";
import { TransposerPreset } from "../Transposer/TransposerPreset";
// import { Waveform } from "../Waveform/Waveform";

/**
 * UPDATE BOTH OF THESE TOGETHER
 * OR HILARITY WILL ENSUE
 */

export interface AmbientSamplers {
  padLooper?: PadLooper;
  transposer1?: Transposer;
  transposer2?: Transposer;
  // arp?: Waveform;
  isochronic?: PadLooper;
  binaural?: Binaural;
}

export type AmbientSamplersPresets = {
  [key: string]: {
    padLooper?: PadLooperPreset;
    transposer1?: TransposerPreset;
    transposer2?: TransposerPreset;
    isochronic?: PadLooperPreset;
    binaural?: Binaural;
    // add arp preset here
  };
};
