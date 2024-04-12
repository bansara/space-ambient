import { BufferLoopOptions } from "./BufferLoopOptions";
import { notes } from "../notes/notes";

export interface SamplerNote {
  duration?: number;
  loopOptions: BufferLoopOptions;
  note: notes;
}
