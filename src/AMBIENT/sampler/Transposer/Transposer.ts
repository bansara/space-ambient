import { notes } from "../../notes/notes";
import { BufferLoopOptions } from "../BufferLoopOptions";
import { Sampler } from "../Base Classes/Sampler";
import { TransposeBuffer } from "./TransposeBuffer";
import { Ambient } from "../../Ambient";
import { TransposerPreset } from "./TransposerPreset";
import { StepSequencer } from "../../stepSequencer/StepSequencer";

export class Transposer extends Sampler {
  isTransposer = true;
  noteSet = new Set<notes>();
  noteProbability = 1 / 32;
  probabilityDenominator = 32;
  noteDuration = 16;
  currentNote: notes;
  shouldUseRandomPattern = true;
  envelope = {
    attack: 4,
    decay: 0,
    sustain: 1,
    release: 8,
  };
  loopOptions: BufferLoopOptions = {
    transpose: true,
  };
  pattern: (notes | null)[] = [];

  constructor(
    ambient: Ambient,
    sequencer: StepSequencer,
    preset: TransposerPreset
  ) {
    super(ambient, preset.path, sequencer);
    this.currentNote = preset.sampleBase;
    this.loadPreset(preset);

    this.output.gain.setValueAtTime(0, this.context.currentTime);
  }

  playback(beatNumber: number): void {
    if (beatNumber === 0 && this.shouldUseRandomPattern) {
      this.createRandomPattern();
    }
    const note = this.pattern[beatNumber];
    if (note) {
      this.playSample(this.sequencer.nextNoteTime, note, this.noteDuration);
    }
  }

  playSample(time: number, note: notes, duration: number): void {
    const player = new TransposeBuffer(this);
    player.output.connect(this.lfoEq);
    player.playSample(time, this.loopOptions, note);
    this.stopSample(time + duration, note, player);
  }
  stopSample(time: number, note: notes, player: TransposeBuffer) {
    player.stopSample(time);
  }
  addNoteToSet(note: notes) {
    this.noteSet.add(note);
  }
  addNotesToSet(notes?: notes[]) {
    if (!notes) return this;
    notes.forEach((note) => this.addNoteToSet(note));
    return this;
  }
  removeNoteFromSet(note: notes) {
    this.noteSet.delete(note);
  }
  clearNoteSet() {
    this.noteSet = new Set<notes>();
  }
  replaceNoteSet(notes: notes[]) {
    this.clearNoteSet();
    this.addNotesToSet(notes);
  }
  chooseRandomNoteFromNoteSet(): notes {
    // Convert the Set to an array to randomly access an element
    const noteArray = Array.from(this.noteSet);
    if (!noteArray.length) {
      throw new Error("Noteset is empty");
    }

    let newNote = this.currentNote;
    while (newNote === this.currentNote) {
      const randomIndex = Math.floor(Math.random() * noteArray.length);
      newNote = noteArray[randomIndex];
    }
    this.currentNote = newNote;
    return newNote;
  }
  createRandomPattern() {
    this.pattern = new Array(16)
      .fill(0)
      .map((beat) =>
        Math.random() < this.noteProbability
          ? this.chooseRandomNoteFromNoteSet()
          : null
      );
  }
  setNoteProbability(probability: number) {
    if (probability < 0 || probability > 1) {
      throw new Error("Probability must be between 0 and 1");
    }
    this.noteProbability = probability;
  }
  setNoteDuration(duration: number) {
    if (duration < 0) {
      throw new Error("Duration must be greater than 0");
    }
    this.noteDuration = duration;
  }
  loadPreset(options: TransposerPreset) {
    const {
      path,
      envelope,
      sampleBase,
      noteSet,
      pattern,
      probabilityDenominator,
      noteDuration,
      useRandomPattern,
    } = options;
    this.loadSample(path);
    this.setEnvelope(envelope);
    this.loopOptions.sampleBase = sampleBase;
    if (noteSet) {
      this.replaceNoteSet(noteSet);
    }
    if (pattern) {
      this.pattern = pattern;
    }
    if (probabilityDenominator) {
      this.probabilityDenominator = probabilityDenominator;
      this.setNoteProbability(1 / probabilityDenominator);
    }
    if (noteDuration) {
      this.setNoteDuration(noteDuration);
    }
    this.shouldUseRandomPattern = useRandomPattern ?? true;
  }
}
