import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";
import { analytics } from "../../../firebaseConfig";
import { logEvent } from "firebase/analytics";

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
      logEvent(analytics, "stop_sequence", {
        sequence: ambient.currentSequence.currentPreset?.displayName,
      });
      ambient.ui.stopCurrentSequence();
      return;
    }
    logEvent(analytics, "play_sequence", {
      sequence: ambient.currentSequence.currentPreset?.displayName,
    });
    ambient.ui.playCurrentSequence();
  }

  return { isPlaying, togglePlay };
};
