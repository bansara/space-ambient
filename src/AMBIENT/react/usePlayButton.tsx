import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

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
    hapticsImpactMedium();
    if (isPlaying) {
      FirebaseAnalytics.logEvent({
        name: "stop_sequence",
        params: {
          sequence: ambient.currentSequence.currentPreset?.displayName,
        },
      });
      ambient.ui.stopCurrentSequence();
      return;
    }
    FirebaseAnalytics.logEvent({
      name: "play_sequence",
      params: { sequence: ambient.currentSequence.currentPreset?.displayName },
    });
    ambient.ui.playCurrentSequence();
  }

  return { isPlaying, togglePlay };
};
