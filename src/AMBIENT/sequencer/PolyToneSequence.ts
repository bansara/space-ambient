// import { Tone } from "../synths";
// import { ToneNote } from "./ToneNote";
// import { Sequence } from "./Sequence";

// export interface PolyToneSequence extends Sequence<ToneNote[]> {
//   play: (notes: ToneNote[], time: number, tempo: number) => void;
// }

// export function createPolyToneSequence(
//   context: AudioContext,
//   name: string,
//   pattern: (ToneNote[] | null)[]
// ): PolyToneSequence {
//   const gain = context.createGain();
//   gain.connect(context.destination);
//   return {
//     name,
//     pattern,
//     isPlaying: false,
//     shouldPlayNextLoop: false,
//     gain,
//     play(notes, time, tempo) {
//       notes.forEach((note) => {
//         const tone = new Tone(context, note);
//         tone.output.connect(gain);
//         tone.playNote(time, tempo);
//       });
//     },
//     clearPattern() {
//       this.pattern = Array(16).fill(null);
//     },
//   };
// }
