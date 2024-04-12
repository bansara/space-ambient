import { BufferLoopOptions } from "../BufferLoopOptions";
import { SampleBuffer } from "../Base Classes/SampleBuffer";
import { Sampler } from "../Base Classes/Sampler";

export class LoopBuffer extends SampleBuffer {
  constructor(sampler: Sampler) {
    super(sampler);
  }

  /**
   *
   * @param time to start playback
   * @param note pitch of the note to play
   * @param loopOptions shouldLoop, loopStart, and loopEnd
   */
  playSample(time: number, loopOptions?: BufferLoopOptions) {
    this.source.loop = loopOptions?.shouldLoop || true;
    this.source.loopStart = loopOptions?.loopStart || 0;
    this.source.loopEnd = loopOptions?.loopEnd || this.buffer.duration;
    this.source.start(time);

    const { attack, decay, sustain } = this.envelope;
    this.output.gain.cancelAndHoldAtTime(time);
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
