import { BreathSequencerPreset } from "../breathSequencer/BreathSequencerPreset";
import { transposerPresets } from "../sampler/Transposer/TransposerPreset";

export const breathPresets: { [key: string]: BreathSequencerPreset } = {
  hrv: {
    id: "hrv",
    displayName: "Heart Rate Variability",
    breathPattern: {
      inhale: 4,
      inhaleHold: 0,
      exhale: 4,
      exhaleHold: 0,
      tempo: 40,
    },
    breatheTransposer: transposerPresets.breatheCeleste,
  },
  box: {
    id: "box",
    displayName: "Box Breathing",
    breathPattern: {
      inhale: 4,
      inhaleHold: 4,
      exhale: 4,
      exhaleHold: 4,
      tempo: 60,
    },
    breatheTransposer: transposerPresets.breatheCeleste,
    holdTransposer: transposerPresets.breathAirTone,
  },
};
