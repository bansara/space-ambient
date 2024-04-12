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

interface CardProps {
  preset: StepSequencerPreset;
}

const Card: React.FC<CardProps> = ({ preset }) => {
  const ambient = useAmbient();
  const router = useIonRouter();
  const handlePreview = () => {
    ambient.currentSequence
      ? ambient.changeSequence(preset)
      : ambient.addSequence(preset);
    router.push("/listen");
  };
  return (
    <IonCard className="glassmorphic">
      <img alt="Silhouette of mountains" src={preset.imgSrc} />
      <IonCardHeader>
        <IonCardTitle>{preset.displayName}</IonCardTitle>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
      </IonCardHeader>

      <IonCardContent className="glassmorphic ion-padding">
        <IonButton fill="clear" onClick={handlePreview}>
          Preview
        </IonButton>
        <IonButton fill="solid">Buy $5</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default Card;
