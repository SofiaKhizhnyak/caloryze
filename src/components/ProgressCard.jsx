import React from "react";
import { IonCard, IonCardContent, IonProgressBar, IonText } from "@ionic/react";
import { useAppContext } from "../contexts/AppContext";
import "../styles/ProgressCard.css";

const ProgressCard = () => {
  const { getCurrentDay } = useAppContext();
  const currentDay = getCurrentDay();

  if (!currentDay) {
    return null;
  }

  const { calorieGoal, totalCalories } = currentDay;
  const remainingCalories = calorieGoal - totalCalories;
  const progress = (totalCalories / calorieGoal) * 100;

  return (
    <IonCard className="progress-card">
      <IonCardContent>
        <IonProgressBar value={progress / 100} />
        <div style={{ marginInline: "auto", width: "fit-content" }}>
          <IonText>
            <h2 className="progress-text">
              <span className="custom-text-large">Daily Goal:</span>{" "}
              <span className="custom-text-small">{calorieGoal} kcal</span>
            </h2>
          </IonText>

          <IonText>
            <h2 className="progress-text">
              <span className="custom-text-large">Consumed:</span>{" "}
              <span
                className="custom-text-small"
                style={{
                  color: remainingCalories < 0 ? "#b41818" : "#07782f",
                }}
              >
                {" "}
                {totalCalories} kcal
              </span>
            </h2>
          </IonText>

          <IonText>
            <h2 className="progress-text">
              <span className="custom-text-large">Remaining:</span>{" "}
              <span className="custom-text-small">
                {remainingCalories < 0 ? "0" : remainingCalories} kcal
              </span>
            </h2>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProgressCard;
