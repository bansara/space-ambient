export function createRoundedSquare(): [number[], number[]] {
  // Define the Fourier series coefficients for a "rounded" square wave
  // Real (cosine) and Imaginary (sine) parts. Start with arrays filled with 0 for DC offset and fundamental frequency
  let real = [0, 0];
  let imag = [0, 1]; // Fundamental frequency

  // Number of harmonics; more harmonics = smoother edges but more computation
  const numberOfHarmonics = 10;

  // Calculate coefficients for harmonics
  for (let i = 1; i <= numberOfHarmonics; i++) {
    const harmonicIndex = 2 * i + 1; // Use odd harmonics only
    const amplitude = 1 / (harmonicIndex * harmonicIndex); // Decrease amplitude more quickly for roundness
    real.push(0); // Cosine terms are zero for square waves
    imag.push(amplitude); // Sine terms define the shape
  }
  return [real, imag];
}
