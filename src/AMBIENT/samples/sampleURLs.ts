import { notes } from "../sampler";
import { OneShotURL } from "../sampler/OneShot/OneShotPresets";
import { PadLooper } from "../sampler/Pad/PadLooper";
import { Transposer } from "../sampler/Transposer/Transposer";
// import { Waveform } from "../sampler/Waveform/Waveform";

export interface SampleData {
  url: URL;
}

export interface TransposerSampleData extends SampleData {
  sampleBase: notes;
}

export interface SampleLibrary {
  padloopers: { [key: string]: SampleData };
  transposers: { [key: string]: TransposerSampleData };
  waveforms: { [key: string]: SampleData };
  oneShots: { [key: string]: OneShotURL };
}

export const sampleURLs: SampleLibrary = {
  padloopers: {
    loop: {
      url: new URL("padLooper/loop.m4a", import.meta.url),
    },
    majPentLoop: {
      url: new URL("padLooper/maj-pent-loop.m4a", import.meta.url),
    },
    hamsadhwani: {
      url: new URL("padLooper/hamsadhwani-5.m4a", import.meta.url),
    },
    uke: {
      url: new URL("padLooper/uke.m4a", import.meta.url),
    },
    bouzouki: {
      url: new URL("padLooper/bouzouki.m4a", import.meta.url),
    },
    junoOctave: {
      url: new URL("padLooper/juno-octave-loop.m4a", import.meta.url),
    },
    isochronic: {
      url: new URL("padLooper/isochronic.wav", import.meta.url),
    },
    birds: {
      url: new URL("padLooper/birds.m4a", import.meta.url),
    },
    ocean: {
      url: new URL("padLooper/ocean.m4a", import.meta.url),
    },
    rain: {
      url: new URL("padLooper/rain.m4a", import.meta.url),
    },
  },
  transposers: {
    airTone: {
      url: new URL("transposer/air-tone.m4a", import.meta.url),
      sampleBase: notes.C3,
    },
    warmString: {
      url: new URL("transposer/warm-string.m4a", import.meta.url),
      sampleBase: notes.C3,
    },
    piano: {
      url: new URL("transposer/a.wav", import.meta.url),
      sampleBase: notes.A3,
    },
    metronome: {
      url: new URL("transposer/metronome.m4a", import.meta.url),
      sampleBase: notes.A3,
    },
    celeste: {
      url: new URL("transposer/celeste.m4a", import.meta.url),
      sampleBase: notes.C3,
    },
    spacePiano: {
      url: new URL("transposer/space-piano.m4a", import.meta.url),
      sampleBase: notes.C3,
    },
    topAir: {
      url: new URL("transposer/top-air.m4a", import.meta.url),
      sampleBase: notes.C3,
    },
  },
  waveforms: {},
  oneShots: {
    test1: {
      url: new URL("oneShots/oneShot1.wav", import.meta.url),
      fadeOutTime: 0,
    },
    test2: {
      url: new URL("oneShots/oneShot2.wav", import.meta.url),
      fadeOutTime: 0,
    },
  },
};
