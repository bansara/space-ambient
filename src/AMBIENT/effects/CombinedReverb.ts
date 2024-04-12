export class CombinedReverb {
  context: AudioContext;
  input: GainNode;
  output: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.input = this.context.createGain();
    this.output = this.context.createGain();
    this.output.gain.value = 0.2;
    // this.output.connect(this.context.destination);

    this.createReverb();
  }

  createReverb = async () => {
    // const numDelays = 3; // Number of delay nodes
    // const maxDelayTime = 0.5; // Maximum delay time in seconds
    // const feedbackAmount = 0.25; // Adjust feedback level

    // const delayNodes = [];
    // let feedbackNode = this.context.createGain();
    // feedbackNode.gain.value = feedbackAmount;

    // for (let i = 0; i < numDelays; i++) {
    //   const delayNode = this.context.createDelay();
    //   const eq = this.context.createBiquadFilter();
    //   eq.type = "lowpass";
    //   eq.frequency.value = 1000;
    //   this.input.connect(delayNode);
    //   delayNode.delayTime.setValueAtTime(
    //     (i + Math.random()) * (maxDelayTime / numDelays),
    //     0
    //   );

    //   delayNode.connect(eq);
    //   eq.connect(feedbackNode);
    //   feedbackNode.connect(delayNode);

    //   delayNodes.push(delayNode);
    // }

    // Create a convolution reverb node
    const convolver = this.context.createConvolver();

    // Load impulse response from file
    const path = new URL("supermassive_ir.wav", import.meta.url);
    const response = await fetch(path);
    const arraybuffer = await response.arrayBuffer();

    convolver.buffer = await this.context.decodeAudioData(arraybuffer);
    this.input.connect(convolver);
    // Connect the convolution reverb to the delay network
    convolver.connect(this.output);

    // Connect the audio input to the delay network
    // this.input.connect(delayNodes[0]);

    // Connect the output of the delay network to the output of the reverb
    // feedbackNode.connect(this.output);
  };
}
