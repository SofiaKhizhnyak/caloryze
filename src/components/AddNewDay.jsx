import React, { useState } from "react";
import { IonButton, IonInput, IonItem, IonLabel, IonIcon } from "@ionic/react";
import { calendar, flameOutline } from "ionicons/icons";
import { useAppContext } from "../contexts/AppContext";
const AddNewDay = ({ setShowToast, setShowErrorToast, showErrorToast }) => {
  const { startNewDay } = useAppContext();
  const [calorieGoal, setCalorieGoal] = useState("");

  const handleStartNewDay = () => {
    const parsedGoal = parseInt(calorieGoal, 10);
    if (!parsedGoal || parsedGoal < 1200) {
      setShowErrorToast(true);
      return;
    }

    startNewDay(parsedGoal);

    setShowToast(true);
  };

  return (
    <>
      <IonItem className="custom-input-item">
        <IonLabel
          position="stacked"
          style={{
            color: "#e34400ff",
            marginBottom: "2px",
          }}
        >
          Set Daily Goal
        </IonLabel>
        <IonInput
          required
          min={1200}
          fill="outline"
          type="number"
          placeholder="min 1200 cal"
          value={calorieGoal}
          disabled={showErrorToast}
          onIonChange={(e) => setCalorieGoal(e.detail.value)}
          className="custom-input"
        />
      </IonItem>

      <div className="ion-padding ion-text-center">
        <IonButton onClick={handleStartNewDay} color="primary">
          <IonIcon icon={flameOutline} slot="start" />
          Start New Day
        </IonButton>
      </div>
    </>
  );
};

export default AddNewDay;
