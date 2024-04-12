// AmbientContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Ambient } from "../Ambient";

// Create a context with an undefined initial value
const AmbientContext = createContext<Ambient | undefined>(undefined);

// Create a provider component
export const AmbientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const ambientInstance = new Ambient();

  return (
    <AmbientContext.Provider value={ambientInstance}>
      {children}
    </AmbientContext.Provider>
  );
};

// Custom hook to use the Ambient context
export const useAmbient = (): Ambient => {
  const context = useContext(AmbientContext);
  if (context === undefined) {
    throw new Error("useAmbient must be used within an AmbientProvider");
  }
  return context;
};
