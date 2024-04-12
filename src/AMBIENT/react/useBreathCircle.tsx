import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";
import { BreathPattern } from "../breathSequencer/BreathSequencer";
import { BreathSequencerPreset } from "../breathSequencer/BreathSequencerPreset";
import { h } from "ionicons/dist/types/stencil-public-runtime";

export const useBreathCircle = () => {
  const ambient = useAmbient();
  const [currentPhase, setCurrentPhase] = useState({
    phase: "exhale",
    duration: 0,
  });
  let breathPattern = ambient.breathSequence?.currentPreset?.breathPattern;

  useEffect(() => {
    // Handler wrapper functions
    const handleInhale = () => handleEvent("inhale");
    const handleInhaleHold = () => handleEvent("inhaleHold");
    const handleExhale = () => handleEvent("exhale");
    const handleExhaleHold = () => handleEvent("exhaleHold");

    const handleEvent = (phase: keyof BreathPattern) => {
      if (!breathPattern) return;
      const duration = breathPattern[phase] * (60 / breathPattern.tempo); // Convert beats to seconds
      setCurrentPhase({ phase, duration });
    };

    const handlePresetChange = (preset: BreathSequencerPreset) => {
      breathPattern = ambient.breathSequence?.currentPreset?.breathPattern;
      setCurrentPhase({ phase: "exhale", duration: 0 });
    };

    ambient.ui.on("inhale", handleInhale);
    ambient.ui.on("inhaleHold", handleInhaleHold);
    ambient.ui.on("exhale", handleExhale);
    ambient.ui.on("exhaleHold", handleExhaleHold);
    ambient.ui.on("loadBreathSequence", handlePresetChange);

    return () => {
      ambient.ui.off("inhale", handleInhale);
      ambient.ui.off("inhaleHold", handleInhaleHold);
      ambient.ui.off("exhale", handleExhale);
      ambient.ui.off("exhaleHold", handleExhaleHold);
      ambient.ui.off("loadBreathSequence", handlePresetChange);
    };
  }, [ambient]);
  return currentPhase;
};
