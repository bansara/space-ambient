/**
 * @interface
 *  an amplitude envelope for an oscillator
 * @property (number) attack - time in seconds
 * @property (number) decay - time in seconds
 * @property (number) sustain - gain from 0 to 1
 * @property (number) release - time in seconds
 */
export interface ADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}
