import { Ambient } from "../../Ambient";
import { StepSequencer } from "../../stepSequencer/StepSequencer";
import { SamplerUtils } from "../Base Classes/SamplerUtils";
import { OneShotPreset, OneShotURL } from "./OneShotPresets";

export interface OneShotSample {
  source: AudioBufferSourceNode | null;
  buffer: AudioBuffer | null;
  length: number;
  isLoaded: boolean;
  isPlaying: boolean;
  fadeOutTime: number;
}

export class OneShot {
  ambient: Ambient;
  context: AudioContext;
  sequencer: StepSequencer;
  preset: OneShotPreset;
  sample1!: OneShotSample;
  sample2!: OneShotSample;
  sample1Gain: GainNode;
  sample2Gain: GainNode;
  playNextIndex = 1;
  sampleURLIndex = 0;
  output: GainNode;
  reverbSend: GainNode;
  currentSampleStartTime: number = 0;
  currentSampleLength: number = 0;
  currentSampleFadeOutTime: number = 0;
  timeoutId: NodeJS.Timeout | undefined = undefined;

  get isSamplePlaying() {
    return this.sample1?.isPlaying || this.sample2?.isPlaying;
  }

  get shouldPlayNextSample() {
    return (
      this.sequencer.nextNoteTime >=
      this.currentSampleStartTime +
        this.currentSampleLength -
        this.currentSampleFadeOutTime
    );
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
    this.sample1Gain = this.context.createGain();
    this.sample2Gain = this.context.createGain();
    this.output = this.context.createGain();
    this.sample1Gain.connect(this.output);
    this.sample2Gain.connect(this.output);
    this.output.connect(this.sequencer.output);
    this.reverbSend = this.context.createGain();
    this.reverbSend.gain.value = preset.reverbSendGain;
    this.output.connect(this.reverbSend);
    this.output.connect(this.sequencer.output);
    this.reverbSend.connect(sequencer.reverbSend);

    if (this.preset.sampleURLs.length < 2) {
      throw new Error("OneShot requires at least two sample files");
    }
    this.loadSample(this.preset.sampleURLs[this.sampleURLIndex]).then(
      this.assignToSampleBuffer
    );
  }
  async loadSample(sample: OneShotURL): Promise<OneShotSample> {
    const response = await fetch(sample.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    return {
      source: null,
      buffer: audioBuffer,
      length: audioBuffer.duration,
      isLoaded: true,
      isPlaying: false,
      fadeOutTime: sample.fadeOutTime,
    };
  }

  playback(beatNumber: number): void {
    if (this.shouldPlayNextSample) {
      const bufferToPlay =
        this.playNextIndex === 1 ? this.sample1 : this.sample2;
      if (bufferToPlay.isLoaded) {
        this.playSample(
          this.sequencer.nextNoteTime,
          bufferToPlay,
          this.playNextIndex
        );
        this.loadSample(this.chooseNextFile()).then(this.assignToSampleBuffer);
      }
    }
  }

  playSample(time: number, sample: OneShotSample, playNextIndex: number) {
    sample.isPlaying = true;
    sample.source = this.context.createBufferSource();
    sample.source.buffer = sample.buffer;
    const gain = playNextIndex === 2 ? this.sample1Gain : this.sample2Gain;
    gain.gain.cancelAndHoldAtTime(this.context.currentTime);
    gain.gain.setValueAtTime(1, this.context.currentTime);
    sample.source.connect(gain);
    sample.source.start(time);
    this.currentSampleStartTime = time;
    this.currentSampleLength = sample.length;
    this.currentSampleFadeOutTime = sample.fadeOutTime;
    if (sample.fadeOutTime > 0) {
      gain.gain.setTargetAtTime(
        0,
        time + sample.length - sample.fadeOutTime,
        sample.fadeOutTime / 5
      );
    }

    setTimeout(() => {
      sample.isPlaying = false;
      sample.isLoaded = false;
    }, sample.length * 1000 - sample.fadeOutTime * 1000);
  }

  stopSamples() {
    this.sample1.source?.stop();
    this.sample1.isPlaying = false;
    this.sample1.isLoaded = false;

    this.sample2.source?.stop();
    this.sample2.isPlaying = false;
    this.sample2.isLoaded = false;

    this.currentSampleStartTime = 0;
    this.currentSampleLength = 0;
    this.currentSampleFadeOutTime = 0;

    this.loadSample(this.preset.sampleURLs[this.sampleURLIndex]).then(
      this.assignToSampleBuffer
    );
  }

  chooseNextFile(): OneShotURL {
    this.preset.shouldChooseRandomSample
      ? this.chooseRandomSampleURLIndex()
      : this.incrementSampleURLIndex();
    return this.preset.sampleURLs[this.sampleURLIndex];
  }

  incrementSampleURLIndex() {
    this.sampleURLIndex = SamplerUtils.elementOfChance(
      this.preset.repeatProbability
    )
      ? this.sampleURLIndex
      : this.sampleURLIndex++;
    if (this.sampleURLIndex >= this.preset.sampleURLs.length) {
      this.sampleURLIndex = 0;
    }
  }

  chooseRandomSampleURLIndex() {
    this.sampleURLIndex = SamplerUtils.elementOfChance(
      this.preset.repeatProbability
    )
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
