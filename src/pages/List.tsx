import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonModal,
} from "@ionic/react";
import React from "react";
import Card from "../components/Card";
import "./List.scss";
import { presets } from "../AMBIENT/presets/presets";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { StepSequencerPreset } from "../AMBIENT/stepSequencer/StepSequencerPreset";
import { useAmbient } from "../AMBIENT/react";
import useRevenueCat from "../Hooks/useRevenueCat";
import UpgradeModal from "../components/UpgradeModal";
import Player from "../components/Player";

const logEvent = async (preset: StepSequencerPreset) => {
  await FirebaseAnalytics.logEvent({
    name: "load_preset",
    params: { preset: preset.displayName },
  });
};

const List: React.FC = () => {
  const ambient = useAmbient();
  const router = useIonRouter();
  const [present, dismiss] = useIonModal(UpgradeModal, {
    dismiss: (data: string, role: string) => dismiss(data, role),
  });
  const { offerings, customerInfo, error, purchasePackage, isPremiumUser } =
    useRevenueCat();

  const handleSelect = (preset: StepSequencerPreset) => {
    logEvent(preset);
    console.log(preset.isPremiumContent);
    if (!preset.isPremiumContent) {
      ambient.currentSequence
        ? ambient.changeSequence(preset)
        : ambient.addSequence(preset);
      // ambient.ui.playCurrentSequence();
      router.push("/listen");
    } else {
      present();
    }
  };

  return (
    <IonPage>
      <IonHeader translucent={true} mode="ios">
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" id="dark-bg" fullscreen>
        <div id="card-wrapper">
          <div id="card-container">
            {Object.values(presets).map((preset) => (
              <Card
                key={preset.id}
                preset={preset}
                onSelect={() => handleSelect(preset)}
              />
            ))}
            <Card
              preset={presets.default}
              onSelect={() => handleSelect(presets.default)}
            />
          </div>
          {!!ambient.currentSequence?.isPlaying && <Player />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default List;
