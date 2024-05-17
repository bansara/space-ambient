import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./Login.scss";
import { signInWithGooglePopup } from "../../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import n2 from "../images/n2.webp";
import { logInOutline, logOutOutline } from "ionicons/icons";
import Player from "../components/Player";
import { FirebaseError } from "firebase/app";
import { Purchases } from "@revenuecat/purchases-capacitor";

const Login = () => {
  const { user, logout } = useAuth();
  const router = useIonRouter();
  const handleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      router.push("/list");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("Error signing in: ", error.message);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {user && (
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          )}
          <IonTitle>{user ? "Sign Out" : "Sign In"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div id="auth-container">
        <img src={n2} className="background" />
        <div className="glassmorphic login-box ion-padding">
          {user ? (
            <h1>
              <IonIcon icon={logOutOutline} size="large"></IonIcon>
              <span>Logout</span>
            </h1>
          ) : (
            <h1>
              <IonIcon icon={logInOutline} size="large"></IonIcon>
              <span>Login</span>
            </h1>
          )}
          {user ? (
            <button onClick={logout}>Sign out</button>
          ) : (
            <button onClick={handleSignIn}>Sign in with Google</button>
          )}
        </div>
      </div>
      <Player />
    </IonPage>
  );
};

export default Login;
