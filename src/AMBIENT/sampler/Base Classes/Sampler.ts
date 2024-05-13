import { ADSR } from "../../synths";
import { BufferLoopOptions } from "../BufferLoopOptions";
import { notes } from "../../notes/notes";
import { SampleBuffer } from "./SampleBuffer";
import { Ambient } from "../../Ambient";
import { SamplerUtils } from "./SamplerUtils";
import { StepSequencer } from "../../stepSequencer/StepSequencer";

export abstract class Sampler {
  ambient: Ambient;
  context: AudioContext;
  output: GainNode;
  lfoEq: BiquadFilterNode;
  outputEq: BiquadFilterNode;
  buffer!: AudioBuffer;
  sequencer: StepSequencer;
  reverbSend: GainNode;

  abstract envelope: ADSR;
  abstract loopOptions: BufferLoopOptions;

  constructor(ambient: Ambient, path: URL, sequencer: StepSequencer) {
    this.ambient = ambient;
    this.context = ambient.context;
    this.sequencer = sequencer;
    this.lfoEq = this.context.createBiquadFilter();
    this.lfoEq.type = "lowpass";
    this.lfoEq.frequency.value = 2750;
    this.outputEq = this.context.createBiquadFilter();
    this.outputEq.type = "lowpass";
    this.outputEq.frequency.value = 5000;
    this.output = this.context.createGain();
    this.reverbSend = this.context.createGain();
    this.reverbSend.connect(sequencer.reverbSend);
    this.lfoEq.connect(this.outputEq);
    this.outputEq.connect(this.output);
    this.outputEq.connect(this.reverbSend);
    this.output.connect(this.sequencer.output);
    this.loadSample(path);
  }

  loadSample(path: URL, sampleBase?: notes): Promise<void> {
    if (sampleBase) {
      this.loopOptions.sampleBase = sampleBase;
    }
    return new Promise((resolve, reject) => {
      fetch(path)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          this.buffer = audioBuffer;
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  abstract stopSample(time: number, note?: notes, player?: SampleBuffer): void;

  abstract playback(beatNumber: number): void;

  setEqFrequency(frequency: number) {
    this.lfoEq.frequency.cancelScheduledValues(this.context.currentTime);
    this.lfoEq.frequency.linearRampToValueAtTime(
      frequency,
      this.context.currentTime + 1
    );
    return this;
  }

  setFilterFrequency(x: number) {
    // Calculate the target frequency based on the x value
    const targetFrequency = SamplerUtils.scaleFrequency(x, 1000, 5000);
    // Smoothly ramp to the target frequency over 0.001 seconds
    this.outputEq.frequency.linearRampToValueAtTime(
      targetFrequency,
      this.context.currentTime + 0.001
    );
  }

  setEnvelope(envelope: ADSR) {
    this.envelope = envelope;
    return this;
  }

  setReverbSendGain(gain: number) {
    this.reverbSend.gain.value = gain;
    return this;
  }

  /**
   * used for UI interaction
   * @param gain output volume
   * @returns the sampler instance for method chaining
   */
  setOutputGain(gain: number, transitionTime: number = 0.01) {
    this.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.output.gain.linearRampToValueAtTime(
      gain,
      this.context.currentTime + transitionTime
    );
    return this;
  }
}
