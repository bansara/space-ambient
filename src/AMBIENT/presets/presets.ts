import { FREQUENCIES, notes } from "../sampler";
import { OneShot } from "../sampler/OneShot/OneShot";
import { OneShotPresets } from "../sampler/OneShot/OneShotPresets";
import { padLooperPresets } from "../sampler/Pad/PadLooperPreset";
import { transposerPresets } from "../sampler/Transposer/TransposerPreset";
import { StepSequencerPreset } from "../stepSequencer/StepSequencerPreset";
import { binauralFrequencies } from "../synths/binaural";
import { natureSounds } from "./naturePresets";
import n1 from "../../images/n1.webp";
import n3 from "../../images/n3.webp";

export const presets: { [key: string]: StepSequencerPreset } = {
  default: {
    id: "default",
    displayName: "Zen Beach",
    imgSrc: n1,
    tempo: 120,
    sequenceLength: 16,
    mood: "major",
    // padLoopers: {
    //   low: padLooperPresets.majPentLoop,
    //   high: padLooperPresets.hamsadhwani,
    // },
    right: {
      type: "padLooper",
      sampler: padLooperPresets.ocean,
    },
    left: {
      type: "padLooper",
      sampler: padLooperPresets.rain,
    },
    // transposers: [
    //   {
    //     ...transposerPresets.warmString,
    //     noteSet: [notes.G2, notes.A2, notes.C3, notes.D3, notes.E3],
    //   },
    // ],
    oneShots: OneShotPresets.zenBeach,
    binaural: {
      binauralFrequency: binauralFrequencies.theta,
      baseFrequency: FREQUENCIES[notes.C2],
    },
    nature: natureSounds.ocean,
  },
  // ambientPiano: {
  //   id: "ambientPiano",
  //   displayName: "Ambient Piano",
  //   tempo: 120,
  //   sequenceLength: 16,
  //   mood: "minor",
  //   padLoopers: [padLooperPresets.devLoop],
  //   transposers: [
  //     {
  //       ...transposerPresets.piano,
  //       noteSet: [notes.G2, notes.Ab2, notes.Bb2, notes.C3, notes.Eb3],
  //     },
  //     {
  //       ...transposerPresets.piano,
  //       noteSet: [notes.F3, notes.D3, notes.G3, notes.Bb3],
  //     },
  //   ],
  //   binaural: {
  //     binauralFrequency: binauralFrequencies.alpha,
  //     baseFrequency: FREQUENCIES[notes.C2],
  //   },
  //   nature: natureSounds.rain,
  // },
  hamsadhwani: {
    id: "hamsadhwani",
    displayName: "Hamsadhwani",
    imgSrc: n3,
    tempo: 120,
    sequenceLength: 16,
    mood: "major",
    padLoopers: {
      high: padLooperPresets.hamsadhwani,
      low: padLooperPresets.junoOctave,
    },
    right: {
      type: "padLooper",
      sampler: padLooperPresets.bouzouki,
    },
    left: {
      type: "padLooper",
      sampler: padLooperPresets.uke,
    },
    transposers: [
      {
        ...transposerPresets.celeste,
        noteSet: [notes.C3, notes.D3, notes.E3, notes.G3, notes.B3, notes.D4],
        probabilityDenominator: 64,
      },
      {
        ...transposerPresets.spacePiano,
        noteSet: [
          notes.C2,
          notes.G2,
          notes.C3,
          notes.D3,
          notes.E3,
          notes.G3,
          notes.B3,
          notes.D4,
          notes.E4,
          notes.G4,
        ],
        probabilityDenominator: 64,
        sampleBase: notes.C4,
      },
      {
        ...transposerPresets.topAir,
        noteSet: [notes.C3, notes.G3, notes.C4],
        probabilityDenominator: 64,
      },
    ],
    binaural: {
      binauralFrequency: binauralFrequencies.alpha,
      baseFrequency: FREQUENCIES[notes.C2],
    },
    nature: natureSounds.birds,
  },
};
