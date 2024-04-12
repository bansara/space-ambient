import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const useBreathPlayButton = () => {
  const ambient = useAmbient();
  const [isPlaying, setIsPlaying] = useState(
    ambient.breathSequence?.isPlaying || false
  );

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleStop = () => {
      setIsPlaying(false);
    };

    // Subscribe to play/stop changes
    ambient.ui.on("playBreathSequence", handlePlay);
    ambient.ui.on("stopBreathSequence", handleStop);
    ambient.ui.on("loadBreathSequence", handleStop);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("playBreathSequence", handlePlay);
      ambient.ui.off("stopBreathSequence", handleStop);
      ambient.ui.off("loadBreathSequence", handleStop);
    };
  }, [ambient]);

  function togglePlay() {
    if (!ambient.breathSequence) return;
    isPlaying
      ? ambient.ui.stopBreathSequence()
      : ambient.ui.playBreathSequence();
  }

  return { isPlaying, togglePlay };
};
