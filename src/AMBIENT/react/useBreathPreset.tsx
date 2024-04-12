import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";
import { BreathSequencerPreset } from "../breathSequencer/BreathSequencerPreset";

export const useBreathPreset = () => {
  const ambient = useAmbient();
  const [preset, setPreset] = useState<BreathSequencerPreset | undefined>();

  useEffect(() => {
    const handleLoadBreathPreset = (preset: BreathSequencerPreset) => {
      setPreset(preset);
    };

    // Subscribe to volume changes
    ambient.ui.on("breathPresetChange", handleLoadBreathPreset);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("breathPresetChange", handleLoadBreathPreset);
    };
  }, [ambient]);

  function loadBreathPreset(preset: BreathSequencerPreset) {
    ambient.loadBreathSequence(preset);
  }

  return { preset, loadBreathPreset };
};
