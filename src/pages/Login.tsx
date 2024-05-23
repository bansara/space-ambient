import {
  IonButtons,
  IonHeader,
  IonIcon,
  IonMenuButton,
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

const Login = () => {
  const { user, logout } = useAuth();

  const router = useIonRouter();

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("Google sign in result: ", result);
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
            </div>
          )}
        </div>
      </div>
    </IonPage>
  );
};

export default Login;
