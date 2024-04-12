/**
 * DELTA: 0.5 - 4Hz
 * THETA: 4 - 8Hz
 * ALPHA: 8 - 14Hz
 * BETA: 14 - 30Hz
 * GAMMA: 30 - 100Hz
 */
export const binauralFrequencies: { [key: string]: number } = {
  delta: 2,
  deltaMin: 0.5,
  deltaMax: 4,
  theta: 6,
  thetaMin: 4,
  thetaMax: 8,
  alpha: 10,
  alphaMin: 8,
  alphaMax: 14,
  beta: 18,
  betaMin: 14,
  betaMax: 30,
  gamma: 40,
  gammaMin: 30,
  gammaMax: 100,
};
