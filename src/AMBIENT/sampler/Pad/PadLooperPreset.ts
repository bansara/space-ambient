import { LfoOptions } from "../../effects/LFO";
import { SamplerPreset } from "../Base Classes/SamplerPreset";
import { ADSR } from "../../synths";
import { sampleURLs } from "../../samples/sampleURLs";
import { createRoundedSquare } from "../../periodicWaves/roundedSquare";
import { PadLooper } from "./PadLooper";

export interface PadLooperPreset extends SamplerPreset {
  lfoGain: LfoOptions;
  lfoFilter: LfoOptions;
  envelope: ADSR;
}

export interface StepSequencerPadLoopers {
  [key: string]: PadLooper;
}

export interface StepSequencerPadLooperPresets {
  [key: string]: PadLooperPreset;
}

export const padLooperPresets: { [key: string]: PadLooperPreset } = {
  hamsadhwani: {
    id: "hamsadhwani",
    path: sampleURLs.padloopers.hamsadhwani.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.002,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0,
  },
  ocean: {
    id: "ocean",
    path: sampleURLs.padloopers.ocean.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.002,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0,
  },
  rain: {
    id: "rain",
    path: sampleURLs.padloopers.rain.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.002,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0,
  },
  junoOctave: {
    id: "junoOctave",
    path: sampleURLs.padloopers.junoOctave.url,
    lfoGain: {
      frequency: 0.02,
      depth: 0.2,
    },
    lfoFilter: {
      frequency: 0.001,
      depth: 0.5,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
  uke: {
    id: "uke",
    path: sampleURLs.padloopers.uke.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
  bouzouki: {
    id: "bouzouki",
    path: sampleURLs.padloopers.bouzouki.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
  majPentLoop: {
    id: "majPentLoop",
    path: sampleURLs.padloopers.majPentLoop.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 1,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
  isochronic: {
    id: "isochronic",
    path: sampleURLs.padloopers.isochronic.url,
    lfoGain: {
      isCustom: true,
      customWaveform: createRoundedSquare(),
      frequency: 8,
      depth: 1,
    },
    lfoFilter: {
      frequency: 0.1,
      depth: 0,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
  devLoop: {
    id: "devLoop",
    path: sampleURLs.padloopers.loop.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.002,
      depth: 0.2,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    reverbSendGain: 0.5,
  },
};
