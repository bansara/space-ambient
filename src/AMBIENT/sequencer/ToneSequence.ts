import { ADSR, Tone } from "../synths";
import { ToneNote } from "./ToneNote";
import { Sequence } from "./Sequence";

export interface ToneSequenceOptions {
  type: OscillatorType; // sine, triangle, sawtooth, square
  gain: number; // from 0 to 1 - the gain.value of the gain node
  envelope: ADSR; // attack decay sustain release of the note
  lowpassFactor?: number; // optional: adds a lowpass filter at frequency * lowpassFactor
}

export interface ToneSequence extends Sequence<ToneNote> {
  options: ToneSequenceOptions;
  play: (note: ToneNote, time: number, tempo: number) => void;
}

export function createToneSequence(
  context: AudioContext,
  name: string,
  pattern: (ToneNote | null)[],
  options: ToneSequenceOptions
): ToneSequence {
  const gain = context.createGain();
  gain.connect(context.destination);
  return {
    name,
    pattern,
    isPlaying: false,
    shouldPlayNextLoop: false,
    gain,
    options,
    play(note, time, tempo) {
      const tone = new Tone(context, note, options);
      tone.output.connect(gain);
      tone.playNote(time, tempo);
    },
    clearPattern() {
      this.pattern = Array(16).fill(null);
    },
  };
}
