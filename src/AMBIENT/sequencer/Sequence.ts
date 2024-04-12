export interface Sequence<N> {
  name: string;
  gain: GainNode;
  isPlaying: boolean;
  shouldPlayNextLoop: boolean;
  pattern: (N | null)[];
  clearPattern(): void;
  play(note: N, time: number, tempo: number): void;
}
