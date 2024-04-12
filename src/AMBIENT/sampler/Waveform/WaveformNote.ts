import { notes } from "../../notes/notes";

export interface WaveformNote {
  note: notes;
  duration: number; // in 16th notes
}

export const waveformPattern: (WaveformNote | null)[] = [
  { note: notes.C3, duration: 1 },
  null,
  null,
  null,
  null,
  null,
  { note: notes.G3, duration: 1 },
  null,
  null,
  null,
  null,
  null,
  { note: notes.Bb2, duration: 1 },
  null,
  null,
  null,
];
