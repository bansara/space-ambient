import { Ambient } from "../Ambient";
import { notes } from "../notes/notes";
import { Transposer } from "../sampler/Transposer/Transposer";
import {
  TransposerPreset,
  transposerPresets,
} from "../sampler/Transposer/TransposerPreset";
import { BreathSequencerPreset } from "./BreathSequencerPreset";

export interface BreathPattern {
  tempo: number;
  inhale: number;
  inhaleHold: number;
  exhale: number;
  exhaleHold: number;
}

export class BreathSequencer {
  ambient: Ambient;
  context: AudioContext;
  isPlaying: boolean = false;
  tempo: number = 120;
  currentNote: number = 0; // index in step sequencer
  nextNoteTime: number = 0; // exact time of next step in sequencer
  scheduleAheadTime: number = 0.1; // time in seconds to scan for upcoming nextNoteTime
  lookAhead: number = 25; // timeout length in ms for scheduler function
  sequenceTimerId?: NodeJS.Timeout;
  uiTimerId?: NodeJS.Timeout;
  sequenceLength: number = 16;
  currentPreset: BreathSequencerPreset | undefined;
  transposers: { [key: string]: Transposer } = {}; // general pitched samples
  output: GainNode;
  breathPattern: BreathPattern = {
    inhale: 4,
    inhaleHold: 0,
    exhale: 4,
    exhaleHold: 0,
    tempo: 45,
  };
  availableTimes: number[] = [5, 10, 15, 20, 30, 45, 60];
  startTime: number = 0;
  totalTime: number = this.availableTimes[0] * 60; // in seconds
  remainingTime: number = this.availableTimes[0] * 60; // in seconds
  metronome: Transposer;
  metronomeIsPlaying: boolean = false;
  inhaleIndex: number = 0;
  inhaleHoldIndex: number = 0;
  exhaleIndex: number = 0;
  exhaleHoldIndex: number = 0;

  constructor(ambient: Ambient) {
    this.ambient = ambient;
    this.context = ambient.context;
    this.output = this.context.createGain();
    this.output.connect(ambient.masterVol);
    this.metronome = new Transposer(ambient, this, transposerPresets.metronome);
    this.metronome.output.gain.value = 0.5;
  }

  play(): void {
    if (this.ambient.context.state !== "running") {
      this.ambient.context.resume();
    }
    if (!this.isPlaying) {
      this.startTime = this.context.currentTime;
      this.isPlaying = true;
      this.currentNote = 0;
      this.nextNoteTime = this.context.currentTime + this.scheduleAheadTime;
      this.scheduler();
    }

    this.uiTimerId = setInterval(() => {
      this.remainingTime =
        this.totalTime - (this.context.currentTime - this.startTime);
      this.ambient.ui.emit("updateTimer", this.remainingTime);
      if (this.remainingTime <= 0) {
        this.stop();
      }
    }, 100);
  }

  scheduler(): void {
    if (!this.isPlaying) return;
    if (this.remainingTime <= 0) {
      this.stop();
      return;
    }
    while (
      this.nextNoteTime <
      this.context.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentNote);
      this.nextNote();
    }
    this.sequenceTimerId = setTimeout(() => this.scheduler(), this.lookAhead);
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
    for (const transposer in this.transposers) {
      this.transposers[transposer].playback(beatNumber);
    }
    if (this.metronomeIsPlaying) {
      this.metronome.playback(beatNumber);
    }
    if (beatNumber === 0) {
      this.ambient.ui.inhale();
    } else if (
      !!this.breathPattern.inhaleHold &&
      beatNumber === this.inhaleHoldIndex
    ) {
      this.ambient.ui.emit("inhaleHold");
    } else if (beatNumber === this.exhaleIndex) {
      this.ambient.ui.emit("exhale");
    } else if (
      !!this.breathPattern.exhaleHold &&
      beatNumber === this.exhaleHoldIndex
    ) {
      this.ambient.ui.emit("exhaleHold");
    }
  }

  stop(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      clearTimeout(this.sequenceTimerId!);
      clearInterval(this.uiTimerId!);
      this.ambient.ui.stopBreathSequence();
    }
  }

  calculateBreathLength(breathPattern: BreathPattern): number {
    return (
      breathPattern.inhale +
      breathPattern.inhaleHold +
      breathPattern.exhale +
      breathPattern.exhaleHold
    );
  }

  setSequenceLength(breathPattern: BreathPattern): void {
    this.sequenceLength = this.calculateBreathLength(breathPattern);
  }

  addTransposer(preset: TransposerPreset): Transposer {
    let { id } = preset;
    while (id in this.transposers) {
      id = id + `-${Math.random().toString(16).slice(2, 6)}`;
    }
    this.transposers[id] = new Transposer(this.ambient, this, preset);
    this.transposers[id].output.gain.value = 0.75;
    return this.transposers[id];
  }

  loadBreathPreset(preset: BreathSequencerPreset) {
    this.currentPreset = preset;
    this.setSequenceLength(preset.breathPattern);
    this.breathPattern = preset.breathPattern;
    this.tempo = preset.breathPattern.tempo;
    const pattern = this.createBreathTransposerPattern(preset);
    this.metronome.pattern = this.createMetronomePattern(pattern);
    this.setBreathIndicies();
    this.addTransposer({ ...preset.breatheTransposer, pattern });
    if (preset.holdTransposer) {
      const holdPattern = this.createHoldTransposerPattern(preset);
      this.addTransposer({ ...preset.holdTransposer, pattern: holdPattern });
      this.transposers[preset.holdTransposer.id].output.gain.value = 0.1;
    }
    this.ambient.ui.emit("loadBreathSequence", preset);
    this.ambient.ui.emit("metronomeOff");
    this.ambient.ui.emit("updateTimer", this.totalTime);
  }

  setBreathIndicies(): void {
    const { inhale, inhaleHold, exhale } = this.breathPattern;
    this.inhaleIndex = 0;
    this.inhaleHoldIndex = inhale;
    this.exhaleIndex = inhale + inhaleHold;
    this.exhaleHoldIndex = inhale + inhaleHold + exhale;
  }

  createBreathTransposerPattern(
    preset: BreathSequencerPreset
  ): (notes | null)[] {
    const pattern: (notes | null)[] = [];
    const { breathPattern } = preset;
    const { inhale, inhaleHold, exhale, exhaleHold } = breathPattern;
    const breathLength = this.calculateBreathLength(breathPattern);
    for (let i = 0; i < breathLength; i++) {
      if (i === 0) {
        pattern.push(notes.C3);
      } else if (i < inhale + inhaleHold) {
        pattern.push(null);
      } else if (i === inhale + inhaleHold) {
        pattern.push(notes.G3);
      } else {
        pattern.push(null);
      }
    }
    return pattern;
  }

  createHoldTransposerPattern(preset: BreathSequencerPreset): (notes | null)[] {
    if (!preset.holdTransposer) return [];
    const pattern: (notes | null)[] = [];
    const { breathPattern } = preset;
    const { inhale, inhaleHold, exhale, exhaleHold } = breathPattern;
    const breathLength = this.calculateBreathLength(breathPattern);
    for (let i = 0; i < breathLength; i++) {
      if (i === inhale) {
        pattern.push(notes.C3);
      } else if (i < inhale + inhaleHold) {
        pattern.push(null);
      } else if (i === inhale + inhaleHold + exhale) {
        pattern.push(notes.G3);
      } else {
        pattern.push(null);
      }
    }
    return pattern;
  }

  createMetronomePattern(pattern: (notes | null)[]): (notes | null)[] {
    const metronomePattern: (notes | null)[] = [];
    for (let i = 0; i < pattern.length; i++) {
      metronomePattern.push(notes.C3);
    }
    return metronomePattern;
  }

  initTimer(time: number): void {
    this.totalTime = time;
    this.remainingTime = time;
    this.ambient.ui.emit("updateTimer", time);
  }

  toggleMetronome(): void {
    this.metronomeIsPlaying = !this.metronomeIsPlaying;
    this.ambient.ui.emit(
      this.metronomeIsPlaying ? "metronomeOn" : "metronomeOff"
    );
  }
}
