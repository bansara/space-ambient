import { PadLooperPreset } from "../sampler/Pad/PadLooperPreset";
import { sampleURLs } from "../samples/sampleURLs";

export const natureSounds: { [key: string]: PadLooperPreset } = {
  birds: {
    id: "birds",
    path: sampleURLs.padloopers.birds.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 0,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
  ocean: {
    id: "ocean",
    path: sampleURLs.padloopers.ocean.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 0,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
  rain: {
    id: "rain",
    path: sampleURLs.padloopers.rain.url,
    lfoGain: {
      frequency: 1,
      depth: 0,
    },
    lfoFilter: {
      frequency: 0.02,
      depth: 0,
    },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 4,
    },
  },
};
