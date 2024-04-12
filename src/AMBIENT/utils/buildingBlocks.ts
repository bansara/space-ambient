export function createOscillator(
  context: AudioContext,
  type: OscillatorType = "sine",
  frequency?: number
): OscillatorNode {
  const osc = context.createOscillator();
  osc.type = type;
  if (frequency) {
    osc.frequency.value = frequency;
  }
  osc.start(context.currentTime + 0.01);
  return osc;
}

export function createGain(context: AudioContext, level: number = 1): GainNode {
  const gain = context.createGain();
  gain.gain.value = level;
  return gain;
}

export interface IO {
  input: GainNode;
  output: GainNode;
}

export function createIO(
  context: AudioContext,
  inputGain: number = 1,
  outputGain: number = 1
): IO {
  const input = createGain(context);
  const output = createGain(context);
  input.gain.value = inputGain;
  output.gain.value = outputGain;
  return {
    input,
    output,
  };
}

export function createEQ(
  context: AudioContext,
  options?: BiquadFilterOptions
): BiquadFilterNode {
  const eq = context.createBiquadFilter();
  eq.Q.value = options?.Q ?? 1;
  eq.detune.value = options?.detune ?? 0;
  eq.frequency.value = options?.frequency ?? 1000;
  eq.type = options?.type || "peaking";
  eq.gain.value = options?.gain ?? 1;

  return eq;
}
