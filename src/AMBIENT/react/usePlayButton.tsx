import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const usePlayButton = () => {
  const ambient = useAmbient();
  const [isPlaying, setIsPlaying] = useState(
    ambient.currentSequence?.isPlaying || false
  );

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleStop = () => {
      setIsPlaying(false);
    };

    // Subscribe to play/stop changes
    ambient.ui.on("playCurrentSequence", handlePlay);
    ambient.ui.on("stopCurrentSequence", handleStop);
    ambient.ui.on("presetChange", handleStop);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("playCurrentSequence", handlePlay);
      ambient.ui.off("stopCurrentSequence", handleStop);
      ambient.ui.off("presetChange", handleStop);
    };
  }, [ambient]);

  function togglePlay() {
    if (!ambient.currentSequence) return;
    if (isPlaying) {
      ambient.ui.stopCurrentSequence();
      return;
    }
    ambient.ui.playCurrentSequence();
  }

  return { isPlaying, togglePlay };
};
