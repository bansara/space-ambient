export class Reverb {
  context: AudioContext;
  input: GainNode;
  output: GainNode;
  eq: BiquadFilterNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.input = this.context.createGain();
    this.eq = this.context.createBiquadFilter();
    this.eq.type = "highpass";
    this.eq.frequency.value = 300;
    this.eq.Q.value = 0.1;
    this.output = this.context.createGain();
    this.output.gain.value = 1;
    this.eq.connect(this.output);
    this.createReverb();
  }

  createReverb = async () => {
    // Create a convolution reverb node
    const convolver = this.context.createConvolver();

    // Load impulse response from file
    const path = new URL("impulse-bh.wav", import.meta.url);
    const response = await fetch(path);
    const arraybuffer = await response.arrayBuffer();

    // Function to decode audio data with fallback for older implementations
    function decodeAudioData(
      audioContext: AudioContext,
      arrayBuffer: ArrayBuffer
    ): Promise<AudioBuffer> {
      return new Promise((resolve, reject) => {
        if (audioContext.decodeAudioData.length === 1) {
          // Newer promise-based API
          audioContext.decodeAudioData(arrayBuffer).then(resolve).catch(reject);
        } else {
          // Older callback-based API
          audioContext.decodeAudioData(arrayBuffer, resolve, reject);
        }
      });
    }
    try {
      // Use the function to set the convolver buffer
      convolver.buffer = await decodeAudioData(this.context, arraybuffer);
    } catch (error) {
      console.error("Error decoding audio data:", error);
    }

    // convolver.buffer = await this.context.decodeAudioData(arraybuffer);
    this.input.connect(convolver);
    // Connect the convolution reverb to the delay network
    convolver.connect(this.eq);
  };
}
