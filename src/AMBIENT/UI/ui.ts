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
    console.log("presetChange");
    this.emit("presetChange", preset);
  }
  playCurrentSequence(): void {
    console.log("playCurrentSequence");
    this.ambient.currentSequence?.play();
    this.emit("playCurrentSequence");
  }
  stopCurrentSequence(): void {
    this.ambient.currentSequence?.stop();
    this.emit("stopCurrentSequence");
  }
  setRangeVolume(volume: number): void {
    if (!this.ambient.currentSequence) return;
    this.ambient.currentSequence.setOutputGain(volume);
    this.emit("rangeVolumeChange", volume);
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
}
