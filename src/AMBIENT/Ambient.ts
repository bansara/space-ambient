import { UI } from "./UI/ui";
import { Reverb } from "./effects/Reverb";
import { presets } from "./presets/presets";
import { Sampler } from "./sampler/Base Classes/Sampler";
import { SamplerUtils } from "./sampler/Base Classes/SamplerUtils";
import { OneShot } from "./sampler/OneShot/OneShot";
import { StepSequencer } from "./stepSequencer/StepSequencer";
import { StepSequencerPreset } from "./stepSequencer/StepSequencerPreset";
import { createContext } from "./utils/index";

export class Ambient {
  context: AudioContext;
  masterVol: GainNode;
  fadeOutTime = 2;
  sequences: { [key: string]: StepSequencer } = {};
  currentSequence: StepSequencer | undefined;
  ui: UI = new UI(this);
  mood: "major" | "minor" = "major";
  x = 0.5;
  y = 0.5;
  reverb: Reverb;

  constructor() {
    this.context = createContext();
    this.masterVol = this.context.createGain();
    this.reverb = new Reverb(this.context);
    // this.masterVol.connect(this.reverb.input);
    this.reverb.output.connect(this.context.destination);
    this.masterVol.connect(this.context.destination);
    this.addSequence(presets.default);
    // TODO: DELETE BEFORE PRODUCTION
    // @ts-ignore
    window.ambient = this;
  }

  addSequence(preset: StepSequencerPreset): void {
    const { id } = preset;
    this.sequences[id] = new StepSequencer(this, id);
    this.sequences[id].loadPreset(preset);
    this.currentSequence = this.sequences[id];
    this.x = SamplerUtils.unscaleFrequency(
      this.sequences[id].outputEq.frequency.value,
      1000,
      5000
    );
    this.ui.presetChange(preset);
  }

  removeCurrentSequence(): void {
    if (!this.currentSequence) return;
    const { id } = this.currentSequence;
    this.currentSequence.stop();
    this.currentSequence = undefined;
    setTimeout(() => {
      delete this.sequences[id];
    }, this.fadeOutTime * 1500);
  }

  changeSequence(newPreset: StepSequencerPreset): void {
    if (!this.currentSequence || this.currentSequence.id === newPreset.id)
      return;
    this.currentSequence.output.gain.linearRampToValueAtTime(
      0,
      this.context.currentTime + this.fadeOutTime
    );
    this.removeCurrentSequence();
    this.addSequence(newPreset);
  }

  setFilterFrequency = (value: number, min = 1000, max = 5000): void => {
    if (!this.currentSequence) return;
    const { outputEq } = this.currentSequence;
    // Calculate the target frequency based on the x value
    const targetFrequency = SamplerUtils.scaleFrequency(value, min, max);
    // Smoothly ramp to the target frequency over 0.2 seconds
    outputEq.frequency.cancelAndHoldAtTime(this.context.currentTime);
    outputEq.frequency.linearRampToValueAtTime(
      targetFrequency,
      this.context.currentTime + 0.01
    );
  };
  setTransposerProbability = (y: number): void => {
    if (!this.currentSequence) return;
    const { transposers } = this.currentSequence;
    for (const transposer in transposers) {
      const probability =
        (1 + y) / transposers[transposer].probabilityDenominator;

      transposers[transposer].setNoteProbability(probability);
    }
  };

  crossFadeLeftRight = (value: number): void => {
    if (!this.currentSequence || !this.currentSequence.leftRight) return;
    this.currentSequence.leftRight.left.output.gain.cancelAndHoldAtTime(
      this.context.currentTime
    );
    this.currentSequence.leftRight.left.output.gain.linearRampToValueAtTime(
      0.5 * (1 - value) + 0.2,
      this.context.currentTime + 0.01
    );
    this.currentSequence.leftRight.right.output.gain.cancelAndHoldAtTime(
      this.context.currentTime
    );
    this.currentSequence.leftRight.right.output.gain.linearRampToValueAtTime(
      0.5 * value + 0.2,
      this.context.currentTime + 0.01
    );
  };
  crossFadeTopBottom = (value: number): void => {
    if (!this.currentSequence || !this.currentSequence.topBottom) return;
    this.currentSequence.topBottom.bottom.output.gain.cancelAndHoldAtTime(
      this.context.currentTime
    );
    this.currentSequence.topBottom.bottom.output.gain.linearRampToValueAtTime(
      0.5 * (1 - value) + 0.2,
      this.context.currentTime + 0.01
    );
    this.currentSequence.topBottom.top.output.gain.cancelAndHoldAtTime(
      this.context.currentTime
    );
    this.currentSequence.topBottom.top.output.gain.linearRampToValueAtTime(
      0.5 * value + 0.2,
      this.context.currentTime + 0.01
    );
  };

  setReverbSendGain = (value: number): void => {
    if (!this.currentSequence) return;
    this.currentSequence.reverbSend.gain.cancelAndHoldAtTime(
      this.context.currentTime
    );
    this.currentSequence.reverbSend.gain.linearRampToValueAtTime(
      value,
      this.context.currentTime + 0.01
    );
  };
}
