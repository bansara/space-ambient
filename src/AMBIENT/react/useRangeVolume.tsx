import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const useRangeVolume = () => {
  const ambient = useAmbient();
  const [volume, setVolume] = useState(
    ambient.currentSequence?.output.gain.value || 0
  );

  useEffect(() => {
    const handleVolumeChange = (volume: number) => {
      setVolume(volume);
    };
    const handlePresetChange = () => {
      setVolume(ambient.currentSequence?.output.gain.value || 0);
    };

    // Subscribe to volume changes
    ambient.ui.on("rangeVolumeChange", handleVolumeChange);
    ambient.ui.on("presetChange", handlePresetChange);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("rangeVolumeChange", handleVolumeChange);
      ambient.ui.off("presetChange", handlePresetChange);
    };
  }, [ambient]);

  function setRangeVolume(volume: number) {
    ambient.ui.setRangeVolume(volume);
  }

  return { volume, setRangeVolume };
};
