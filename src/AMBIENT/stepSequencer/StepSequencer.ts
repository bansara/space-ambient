import { Ambient } from "../Ambient";
import { FREQUENCIES, notes } from "../sampler";
import { OneShot } from "../sampler/OneShot/OneShot";
import { PadLooper } from "../sampler/Pad/PadLooper";
import {
  StepSequencerPadLooperPresets,
  StepSequencerPadLoopers,
} from "../sampler/Pad/PadLooperPreset";
import { Transposer } from "../sampler/Transposer/Transposer";
import { TransposerPreset } from "../sampler/Transposer/TransposerPreset";
import { sampleURLs } from "../samples/sampleURLs";
import { Binaural } from "../synths/binaural/Binaural";
import { StepSequencerPreset } from "./StepSequencerPreset";

export class StepSequencer {
  id: string;
  ambient: Ambient;
  context: AudioContext;
  isPlaying: boolean = false;
  tempo: number = 120;
  currentNote: number = 0; // index in step sequencer
  nextNoteTime: number = 0; // exact time of next step in sequencer
  scheduleAheadTime: number = 0.1; // time in seconds to scan for upcoming nextNoteTime
  lookAhead: number = 25; // timeout length in ms for scheduler function
  timerId?: NodeJS.Timeout;
  sequenceLength: number = 16;
  currentPreset: StepSequencerPreset | undefined;
  transposers: { [key: string]: Transposer } = {}; // general pitched samples
  padLoopers: StepSequencerPadLoopers = {}; // pads, atmospheres, isochronic tones
  oneShot: OneShot | undefined;
  binaural: Binaural; // binaural beats
  binauralIsPlaying: boolean = false;
  natureIsPlaying: boolean = false;
  nature: PadLooper | undefined;
  output: GainNode;
  outputEq: BiquadFilterNode;

  constructor(ambient: Ambient, id: string) {
    this.ambient = ambient;
    this.context = ambient.context;
    this.id = id;
    this.outputEq = this.context.createBiquadFilter();
    this.outputEq.type = "lowpass";
    this.outputEq.frequency.value = 2237;
    this.output = this.context.createGain();
    this.output.connect(this.outputEq);
    this.outputEq.connect(ambient.masterVol);
    this.binaural = new Binaural(this.context, FREQUENCIES[notes.C2], 8);
  }

  play(): void {
    console.log(this.padLoopers);
    if (this.ambient.context.state !== "running") {
      this.ambient.context.resume();
    }
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.currentNote = 0;
      this.nextNoteTime = this.context.currentTime + this.scheduleAheadTime;
      this.scheduler();
    }
  }

  scheduler(): void {
    if (!this.isPlaying) return;
    while (
      this.nextNoteTime <
      this.context.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentNote);
      this.nextNote();
    }
    this.timerId = setTimeout(() => this.scheduler(), this.lookAhead);
  }

  nextNote(): void {
    const secondsPerBeat: number = 60 / this.tempo;

    if (this.currentNote % 2 === 0) {
      this.nextNoteTime += secondsPerBeat;
    } else {
      this.nextNoteTime += secondsPerBeat;
    }
    this.currentNote++;
    if (this.currentNote === this.sequenceLength) {
      this.currentNote = 0;
    }
  }

  scheduleNote(beatNumber: number): void {
    for (const padLooper in this.padLoopers) {
      this.padLoopers[padLooper].playback(beatNumber);
    }
    for (const transposer in this.transposers) {
      this.transposers[transposer].playback(beatNumber);
    }
    if (this.binauralIsPlaying) {
      this.binaural.playback();
    }
    if (this.natureIsPlaying) {
      this.nature?.playback(beatNumber);
    }
    if (this.oneShot) {
      this.oneShot.playback(beatNumber);
    }
  }

  stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      clearTimeout(this.timerId!);
      for (const padLooper in this.padLoopers) {
        console.log("stopping", padLooper);
        this.padLoopers[padLooper].stopSample(this.context.currentTime);
      }
      this.binaural.stop();
      this.nature?.stopSample(this.context.currentTime);
      this.oneShot?.stopSamples();
    }
  }

  loadPreset(preset: StepSequencerPreset): void {
    this.tempo = preset.tempo;
    this.sequenceLength = preset.sequenceLength;
    this.currentPreset = preset;
    if (preset.padLoopers) {
      this.loadPadLooperPresets(preset.padLoopers);
    }
    if (preset.transposers) {
      this.loadTransposerPresets(preset.transposers);
    }
    this.nature = new PadLooper(this.ambient, preset.nature.path, this);
    this.nature.output.gain.value = 0.3;
    if (preset.oneShots) {
      this.addOneShot(preset.oneShots);
    }
  }

  loadPadLooperPresets(padLoopers: StepSequencerPadLooperPresets): void {
    for (const padLooper in padLoopers) {
      const looper = padLoopers[padLooper];
      this.addPadLooper(padLooper, looper.path)
        .setLfoGain(looper.lfoGain)
        .setLfoFilter(looper.lfoFilter)
        .setEnvelope(looper.envelope);
    }
  }

  loadTransposerPresets(transposers: TransposerPreset[]): void {
    for (const transposer of transposers) {
      this.addTransposer(transposer);
    }
  }

  addPadLooper(id: string, path: URL): PadLooper {
    this.padLoopers[id] = new PadLooper(this.ambient, path, this);
    return this.padLoopers[id];
  }

  addTransposer(preset: TransposerPreset): Transposer {
    let { id } = preset;
    while (id in this.transposers) {
      id = id + `-${Math.random().toString(16).slice(2, 6)}`;
    }
    this.transposers[id] = new Transposer(this.ambient, this, preset);
    return this.transposers[id];
  }
  // addWaveform(id: string, path: URL): Waveform {
  //   this.waveforms[id] = new Waveform(this.ambient, path);
  //   return this.waveforms[id];
  // }
  playBinaural(): void {
    this.binauralIsPlaying = true;
  }
  stopBinaural(): void {
    this.binauralIsPlaying = false;
    this.binaural.stop();
  }
  setBinauralFrequency(binauralFrequency: number): void {
    this.binaural.setBinauralFrequency(binauralFrequency);
  }
  playNature(): void {
    this.natureIsPlaying = true;
  }
  stopNature(): void {
    this.natureIsPlaying = false;
    this.nature?.stopSample(this.context.currentTime);
  }

  addOneShot(filePaths: URL[]): void {
    this.oneShot = new OneShot(this.ambient, filePaths, this);
  }

  setOutputGain(gain: number): void {
    this.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.output.gain.linearRampToValueAtTime(
      gain,
      this.context.currentTime + 0.2
    );
  }
}
