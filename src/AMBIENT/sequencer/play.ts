// import { Ambient } from "../Ambient";
// import { notes } from "../sampler";
// import { PadLooper } from "../sampler/Pad/PadLooper";
// import { Transposer } from "../sampler/Transposer/Transposer";

// /**
//  * This is what actually triggers the notes that get played
//  *
//  * @param ambient the top level class of the app
//  * @param beatNumber of the sequence, 0-indexed
//  */
// export const scheduleNote = (ambient: Ambient, beatNumber: number): void => {
//   // Object.values(ambient.samplers).forEach((sampler, i) => {
//   //   sampler.playback(beatNumber);
//   // });
//   ambient.playAll(beatNumber);
// };

// /**
//  * calculates the next note time and
//  * increments the current note and keeps it
//  * within the bounds of the sequence length
//  *
//  * @param ambient
//  */
// export const nextNote = (ambient: Ambient): void => {
//   // TODO: move this to ambient class and make it a property
//   // when implementing changeTempo function
//   const secondsPerBeat: number = 60 / (ambient.tempo * 4);

//   if (ambient.currentNote % 2 === 0) {
//     ambient.nextNoteTime += secondsPerBeat;
//   } else {
//     ambient.nextNoteTime += secondsPerBeat;
//   }
//   ambient.currentNote++;
//   if (ambient.currentNote === ambient.sequenceLength) {
//     ambient.currentNote = 0;
//   }
// };

// /**
//  * responsible for the timing of the sequencer.
//  *
//  * @param ambient
//  */
// export const scheduler = (ambient: Ambient): void => {
//   while (
//     ambient.nextNoteTime <
//     ambient.context.currentTime + ambient.scheduleAheadTime
//   ) {
//     scheduleNote(ambient, ambient.currentNote);
//     nextNote(ambient);
//   }
//   ambient.timerId = setTimeout(() => scheduler(ambient), ambient.lookAhead);
// };

// export const play = (ambient: Ambient): void => {
//   if (ambient.context.state !== "running") {
//     ambient.context.resume();
//   }
//   if (!ambient.isPlaying) {
//     ambient.isPlaying = true;
//     ambient.currentNote = 0;
//     ambient.nextNoteTime =
//       ambient.context.currentTime + ambient.scheduleAheadTime;
//     scheduler(ambient);
//   }
// };

// export const stop = (ambient: Ambient): void => {
//   if (ambient.isPlaying) {
//     ambient.isPlaying = false;
//     clearTimeout(ambient.timerId!);
//     ambient.stopAll();
//   }
// };
