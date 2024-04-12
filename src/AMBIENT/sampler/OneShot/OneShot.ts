import { Ambient } from "../../Ambient";
import { BreathSequencer } from "../../breathSequencer/BreathSequencer";
import { StepSequencer } from "../../stepSequencer/StepSequencer";

export interface OneShotSample {
  source: AudioBufferSourceNode | null;
  buffer: AudioBuffer | null;
  length: number;
  isLoaded: boolean;
  isPlaying: boolean;
}

export class OneShot {
  ambient: Ambient;
  context: AudioContext;
  sequencer: StepSequencer | BreathSequencer;
  filePaths: URL[] = [];
  sample1!: OneShotSample;
  sample2!: OneShotSample;
  playNextIndex = 1;
  filePathIndex = 0;
  gain: GainNode;

  get isSamplePlaying() {
    return this.sample1?.isPlaying || this.sample2?.isPlaying;
  }

  constructor(
    ambient: Ambient,
    filePaths: URL[],
    sequencer: StepSequencer | BreathSequencer
  ) {
    this.ambient = ambient;
    this.context = ambient.context;
    this.filePaths = filePaths;
    this.sequencer = sequencer;
    this.gain = this.context.createGain();
    this.gain.connect(this.sequencer.output);

    if (this.filePaths.length < 2) {
      throw new Error("OneShot requires at least two sample files");
    }
    this.loadSample(this.filePaths[this.filePathIndex]).then(
      this.assignToSampleBuffer
    );
  }
  async loadSample(path: URL): Promise<OneShotSample> {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    return {
      source: null,
      buffer: audioBuffer,
      length: audioBuffer.duration,
      isLoaded: true,
      isPlaying: false,
    };
  }

  playback(beatNumber: number): void {
    if (!this.isSamplePlaying && beatNumber === 0) {
      const bufferToPlay =
        this.playNextIndex === 1 ? this.sample1 : this.sample2;
      if (bufferToPlay.isLoaded) {
        this.playSample(this.sequencer.nextNoteTime, bufferToPlay);
      }
      this.loadSample(this.filePaths[this.filePathIndex]).then(
        this.assignToSampleBuffer
      );
    }
  }

  playSample(time: number, sample: OneShotSample) {
    let { source } = sample;
    sample.isPlaying = true;
    source = this.context.createBufferSource();
    source.buffer = sample.buffer;
    source.connect(this.gain);
    source.start(time);

    setTimeout(() => {
      sample.isPlaying = false;
      sample.isLoaded = false;
    }, sample.length * 1000 + 100);
  }

  stopSamples() {
    if (this.sample1.isPlaying) {
      this.sample1.source?.stop();
      this.sample1.isPlaying = false;
    }
    if (this.sample2.isPlaying) {
      this.sample2.source?.stop();
      this.sample2.isPlaying = false;
    }
  }

  incrementFilePathIndex() {
    this.filePathIndex = (this.filePathIndex + 1) % this.filePaths.length;
  }

  assignToSampleBuffer = (sample: OneShotSample) => {
    this.playNextIndex = this.playNextIndex === 1 ? 2 : 1;
    this.playNextIndex === 1
      ? (this.sample1 = sample)
      : (this.sample2 = sample);
    this.incrementFilePathIndex();
  };
}
