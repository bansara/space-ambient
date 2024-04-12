import { ADSR } from "../synths";
/**
 * @interface
 * represents a note played by a Tone instance
 */
export interface ToneNote {
  frequency: number; // in Hz of the oscillator
  duration: number; // integer - the number of sequencer steps the note sustains for
}
