import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./Login.scss";
import { signInWithApple, signInWithGoogle } from "../../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import n2 from "../images/n2.webp";
import { logInOutline, logOutOutline } from "ionicons/icons";
import { FirebaseError } from "firebase/app";
import { Capacitor } from "@capacitor/core";
import { useRef } from "react";
import PrivacyPolicy from "../components/Privacy";
import TermsOfService from "../components/Terms";

const Login = () => {
  const { user, logout } = useAuth();
  const router = useIonRouter();
  const privacyModal = useRef<HTMLIonModalElement>(null);
  const termsModal = useRef<HTMLIonModalElement>(null);

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      router.push("/list");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("Error signing in: ", error.message);
        console.log(JSON.stringify(error));
      }
    }
  };
  const handleSignInWithApple = async () => {
    try {
      const result = await signInWithApple();
      console.log("Apple sign in result: ", result);
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
          {/* <IonTitle>{user ? "Sign Out" : "Sign In"}</IonTitle> */}
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
            <div>
              <button onClick={handleSignInWithGoogle}>
                Sign in with Google
              </button>
              {Capacitor.isNativePlatform() &&
                Capacitor.getPlatform() === "ios" && (
                  <button onClick={handleSignInWithApple}>
                    Sign in with Apple
                  </button>
                )}
              <div className="legal-buttons">
                <IonButton
                  id="privacy-modal"
                  fill="clear"
                  className="legal-button"
                >
                  Privacy Policy
                </IonButton>
                <IonButton
                  id="terms-modal"
                  fill="clear"
                  className="legal-button"
                >
                  Terms of Service
                </IonButton>
              </div>
              <IonModal ref={privacyModal} trigger="privacy-modal">
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Privacy Policy</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        strong={true}
                        onClick={() => privacyModal.current?.dismiss()}
                      >
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  <PrivacyPolicy />
                </IonContent>
              </IonModal>
              <IonModal ref={termsModal} trigger="terms-modal">
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Terms of Service</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        strong={true}
                        onClick={() => termsModal.current?.dismiss()}
                      >
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  <TermsOfService />
                </IonContent>
              </IonModal>
            </div>
          )}
        </div>
      </div>
    </IonPage>
  );
};

export default Login;
