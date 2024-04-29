import { Ambient } from "../../Ambient";
import { BreathSequencer } from "../../breathSequencer/BreathSequencer";
import { StepSequencer } from "../../stepSequencer/StepSequencer";
import { SamplerUtils } from "../Base Classes/SamplerUtils";
import { OneShotPreset } from "./OneShotPresets";

export interface OneShotSample {
  source: AudioBufferSourceNode | null;
  buffer: AudioBuffer | null;
  length: number;
  isLoaded: boolean;
  isPlaying: boolean;
  numberOfLoopsPlayed: number;
}

export class OneShot {
  ambient: Ambient;
  context: AudioContext;
  sequencer: StepSequencer;
  preset: OneShotPreset;
  sample1!: OneShotSample;
  sample2!: OneShotSample;
  playNextIndex = 1;
  sampleURLIndex = 0;
  output: GainNode;
  reverbSend: GainNode;

  get isSamplePlaying() {
    return this.sample1?.isPlaying || this.sample2?.isPlaying;
  }

  constructor(
    ambient: Ambient,
    preset: OneShotPreset,
    sequencer: StepSequencer
  ) {
    this.ambient = ambient;
    this.context = ambient.context;
    this.preset = preset;
    this.sequencer = sequencer;
    this.output = this.context.createGain();
    this.output.connect(this.sequencer.output);
    this.reverbSend = this.context.createGain();
    this.output.connect(this.reverbSend);
    this.reverbSend.connect(sequencer.reverbSend);

    if (this.preset.sampleURLs.length < 2) {
      throw new Error("OneShot requires at least two sample files");
    }
    this.loadSample(this.preset.sampleURLs[this.sampleURLIndex]).then(
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
      numberOfLoopsPlayed: 0,
    };
  }

  playback(beatNumber: number): void {
    if (!this.isSamplePlaying && beatNumber === 0) {
      const bufferToPlay =
        this.playNextIndex === 1 ? this.sample1 : this.sample2;
      if (
        bufferToPlay.isLoaded &&
        bufferToPlay.numberOfLoopsPlayed < this.preset.numberOfLoops
      ) {
        this.playSample(this.sequencer.nextNoteTime, bufferToPlay);
        bufferToPlay.numberOfLoopsPlayed++;
      }
      if (this.sample1.numberOfLoopsPlayed === this.preset.numberOfLoops) {
        this.chooseNextFilePathIndex();
        this.loadSample(this.preset.sampleURLs[this.sampleURLIndex]).then(
          this.assignToSampleBuffer
        );
      }
    }
  }

  playSample(time: number, sample: OneShotSample) {
    let { source } = sample;
    sample.isPlaying = true;
    source = this.context.createBufferSource();
    source.buffer = sample.buffer;
    source.connect(this.output);
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

  chooseNextFilePathIndex() {
    this.sampleURLIndex = SamplerUtils.elementOfChance(this.preset.probability)
      ? this.sampleURLIndex
      : SamplerUtils.chooseOtherIndex(
          this.sampleURLIndex,
          this.preset.sampleURLs.length
        );
  }

  assignToSampleBuffer = (sample: OneShotSample) => {
    this.playNextIndex = this.playNextIndex === 1 ? 2 : 1;
    this.playNextIndex === 1
      ? (this.sample1 = sample)
      : (this.sample2 = sample);
  };

  setReverbSendGain(gain: number) {
    this.reverbSend.gain.value = gain;
    return this;
  }
}
