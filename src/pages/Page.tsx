import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./Page.scss";
import n2 from "../images/n2.webp";
import Player from "../components/Player";

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>I'm a page!</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen
        style={{ "--background": `url(${n2}) no-repeat center center / cover` }}
      >
        <h1>Hi I'm a page!</h1>
      </IonContent>
      <Player />
    </IonPage>
  );
};

export default Page;
