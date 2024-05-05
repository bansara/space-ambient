import { sampleURLs } from "../../samples/sampleURLs";

export interface OneShotURL {
  url: URL;
  fadeOutTime: number;
}

export interface OneShotPreset {
  sampleURLs: OneShotURL[];
  repeatProbability: number;
  shouldChooseRandomSample: boolean;
  reverbSendGain: number;
  id: string;
}

export const OneShotPresets: { [key: string]: OneShotPreset } = {
  zenBeach: {
    id: "zenBeach",
    sampleURLs: [sampleURLs.oneShots.test1, sampleURLs.oneShots.test2],
    repeatProbability: 0,
    shouldChooseRandomSample: false,
    reverbSendGain: 0,
  },
};
