import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import "./About.scss";
import n2 from "../images/n2.webp";
import ship from "../images/ship.webp";
import { usePlayButton } from "../AMBIENT/react";
import Player from "../components/Player";

const About: React.FC = () => {
  const { user } = useAuth();
  const { togglePlay } = usePlayButton();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="about-container">
          <img src={n2} alt="" className="background" />
          <div className="glassmorphic ion-padding ion-margin">
            <h1>Bansara</h1>
            <h2>Space Ambient</h2>
            <p>
              This is a reimagining of what a music release can be. A collection
              not of songs, but generative sonic environments.
            </p>
            <p>
              <img src={ship} alt="" style={{ width: "96px" }} />
            </p>

            {/* <IonButton onClick={togglePlay}>Play</IonButton> */}
          </div>
        </div>
      </IonContent>
      <Player />
    </IonPage>
  );
};

export default About;
