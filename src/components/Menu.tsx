import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  logOutOutline,
  logOutSharp,
  personCircleOutline,
  personCircleSharp,
  informationOutline,
  informationSharp,
} from "ionicons/icons";
import "./Menu.scss";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "About",
    url: "/about",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
  {
    title: "List",
    url: "/list",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
  // {
  //   title: "Listen",
  //   url: "/listen",
  //   iosIcon: informationOutline,
  //   mdIcon: informationSharp,
  // },
  {
    title: "Logout",
    url: "/auth",
    iosIcon: logOutOutline,
    mdIcon: logOutSharp,
  },
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent id="custom-sidemenu">
        <IonList className="glassmorphic-dark">
          <IonListHeader>Bansara</IonListHeader>
          <IonNote>Space Ambient</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={`${
                    location.pathname === appPage.url ? "selected" : ""
                  } menu-card`}
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  {/* <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  /> */}
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
