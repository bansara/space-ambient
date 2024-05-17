import { IonButton, IonIcon, IonRange } from "@ionic/react";
import { playCircle, pauseCircle, volumeLow, volumeHigh } from "ionicons/icons";
import { usePlayButton } from "../AMBIENT/react";
import "./Player.scss";
import { useRangeVolume } from "../AMBIENT/react/useRangeVolume";

const Player = () => {
  const { isPlaying, togglePlay } = usePlayButton();
  const { volume, setRangeVolume } = useRangeVolume();
  return (
    <div className="glassmorphic" id="player-container">
      <IonButton fill="clear" onClick={togglePlay} aria-label="Toggle Play">
        {isPlaying ? (
          <IonIcon ios={pauseCircle} md={pauseCircle} slot="icon-only" />
        ) : (
          <IonIcon ios={playCircle} md={playCircle} slot="icon-only" />
        )}
      </IonButton>
      <IonRange
        min={0}
        max={1}
        step={0.01}
        value={volume}
        pin={false}
        color="primary"
        onIonInput={(e) => setRangeVolume(e.detail.value as number)}
      >
        <IonIcon
          slot="start"
          size="small"
          icon={volumeLow}
          className="vol-icon"
        />
        <IonIcon
          slot="end"
          size="small"
          icon={volumeHigh}
          className="vol-icon"
        />
      </IonRange>
    </div>
  );
};

export default Player;
