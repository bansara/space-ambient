import { notes } from "../notes/notes";

export interface BufferLoopOptions {
  shouldLoop?: boolean;
  loopStart?: number;
  loopEnd?: number;
  isWaveform?: boolean;
  transpose?: boolean;
  sampleBase?: notes;
}
