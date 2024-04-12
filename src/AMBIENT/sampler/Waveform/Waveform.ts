// import { LFO } from "../../effects/LFO";
// import { notes } from "../../notes/notes";
// import { WaveformBuffer } from "./WaveformBuffer";
// import { Sampler } from "../Base Classes/Sampler";
// import { Ambient } from "../../Ambient";
// import { WaveformNote, waveformPattern } from "./WaveformNote";
// import { SamplerUtils } from "../Base Classes/SamplerUtils";

// export class Waveform extends Sampler {
//   lfoGain: LFO;
//   lfoFreq: LFO;
//   envelope = {
//     attack: 0.1,
//     decay: 0,
//     sustain: 1,
//     release: 1,
//   };
//   loopOptions = {
//     shouldLoop: true,
//   };
//   note: WaveformBuffer | null = null;
//   pattern: (WaveformNote | null)[] = waveformPattern;
//   constructor(ambient: Ambient, path: URL) {
//     super(ambient, path);
//     this.lfoGain = new LFO(this.context, this.output.gain, {
//       type: "triangle",
//       frequency: 0.1,
//       depth: 0,
//     });
//     this.lfoFreq = new LFO(this.context, this.lfoEq.frequency, {
//       type: "sine",
//       frequency: 0.02,
//       depth: 0,
//     });
//     this.lfoEq.frequency.value = 1500;
//     this.output.gain.value = 0.0;
//   }

//   playback(beatNumber: number): void {
//     const note = this.pattern[beatNumber];
//     if (note) {
//       this.playSample(this.ambient.nextNoteTime, note.note, note.duration);
//     }
//   }

//   playSample(time: number, note: notes, duration?: number | undefined): void {
//     this.note = new WaveformBuffer(this);
//     this.note?.output.connect(this.lfoEq);
//     this.note?.playSample(time, this.loopOptions, note);
//     if (duration) {
//       const stopTime =
//         time + SamplerUtils.calculateDuration(this.ambient.tempo, duration);
//       this.stopSample(stopTime, note);
//     }
//   }

//   stopSample(time: number, note: notes): void {
//     const player = this.note;
//     if (player) {
//       player.stopSample(time);

//       // Calculate the delay for setTimeout based on
//       // AudioContext's current time and stopTime
//       const { currentTime } = this.context;
//       const delayForCleanup = Math.max(
//         0,
//         (time - currentTime + this.envelope.release) * 1000 // ms
//       );
//       // Schedule cleanup
//       setTimeout(() => this.cleanup(), delayForCleanup);
//     }
//   }

//   cleanup(): void {
//     this.note = null;
//   }
// }
