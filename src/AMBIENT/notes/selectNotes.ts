import { BufferLoopOptions, SamplerNote } from "../sampler";
import { aMinor911, aMinor911Weights } from "./harmonies";

// Define the musical weights for each beat
const musicalWeights = [
  0.75, 0.25, 0.5, 0.25, 0.6, 0.25, 0.4, 0.25, 0.7, 0.25, 0.5, 0.25, 0.55, 0.25,
  0.4, 0.25,
];

// Define the notes and their relative weights

// Function to randomly select a note based on weights
function chooseNote(): SamplerNote {
  let randomValue = Math.random();
  let cumulativeProbability = 0;
  const loopOptions: BufferLoopOptions = {
    shouldLoop: true,
    isWaveform: true,
  };
  let note: SamplerNote = { note: aMinor911[0], loopOptions };

  for (let i = 0; i < aMinor911.length; i++) {
    cumulativeProbability += aMinor911Weights[i];
    if (randomValue < cumulativeProbability) {
      note = { note: aMinor911[i], duration: 0.5, loopOptions };
      break;
    }
  }
  return note;
}

// Function to generate a sequence of notes based on musical weights
export function generateSequence(): (SamplerNote | null)[] {
  let sequence = [];

  for (let i = 0; i < musicalWeights.length; i++) {
    if (Math.random() < musicalWeights[i]) {
      sequence.push(chooseNote());
    } else {
      sequence.push(null); // No note is played
    }
  }

  return sequence;
}

// Example usage
const sequence = generateSequence();
console.log(sequence);
