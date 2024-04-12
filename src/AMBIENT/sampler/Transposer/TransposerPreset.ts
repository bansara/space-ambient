import { notes } from "../../notes/notes";
import { SamplerPreset } from "../Base Classes/SamplerPreset";
import { ADSR } from "../../synths";
import { sampleURLs } from "../../samples/sampleURLs";

export interface TransposerPreset extends SamplerPreset {
  envelope: ADSR;
  sampleBase: notes;
  noteSet?: notes[];
  pattern?: (notes | null)[];
  probabilityDenominator?: number;
  noteDuration?: number;
  useRandomPattern?: boolean; // defauts to true
}

export const transposerPresets: { [key: string]: TransposerPreset } = {
  piano: {
    id: "piano",
    path: sampleURLs.transposers.piano.url,
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 2,
    },
    sampleBase: sampleURLs.transposers.piano.sampleBase,
    noteDuration: 4,
    probabilityDenominator: 32,
    useRandomPattern: true,
  },
  breathPiano: {
    id: "breathPiano",
    path: sampleURLs.transposers.piano.url,
    envelope: {
      attack: 0.1,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    sampleBase: sampleURLs.transposers.piano.sampleBase,
    noteDuration: 4,
    useRandomPattern: false,
  },
  warmString: {
    id: "warmString",
    path: sampleURLs.transposers.warmString.url,
    sampleBase: sampleURLs.transposers.warmString.sampleBase,
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
  airTone: {
    id: "airTone",
    path: sampleURLs.transposers.airTone.url,
    sampleBase: sampleURLs.transposers.airTone.sampleBase,
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
  breathAirTone: {
    id: "breathAirTone",
    path: sampleURLs.transposers.airTone.url,
    sampleBase: sampleURLs.transposers.airTone.sampleBase,
    envelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 2,
    },
    noteDuration: 2,
    useRandomPattern: false,
  },
  metronome: {
    id: "metronome",
    path: sampleURLs.transposers.metronome.url,
    sampleBase: sampleURLs.transposers.metronome.sampleBase,
    envelope: {
      attack: 0,
      decay: 0,
      sustain: 1,
      release: 0,
    },
    useRandomPattern: false,
    noteDuration: 1,
  },
  celeste: {
    id: "celeste",
    path: sampleURLs.transposers.celeste.url,
    sampleBase: sampleURLs.transposers.celeste.sampleBase,
    envelope: {
      attack: 0.1,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
  breatheCeleste: {
    id: "breatheCeleste",
    path: sampleURLs.transposers.celeste.url,
    sampleBase: sampleURLs.transposers.celeste.sampleBase,
    envelope: {
      attack: 0.1,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    useRandomPattern: false,
  },
  spacePiano: {
    id: "spacePiano",
    path: sampleURLs.transposers.spacePiano.url,
    sampleBase: sampleURLs.transposers.spacePiano.sampleBase,
    envelope: {
      attack: 0.1,
      decay: 0,
      sustain: 1,
      release: 4,
    },
    useRandomPattern: false,
  },
  topAir: {
    id: "topAir",
    path: sampleURLs.transposers.topAir.url,
    sampleBase: sampleURLs.transposers.topAir.sampleBase,
    envelope: {
      attack: 0.1,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
};
