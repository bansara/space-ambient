export function createContext(): AudioContext {
  // @ts-ignore
  return new (window.AudioContext || window.webkitAudioContext)();
}
