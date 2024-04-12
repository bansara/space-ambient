import { ToneNote, ToneSequenceOptions } from "../sequencer";
import { createGain, createOscillator } from "../utils";
import { ADSR } from "./interfaces/ADSR";

/**
 * The fundamental building block of every synth.
 * Each instance of this class represents a single
 * oscillator that plays one note, then dies
 */
export class Tone {
  context: AudioContext;
  oscillator: OscillatorNode;
  output: GainNode;
  gain: number;
  envelope: ADSR;
  duration: number;
  stopNoteCalled?: NodeJS.Timeout;
  /**
   *
   * @param context the base audio context
   * @param toneNote a SynthNote object with properties
   */
  constructor(
    context: AudioContext,
    toneNote: ToneNote,
    options: ToneSequenceOptions
  ) {
    const { type, gain, envelope, lowpassFactor } = options;
    const { frequency, duration } = toneNote;
    this.context = context;
    this.envelope = envelope;
    this.duration = duration;
    this.gain = gain;
    this.oscillator = createOscillator(this.context, type, frequency);
    this.output = createGain(this.context, 0);
    if (lowpassFactor) {
      const eq = this.context.createBiquadFilter();
      eq.type = "lowpass";
      eq.frequency.value = frequency * lowpassFactor;
      this.oscillator.connect(eq);
      eq.connect(this.output);
    } else {
      this.oscillator.connect(this.output);
    }
  }
  /**
   *
   * @param gain a number between 0 and 1
   */
  public playNote(time: number, tempo: number) {
    const { attack, decay, sustain } = this.envelope;

    if (this.gain > 1) {
      this.gain = 1;
    }

    // allow note to be retriggered if playNote called again before disconnected
    if (this.stopNoteCalled) {
      clearTimeout(this.stopNoteCalled);
    }
    this.output.gain.cancelScheduledValues(time);

    // attack
    this.output.gain.linearRampToValueAtTime(this.gain, time + attack);
    //decay
    this.output.gain.setTargetAtTime(
      this.gain * sustain,
      time + attack,
      decay / 4 // 98% of sustain level at decay time
      // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
    );
    // convert duration in 16th notes to seconds
    const noteLength = (60 / tempo) * (this.duration / 4);
    this.stopNote(time, noteLength);
  }
  public stopNote(time: number, noteLength: number) {
    const { release } = this.envelope;
    const stopTime = time + noteLength;
    this.output.gain.cancelScheduledValues(stopTime);
    // release

    this.output.gain.setTargetAtTime(0, stopTime, release / 5);
    this.stopNoteCalled = setTimeout(() => {
      this.oscillator.stop();
      this.output.disconnect();
    }, noteLength * 1000 + release * 5000);
  }
}
