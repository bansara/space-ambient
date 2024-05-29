import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import n2 from "../images/n2.webp";
import ship from "../images/ship.webp";
import Player from "../components/Player";
import "./Listen.scss";
import XYPad from "../components/XYPad/XYPad";
import { useAmbient } from "../AMBIENT/react";
import CirclePlayer from "../components/CIrclePlayer";

const Listen: React.FC = () => {
  const ambient = useAmbient();
  return (
    <IonPage>
      <IonHeader translucent={true} mode="ios">
        <IonToolbar>
          {/* <IonTitle>Listen</IonTitle> */}
          <IonButtons slot="start">
            <IonBackButton text="" />
            {/* <IonMenuButton /> */}
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false} fullscreen>
        <div id="listen-container">
          <img
            src={ambient.currentSequence?.currentPreset?.imgSrc}
            className="background"
          />
          <XYPad
            onChangeX={
              ambient[ambient.currentSequence?.currentPreset?.xFunction!]
            }
            onChangeY={
              ambient[ambient.currentSequence?.currentPreset?.yFunction!]
            }
          />
          <CirclePlayer />
        </div>
      </IonContent>
      {/* <Player /> */}
    </IonPage>
  );
};

export default Listen;
