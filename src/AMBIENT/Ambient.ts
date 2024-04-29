import { UI } from "./UI/ui";
import { BreathSequencer } from "./breathSequencer/BreathSequencer";
import { BreathSequencerPreset } from "./breathSequencer/BreathSequencerPreset";
import { Reverb } from "./effects/CombinedReverb";
import { presets } from "./presets/presets";
import { SamplerUtils } from "./sampler/Base Classes/SamplerUtils";
import { StepSequencer } from "./stepSequencer/StepSequencer";
import { StepSequencerPreset } from "./stepSequencer/StepSequencerPreset";
import { createContext } from "./utils/index";

export class Ambient {
  context: AudioContext;
  masterVol: GainNode;
  fadeOutTime = 2;
  sequences: { [key: string]: StepSequencer } = {};
  currentSequence: StepSequencer | undefined;
  breathSequence: BreathSequencer | undefined;
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
    // this.reverb.output.connect(this.context.destination);
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
    this.mood = preset.mood;
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

  loadBreathSequence(preset: BreathSequencerPreset): void {
    if (this.breathSequence) {
      this.breathSequence.stop();
      this.breathSequence = undefined;
    }
    this.breathSequence = new BreathSequencer(this);
    this.ui.loadBreathSequence();
    this.breathSequence.loadBreathPreset(preset);
  }

  setFilterFrequency = (x: number, min = 1000, max = 5000): void => {
    if (!this.currentSequence) return;
    const { outputEq } = this.currentSequence;
    // Calculate the target frequency based on the x value
    const targetFrequency = SamplerUtils.scaleFrequency(x, min, max);
    // Smoothly ramp to the target frequency over 0.2 seconds
    outputEq.frequency.cancelAndHoldAtTime(this.context.currentTime);
    outputEq.frequency.linearRampToValueAtTime(
      targetFrequency,
      this.context.currentTime + 0.2
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

  crossFadeLowHigh = (y: number): void => {
    if (!this.currentSequence) return;
    const { padLoopers } = this.currentSequence;
    const { low, high } = padLoopers;
    low?.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    low?.output.gain.linearRampToValueAtTime(
      0.5 * (1 - y) + 0.2,
      this.context.currentTime + 0.01
    );
    high?.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    high?.output.gain.linearRampToValueAtTime(
      0.5 * y + 0.2,
      this.context.currentTime + 0.01
    );
    this.setFilterFrequency(y, 1000, 5000);
  };

  crossFadeLeftRight = (x: number): void => {
    if (!this.currentSequence) return;
    const { left, right } = this.currentSequence;
    left?.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    left?.output.gain.linearRampToValueAtTime(
      0.5 * (1 - x) + 0.05,
      this.context.currentTime + 0.01
    );
    right?.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    right?.output.gain.linearRampToValueAtTime(
      0.5 * x + 0.05,
      this.context.currentTime + 0.01
    );
    this.setTransposerProbability(x);
  };
}
