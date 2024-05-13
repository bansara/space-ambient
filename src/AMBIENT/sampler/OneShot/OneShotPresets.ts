import { sampleURLs } from "../../samples/sampleURLs";

export interface OneShotURL {
  url: URL;
  fadeTime: number;
}

export interface OneShotPreset {
  sampleURLs: OneShotURL[];
  repeatProbability: number;
  shouldChooseRandomSample: boolean;
  reverbSendGain: number;
  shouldCrossfade: boolean;
  id: string;
}

export const OneShotPresets: { [key: string]: OneShotPreset } = {
  zenBeach: {
    id: "zenBeach",
    sampleURLs: [sampleURLs.oneShots.test3],
    repeatProbability: 0,
    shouldChooseRandomSample: false,
    reverbSendGain: 0,
    shouldCrossfade: true,
  },
};
