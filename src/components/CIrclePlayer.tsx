import { IonButton, IonIcon, IonRange } from "@ionic/react";
import { playCircle, pauseCircle, volumeLow, volumeHigh } from "ionicons/icons";
import { usePlayButton } from "../AMBIENT/react";
import "./CirclePlayer.scss";

const CirclePlayer = () => {
  const { isPlaying, togglePlay } = usePlayButton();
  return (
    <div id="circle-player">
      <IonButton
        fill="clear"
        onTouchStart={togglePlay}
        aria-label="Toggle Play"
      >
        {isPlaying ? (
          <IonIcon ios={pauseCircle} md={pauseCircle} slot="icon-only" />
        ) : (
          <IonIcon ios={playCircle} md={playCircle} slot="icon-only" />
        )}
      </IonButton>
    </div>
  );
};

export default CirclePlayer;
