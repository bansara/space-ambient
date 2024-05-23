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

const Listen: React.FC = () => {
  const ambient = useAmbient();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonTitle>Listen</IonTitle> */}
          <IonButtons slot="start">
            <IonBackButton text="" />
            {/* <IonMenuButton /> */}
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <img
          src={ambient.currentSequence?.currentPreset?.imgSrc}
          className="background"
        />
        <div id="listen-container">
          <XYPad
            onChangeX={
              ambient[ambient.currentSequence?.currentPreset?.xFunction!]
            }
            onChangeY={
              ambient[ambient.currentSequence?.currentPreset?.yFunction!]
            }
          />
        </div>
      </IonContent>
      <Player />
    </IonPage>
  );
};

export default Listen;
