export interface LfoOptions {
  type?: OscillatorType;
  frequency: number;
  depth: number;
  isCustom?: boolean;
  customWaveform?: [number[], number[]];
}

export class LFO {
  context: AudioContext;
  target: AudioParam;
  gain: GainNode;
  osc: OscillatorNode;
  transitionTime: number = 0.5;

  get updateTime(): number {
    return this.context.currentTime + this.transitionTime;
  }

  constructor(context: AudioContext, target: AudioParam, options: LfoOptions) {
    this.context = context;
    this.target = target;
    this.gain = context.createGain();
    this.gain.connect(target);
    this.osc = context.createOscillator();
    this.osc.connect(this.gain);
    this.setWaveformAndFrequency(options);
    if (this.target.value < 20) {
      // gain node
      this.setGainModulationDepth(options.depth);
    } else {
      // filter freq
      this.setFilterModulationDepth(options.depth);
    }
    const clampedDepth = Math.max(0, Math.min(options.depth, 1));
    this.gain.gain.value = clampedDepth;
    this.osc.start();
  }
  /**
   * Optimised to modulate the filter frequency
   * of a lowpass filter
   *
   * @param value between 0 and 1
   * @param range in Hz +- the cutoff frequency
   */
  setFilterModulationDepth(value: number, range: number = 2250) {
    // Clamp the value to ensure it's between 0 and 1
    const clampedValue = Math.max(0, Math.min(value, 1));

    // Define the default range if not specified, and clamp it to a reasonable range
    const clampedRange = Math.max(0, Math.min(range, 20000));

    // Calculate the modulation extent based on the clamped range
    // The modulation will be centered around the current cutoff frequency
    const scaledValue = clampedRange * clampedValue;

    this.gain.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(scaledValue, this.updateTime);
  }

  /**
   * Modulates an output gain to create
   * isochronic tones
   *
   * @param value between 0 and 1
   */
  setGainModulationDepth(value: number) {
    // modulate the gain value from 0 to 1
    const clampedValue = Math.max(0, Math.min(value, 1));

    this.gain.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(clampedValue, this.updateTime);
  }

  setLfoFrequency(value: number) {
    // Ensure LFO frequency is within a typical LFO range, e.g., 0.1 to 20 Hz
    const clampedLfoFrequency = Math.max(0.1, Math.min(value, 20));

    this.osc.frequency.cancelAndHoldAtTime(this.context.currentTime);
    this.osc.frequency.linearRampToValueAtTime(
      clampedLfoFrequency,
      this.updateTime
    );
  }

  setWaveform(options: LfoOptions) {
    if (options.isCustom) {
      const [real, imag] = options.customWaveform!;
      const wave = this.context.createPeriodicWave(real, imag);
      this.osc.setPeriodicWave(wave);
    } else if (options.type) {
      this.osc.type = options.type || "sine";
    }
  }

  setLfoGainOptions(options: LfoOptions) {
    const { depth } = options;
    this.setWaveformAndFrequency(options);
    this.setGainModulationDepth(depth);
  }

  setLfoFilterOptions(options: LfoOptions) {
    const { depth } = options;
    this.setWaveformAndFrequency(options);
    this.setFilterModulationDepth(depth);
  }

  setWaveformAndFrequency(options: LfoOptions) {
    const { frequency } = options;
    this.setWaveform(options);
    this.setLfoFrequency(frequency);
  }

  deactivate() {
    this.gain.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(0, this.updateTime);
  }
}
