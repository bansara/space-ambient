import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import Menu from "./components/Menu";
import Page from "./pages/Page";

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

setupIonicReact();

const AuthLayout: React.FC = () => {
  const { initialized } = useAuth();

  return (
    <IonApp>
      {initialized ? (
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <AuthenticatedRoute>
                <Route path="/" exact={true}>
                  <Redirect to="/about" />
                </Route>
                <Route path="/folder/:name" exact={true} component={Page} />
                <Route path="/about" exact={true} component={About} />
                <Route path="/list" exact={true} component={List} />
                <Route path="/listen" exact={true} component={Listen} />
                <Route path="/auth" exact={true} component={Login} />
              </AuthenticatedRoute>
              <Route path="/auth" exact={true} component={Login} />
            </IonRouterOutlet>
          </IonSplitPane>
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
