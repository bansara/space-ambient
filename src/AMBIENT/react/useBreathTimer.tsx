import { useState, useEffect } from "react";
import { useAmbient } from "./AmbientContext";

export const useBreathTimer = () => {
  const ambient = useAmbient();
  const [remainingTime, setRemainingTime] = useState(
    ambient.breathSequence?.remainingTime || 0
  );

  useEffect(() => {
    const handleUpdateTimer = (time: number) => {
      setRemainingTime(time);
    };

    // Subscribe to timer updates
    ambient.ui.on("updateTimer", handleUpdateTimer);

    // Cleanup on unmount
    return () => {
      ambient.ui.off("updateTimer", handleUpdateTimer);
    };
  }, [ambient]);

  const initTimer = (time: number) => {
    ambient.breathSequence?.initTimer(time * 60);
  };

  return { remainingTime, initTimer };
};
