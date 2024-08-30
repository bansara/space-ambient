import {
  IonApp,
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import "firebase/auth";
import Menu from "./components/Menu";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/app.scss";
import Login from "./pages/Login";
import About from "./pages/About";
import {
  AuthProvider,
  AuthenticatedRoute,
  useAuth,
} from "./context/AuthContext";
import { AmbientProvider, useAmbient } from "./AMBIENT/react";
import Listen from "./pages/Listen";
import List from "./pages/List";

import useRevenueCat from "./Hooks/useRevenueCat";
import { home, person, volumeHigh } from "ionicons/icons";
import { GiSoundWaves } from "react-icons/gi";
import { useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { BackgroundTask } from "@capawesome/capacitor-background-task";

setupIonicReact();

const AuthLayout: React.FC = () => {
  const { initialized, user } = useAuth();
  const { offerings, customerInfo, isPremiumUser } = useRevenueCat();
  const ambient = useAmbient();

  return (
    <IonApp>
      {initialized ? (
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet animated={true}>
              <AuthenticatedRoute>
                <Route path="/" exact={true}>
                  <Redirect to="/list" />
                </Route>
                <Route path="/list" exact={true} component={List} />
                <Route path="/auth" exact={true} component={Login} />
                <Route path="/listen" exact={true} component={Listen} />
              </AuthenticatedRoute>
              <Route path="/auth" exact={true} component={Login} />
            </IonRouterOutlet>
            {user ? (
              <IonTabBar slot="bottom">
                <IonTabButton tab="list" href="/list">
                  <GiSoundWaves size={48} />
                </IonTabButton>
                <IonTabButton tab="login" href="/auth">
                  <IonIcon icon={person} />
                </IonTabButton>
              </IonTabBar>
            ) : (
              <IonTabBar slot="bottom"></IonTabBar>
            )}
          </IonTabs>
        </IonReactRouter>
      ) : (
        <IonLoading isOpen={!initialized} />
      )}
    </IonApp>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AmbientProvider>
        <AuthLayout />
      </AmbientProvider>
    </AuthProvider>
  );
};

export default App;
