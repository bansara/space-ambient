import { notes } from "../../notes/notes";
import { BufferLoopOptions } from "../BufferLoopOptions";
import { SampleBuffer } from "../Base Classes/SampleBuffer";
import { Sampler } from "../Base Classes/Sampler";
import { SamplerUtils } from "../Base Classes/SamplerUtils";

export class TransposeBuffer extends SampleBuffer {
  constructor(sampler: Sampler) {
    super(sampler);
  }

  /**
   *
   * @param time to start playback
   * @param note pitch of the note to play
   * @param loopOptions shouldLoop, loopStart, and loopEnd
   */
  playSample(time: number, loopOptions: BufferLoopOptions, note: notes) {
    if (loopOptions.transpose) {
      this.source.playbackRate.value =
        SamplerUtils.calculateTransposeMultiplier(
          SamplerUtils.semitonesBetween(loopOptions.sampleBase!, note)
        );
    }
    this.source.loop = false;
    this.source.start(time);

    const { attack, decay, sustain } = this.envelope;
    this.output.gain.cancelScheduledValues(time);
    this.output.gain.setValueAtTime(0, time);
    // attack
    this.output.gain.linearRampToValueAtTime(1, time + attack);
    // decay
    this.output.gain.setTargetAtTime(
      sustain,
      time + attack,
      decay / 5 // 98% of sustain level at decay time
      // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
    );
  }
}
