import { FREQUENCIES } from "../../notes/frequencies";
import { notes } from "../../notes/notes";
import { NOTE_TO_SEMITONE_MAP } from "../../notes/semitoneMap";

export class SamplerUtils {
  public static calculateDuration(
    bpm: number,
    duration16thNotes: number
  ): number {
    // Calculate the duration of one beat in seconds
    const beatDurationInSeconds = 60 / bpm;

    // Calculate the duration of one 16th note in seconds
    const sixteenthNoteDurationInSeconds = beatDurationInSeconds / 4;

    // Calculate the total duration for the given number of 16th notes
    const totalDurationInSeconds =
      sixteenthNoteDurationInSeconds * duration16thNotes;

    return totalDurationInSeconds;
  }

  /**
   *
   * @param x from 0 to 1 input from the UI
   * @param minFrequency
   * @param maxFrequency
   * @returns
   */
  public static scaleFrequency(
    x: number,
    minFrequency: number,
    maxFrequency: number
  ) {
    // Calculate the target frequency using the logarithmic scaling formula
    const frequency = minFrequency * Math.pow(maxFrequency / minFrequency, x);

    return frequency;
  }

  public static unscaleFrequency(
    frequency: number,
    minFrequency: number,
    maxFrequency: number
  ): number {
    // Guard against invalid frequency input
    if (frequency < minFrequency || frequency > maxFrequency) {
      throw new Error("Frequency is out of bounds");
    }

    // Logarithmic reverse calculation to find x
    const x =
      Math.log(frequency / minFrequency) /
      Math.log(maxFrequency / minFrequency);

    return x;
  }

  /**
   *
   * @param semitones to transpose, can be + or -
   * @returns the playback rate to transpose a sample
   */
  public static calculateTransposeMultiplier(semitones: number): number {
    return Math.pow(2, semitones / 12);
  }

  /**
   *
   * takes single-cycle waveforms and calculates
   * sampler playback rate to get musical notes
   * @param bufferLength of the sample
   * @param sampleRate of the sample
   * @param targetNote e.g. C3 - must be between C2 and C4
   * @returns the playback rate to tune a waveform
   */
  public static calculatePlaybackRateForWaveform(
    targetNote: notes,
    buffer: AudioBuffer
  ): number {
    const { length, sampleRate } = buffer;

    const targetFrequency = FREQUENCIES[targetNote];

    // Calculate the current frequency of the waveform
    const currentFrequency = sampleRate / length;

    // Calculate the playback rate to adjust to the target note
    const playbackRate = targetFrequency / currentFrequency;

    return playbackRate;
  }

  public static semitonesBetween(baseNote: notes, targetNote: notes): number {
    return NOTE_TO_SEMITONE_MAP[targetNote] - NOTE_TO_SEMITONE_MAP[baseNote];
  }
}
