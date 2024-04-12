import { useState, useEffect } from "react";
import { StepSequencerPreset } from "../stepSequencer/StepSequencerPreset";
import { useAmbient } from "./AmbientContext";

export const usePreset = () => {
  const ambient = useAmbient();
  const [preset, setPreset] = useState<StepSequencerPreset | undefined>();

  useEffect(() => {
    const handleLoadPreset = (preset: StepSequencerPreset) => {
      setPreset(preset);
    };

    // Subscribe to volume changes
    ambient.ui.on("presetChange", handleLoadPreset);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("presetChange", handleLoadPreset);
    };
  }, [ambient]);

  function loadPreset(preset: StepSequencerPreset) {
    if (!ambient.currentSequence) {
      ambient.addSequence(preset);
      return;
    }
    ambient.changeSequence(preset);
  }

  return { preset, loadPreset };
};
