import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
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

import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

setupIonicReact();

const AuthLayout: React.FC = () => {
  const { initialized } = useAuth();

  useEffect(() => {
    (async function () {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }); // Enable to get debug logs
      if (Capacitor.getPlatform() === "ios") {
        await Purchases.configure({
          apiKey: "appl_fKPmGliwDGflaGwMEEWhVSJaLCj",
        });
        const offerings = await Purchases.getOfferings();
        console.log("OFFERINGS: ", offerings);
        // if (
        //   offerings.current !== null &&
        //   offerings.current.availablePackages.length !== 0
        // ) {
        //   // Display packages for sale
        //   offerings.current.availablePackages.forEach((item, index) => {
        //     console.log("PACKAGE: " + index, item);
        //   });
        // }
      }
    })();
  }, []);

  return (
    <IonApp>
      {initialized ? (
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <AuthenticatedRoute>
                <Route path="/" exact={true}>
                  <Redirect to="/list" />
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
