import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const useMetronome = () => {
  const ambient = useAmbient();
  const [isPlaying, setIsPlaying] = useState<boolean>(
    ambient.breathSequence?.metronomeIsPlaying || false
  );

  useEffect(() => {
    const handleMetronomePlay = () => {
      setIsPlaying(true);
    };

    const handleMetronomeStop = () => {
      setIsPlaying(false);
    };

    // Subscribe
    ambient.ui.on("metronomeOn", handleMetronomePlay);
    ambient.ui.on("metronomeOff", handleMetronomeStop);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("metronomeOn", handleMetronomePlay);
      ambient.ui.off("metronomeOff", handleMetronomeStop);
    };
  }, [ambient]);

  function toggleMetronome() {
    ambient.breathSequence?.toggleMetronome();
  }

  return {
    toggleMetronome,
    isPlaying,
  };
};
