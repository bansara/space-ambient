import { LFO, LfoOptions } from "../../effects/LFO";
import { LoopBuffer } from "./LoopBuffer";
import { Sampler } from "../Base Classes/Sampler";
import { ADSR } from "../../synths";
import { PadLooperPreset } from "./PadLooperPreset";
import { Ambient } from "../../Ambient";
import { StepSequencer } from "../../stepSequencer/StepSequencer";

export class PadLooper extends Sampler {
  lfoGain: LFO;
  lfoFilter: LFO;
  envelope: ADSR = {
    attack: 2,
    decay: 0,
    sustain: 1,
    release: 4,
  };
  loopOptions = {
    shouldLoop: true,
  };
  note: LoopBuffer | null = null;
  constructor(ambient: Ambient, path: URL, stepSequencer: StepSequencer) {
    super(ambient, path, stepSequencer);
    this.lfoGain = new LFO(this.context, this.output.gain, {
      type: "sine",
      frequency: 4,
      depth: 0,
    });
    this.lfoFilter = new LFO(this.context, this.lfoEq.frequency, {
      type: "sine",
      frequency: 0.1,
      depth: 0.5,
    });
    this.output.gain.value = 0.5;
  }

  playback(beatNumber: number): void {
    this.playSample(this.sequencer.nextNoteTime);
  }

  playSample(time: number, duration?: number | undefined): void {
    // Create a new BufferPlayer if it doesn't exist
    if (!this.note) {
      this.note = new LoopBuffer(this);
      this.note?.output.connect(this.lfoEq);
      this.note?.playSample(time, this.loopOptions);
    }
    if (duration) {
      this.stopSample(time + duration);
    }
  }

  stopSample(time: number): void {
    const player = this.note;
    if (player) {
      player.stopSample(time);
      setTimeout(() => {
        this.cleanup();
        console.log(this.context.currentTime);
      }, this.envelope.release * 1000);
    }
  }

  cleanup(): void {
    console.log("cleanup");
    this.note = null;
  }

  setLfoGain(options: LfoOptions) {
    this.lfoGain.setLfoGainOptions(options);
    return this;
  }

  setLfoFilter(options: LfoOptions) {
    this.lfoFilter.setLfoFilterOptions(options);
    return this;
  }

  changePreset(options: PadLooperPreset) {
    const { path, lfoGain, lfoFilter, envelope } = options;
    this.stopSample(this.context.currentTime);
    this.loadSample(path);
    this.setLfoGain(lfoGain);
    this.setLfoFilter(lfoFilter);
    this.setEnvelope(envelope);
  }
}
