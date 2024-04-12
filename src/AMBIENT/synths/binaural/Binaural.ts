export interface BinauralPreset {
  baseFrequency: number;
  binauralFrequency: number;
}

export class Binaural {
  context: AudioContext;
  osc1: OscillatorNode;
  gain1: GainNode;
  panner1: PannerNode;
  osc2: OscillatorNode;
  gain2: GainNode;
  panner2: PannerNode;
  isPlaying: boolean = false;
  baseFrequency: number;
  binauralFreq: number;
  binauralGain: number = 0.05;
  constructor(
    context: AudioContext,
    baseFrequency: number,
    binauralFreq: number
  ) {
    this.baseFrequency = baseFrequency;
    this.binauralFreq = binauralFreq;
    this.context = context;
    this.osc1 = context.createOscillator();
    this.gain1 = context.createGain();
    this.gain1.gain.value = 0;
    this.panner1 = context.createPanner();
    this.panner1.panningModel = "HRTF";
    this.panner1.positionX.setValueAtTime(-1, this.context.currentTime); // Move the sound to the left
    this.panner1.positionY.setValueAtTime(0, this.context.currentTime);
    this.panner1.positionZ.setValueAtTime(0, this.context.currentTime);
    this.osc1.connect(this.gain1);
    this.gain1.connect(this.panner1);
    this.panner1.connect(context.destination);
    this.osc1.frequency.setValueAtTime(
      baseFrequency - binauralFreq / 2,
      this.context.currentTime
    );
    this.osc1.start();

    this.osc2 = context.createOscillator();
    this.gain2 = context.createGain();
    this.gain2.gain.value = 0;
    this.panner2 = context.createPanner();
    this.panner2.panningModel = "HRTF";
    this.panner2.positionX.setValueAtTime(1, this.context.currentTime); // Move the sound to the right
    this.panner2.positionY.setValueAtTime(0, this.context.currentTime);
    this.panner2.positionZ.setValueAtTime(0, this.context.currentTime);
    this.osc2.connect(this.gain2);
    this.gain2.connect(this.panner2);
    this.panner2.connect(context.destination);
    this.osc2.frequency.setValueAtTime(
      baseFrequency + binauralFreq / 2,
      this.context.currentTime
    );
    this.osc2.start();
  }
  playback() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.setBinauralGain(0.025);
  }
  stop() {
    this.isPlaying = false;
    this.setBinauralGain(0);
  }
  setBinauralFrequency(frequency: number) {
    this.binauralFreq = frequency;
    this.osc1.frequency.linearRampToValueAtTime(
      this.baseFrequency - frequency / 2,
      this.context.currentTime + 0.01
    );
    this.osc2.frequency.linearRampToValueAtTime(
      this.baseFrequency + frequency / 2,
      this.context.currentTime + 0.01
    );
  }

  setBinauralGain(gain: number) {
    this.binauralGain = gain;
    this.gain1.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.gain2.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.gain1.gain.setTargetAtTime(
      this.binauralGain,
      this.context.currentTime + 0.5,
      0.5
    );
    this.gain2.gain.setTargetAtTime(
      this.binauralGain,
      this.context.currentTime + 0.5,
      0.5
    );
  }
}
