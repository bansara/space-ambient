import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import Card from "../components/Card";
import "./List.scss";
import n2 from "../images/n2.webp";
import { presets } from "../AMBIENT/presets/presets";

const List: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {/* <IonTitle>List</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <img src={n2} className="background" />
        <div id="card-wrapper">
          <div id="card-container">
            {Object.values(presets).map((preset) => (
              <Card key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default List;
