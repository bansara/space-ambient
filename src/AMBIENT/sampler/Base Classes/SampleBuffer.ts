import { notes } from "../../notes/notes";
import { ADSR } from "../../synths";
import { BufferLoopOptions } from "../BufferLoopOptions";
import { Sampler } from "./Sampler";

export abstract class SampleBuffer {
  context: AudioContext;
  output: GainNode;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode;
  envelope: ADSR;
  constructor(sampler: Sampler) {
    this.context = sampler.context;
    this.buffer = sampler.buffer;
    this.envelope = sampler.envelope;
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.output = this.context.createGain();
    this.source.connect(this.output);
  }

  abstract playSample(
    time: number,
    loopOptions: BufferLoopOptions,
    note?: notes
  ): void;

  stopSample(time: number): void {
    // if called before attack and decay phase finished,
    // cancel the rest of the envelope and continue from
    // current value
    this.output.gain.cancelAndHoldAtTime(time);
    const { release } = this.envelope;
    console.log("buffer stop", time + release);
    this.output.gain.setTargetAtTime(0, time, release / 5);
    this.source.stop(time + release);
  }
}
