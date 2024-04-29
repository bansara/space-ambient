import { sampleURLs } from "../../samples/sampleURLs";

export interface OneShotPreset {
  sampleURLs: URL[];
  probability: number;
  numberOfLoops: number;
  reverbSendGain: number;
  id: string;
}

export const OneShotPresets: { [key: string]: OneShotPreset } = {
  zenBeach: {
    id: "zenBeach",
    sampleURLs: [
      sampleURLs.transposers.celeste.url,
      sampleURLs.transposers.spacePiano.url,
    ],
    probability: 0.5,
    numberOfLoops: 2,
    reverbSendGain: 0.5,
  },
};
