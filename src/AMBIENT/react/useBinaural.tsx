import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const useBinaural = () => {
  const ambient = useAmbient();
  const [binauralFrequency, setBinauralFrequency] = useState<number>(8);
  const [isPlaying, setIsPlaying] = useState<boolean>(
    ambient.currentSequence?.binauralIsPlaying || false
  );

  useEffect(() => {
    const handleBinauralFrequency = (frequency: number) => {
      setBinauralFrequency(frequency);
    };

    const handleStop = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    // Subscribe
    ambient.ui.on("binauralFrequency", handleBinauralFrequency);
    ambient.ui.on("binauralPlay", handlePlay);
    ambient.ui.on("binauralStop", handleStop);
    ambient.ui.on("presetChange", handleStop);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("binauralFrequency", handleBinauralFrequency);
      ambient.ui.off("binauralPlay", handlePlay);
      ambient.ui.off("binauralStop", handleStop);
      ambient.ui.off("presetChange", handleStop);
    };
  }, [ambient]);

  function changeBinauralFrequency(frequency: number) {
    ambient.ui.setBinauralFrequency(frequency);
  }

  function toggleBinaural() {
    if (!ambient.currentSequence) return;
    if (ambient.currentSequence.binauralIsPlaying) {
      ambient.ui.stopBinaural();
    } else {
      ambient.ui.playBinaural();
    }
  }

  return {
    binauralFrequency,
    changeBinauralFrequency,
    toggleBinaural,
    isPlaying,
  };
};
