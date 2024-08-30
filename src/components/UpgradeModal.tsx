import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./UpgradeModal.scss";
import useRevenueCat from "../Hooks/useRevenueCat";

export default function UpgradeModal({
  dismiss,
}: {
  dismiss: (data?: string | null | undefined | number, role?: string) => void;
}) {
  const { offerings, purchasePackage, monthly, yearly, error } =
    useRevenueCat();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => dismiss(null, "cancel")} strong={true}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div id="modal-content">
          <h1>Explore the Universe of Premium Features</h1>
          <p id="sales-copy">
            Upgrade for exclusive access to premium soundscapes and features.
          </p>
          {!!error && <div>Revenue Cat Error</div>}
          <div id="sub-buttons">
            <IonButton
              onClick={() => {
                purchasePackage(monthly!)
                  .then(() => dismiss(null, "confirm"))
                  .catch((e) => console.error(e));
              }}
              id="monthly-button"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>Monthly</span> <span>$2.99/mo</span>
              </div>
            </IonButton>
            <IonButton
              onClick={() => {
                purchasePackage(yearly!)
                  .then(() => dismiss(null, "confirm"))
                  .catch((e) => console.error(e));
              }}
              id="yearly-button"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>Yearly</span> <span>$29.99/yr</span>
              </div>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
