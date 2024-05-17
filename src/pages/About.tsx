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
import "./About.scss";
import n2 from "../images/n2.webp";
import Player from "../components/Player";
import useRevenueCat from "../Hooks/useRevenueCat";

const About: React.FC = () => {
  const { offerings, customerInfo, error, purchasePackage, isPremiumUser } =
    useRevenueCat();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {/* <IonTitle>About</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="about-container">
          <img src={n2} alt="" className="background" />
          <div className="glassmorphic ion-padding ion-margin">
            {error ? (
              <div>Revenue Cat Error</div>
            ) : offerings ? (
              offerings.map((pkg, index) => (
                <div key={index}>
                  <h2>{pkg.product.title}</h2>
                  <p>{pkg.product.description}</p>
                  <IonButton onClick={() => purchasePackage(pkg)}>
                    Buy Now<span>&nbsp;{pkg.product.priceString}</span>
                  </IonButton>
                </div>
              ))
            ) : (
              <p>Loading packages...</p>
            )}
          </div>
          <div className="glassmorphic ion-padding ion-margin">
            <pre>{isPremiumUser ? "PREMIUM ACTIVE" : "NOT ACTIVE"}</pre>
          </div>
        </div>
      </IonContent>
      {isPremiumUser && <Player />}
    </IonPage>
  );
};

export default About;
