import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonRouter,
} from "@ionic/react";
import "./Card.scss";
import { StepSequencerPreset } from "../AMBIENT/stepSequencer/StepSequencerPreset";
import { useAmbient } from "../AMBIENT/react";
import useRevenueCat from "../Hooks/useRevenueCat";

interface CardProps {
  preset: StepSequencerPreset;
  onSelect: () => void;
}

const Card: React.FC<CardProps> = ({ preset, onSelect }) => {
  return (
    <IonCard className="glassmorphic" onClick={onSelect}>
      <img alt={preset.displayName} src={preset.imgSrc} />
      <IonCardHeader>
        <IonCardTitle>{preset.displayName}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default Card;
