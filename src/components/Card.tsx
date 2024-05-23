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
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";

interface CardProps {
  preset: StepSequencerPreset;
}

const logEvent = async (preset: StepSequencerPreset) => {
  await FirebaseAnalytics.logEvent({
    name: "preview_preset",
    params: { preset: preset.displayName },
  });
  await FirebaseAnalytics.logEvent({
    name: "load_preset",
    params: { preset: preset.displayName },
  });
};

const Card: React.FC<CardProps> = ({ preset }) => {
  const ambient = useAmbient();
  const router = useIonRouter();
  const handlePreview = () => {
    logEvent(preset);

    ambient.currentSequence
      ? ambient.changeSequence(preset)
      : ambient.addSequence(preset);
    router.push("/listen");
  };
  return (
    <IonCard className="glassmorphic" onClick={handlePreview}>
      <img alt={preset.displayName} src={preset.imgSrc} />
      <IonCardHeader>
        <IonCardTitle>{preset.displayName}</IonCardTitle>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
      </IonCardHeader>
    </IonCard>
  );
};

export default Card;
