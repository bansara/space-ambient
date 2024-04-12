import { Ambient } from "../Ambient";
import { EventEmitter } from "../eventEmitter/EventEmitter";
import { StepSequencerPreset } from "../stepSequencer/StepSequencerPreset";

/**
 * Handles user interface events
 * This is the bridge between Ambient and React
 */
export class UI extends EventEmitter {
  ambient: Ambient;
  constructor(ambient: Ambient) {
    super();
    this.ambient = ambient;
  }
  presetChange(preset: StepSequencerPreset) {
    this.emit("presetChange", preset);
  }
  playCurrentSequence(): void {
    this.ambient.currentSequence?.play();
    this.emit("playCurrentSequence");
  }
  stopCurrentSequence(): void {
    this.ambient.currentSequence?.stop();
    this.emit("stopCurrentSequence");
  }
  playNature(): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.playNature();
    this.emit("naturePlay");
  }
  stopNature(): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.stopNature();
    this.emit("natureStop");
  }
  setRangeVolume(volume: number): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.setOutputGain(volume);
    this.emit("rangeVolumeChange", volume);
  }
  setNatureVolume(volume: number): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.nature?.setOutputGain(volume);
    this.emit("natureVolumeChange", volume);
  }
  playBinaural(): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.playBinaural();
    this.emit("binauralPlay");
  }
  stopBinaural(): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.stopBinaural();
    this.emit("binauralStop");
  }
  setBinauralFrequency(frequency: number): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.setBinauralFrequency(frequency);
    this.emit("binauralFrequency", frequency);
  }

  loadBreathSequence(): void {
    this.emit("loadBreathSequence");
  }

  playBreathSequence(): void {
    this.ambient.breathSequence?.play();
    this.emit("playBreathSequence");
  }

  stopBreathSequence(): void {
    this.ambient.breathSequence?.stop();
    this.ambient.breathSequence?.initTimer(0);
    this.emit("stopBreathSequence");
    this.emit("exhale");
  }

  updateTimer(time: number): void {
    this.emit("updateTimer", time);
  }
  playMetronome(): void {
    this.emit("metronomeOn");
  }
  stopMetronome(): void {
    this.emit("metronomeOff");
  }
  inhale(): void {
    this.emit("inhale");
  }
  inhaleHold(): void {
    this.emit("inhaleHold");
  }
  exhale(): void {
    this.emit("exhale");
  }
  exhaleHold(): void {
    this.emit("exhaleHold");
  }
}
