import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonToast,
  IonText,
} from "@ionic/react";
import { thumbsUpOutline, alertCircleOutline } from "ionicons/icons";
import { useAppContext } from "../contexts/AppContext";
import ProgressCard from "../components/ProgressCard";
import AddNewDay from "../components/AddNewDay";

const Start = () => {
  const { isCurrentDayToday } = useAppContext();
  const isCurrentDaySeted = isCurrentDayToday();

  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <div className="centered-wrapper">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center responsive-title">
                {isCurrentDaySeted
                  ? "Your Day Is in Motion"
                  : "New Day, New Goal"}
              </IonCardTitle>
              <IonCardSubtitle
                className="ion-text-center"
                style={{ color: "#eb3903ff", fontSize: "0.9rem" }}
              >
                {isCurrentDaySeted
                  ? "You’ve got this!"
                  : "Set your daily calorie goal and start tracking"}
              </IonCardSubtitle>
              {isCurrentDaySeted && (
                <IonText
                  color="dark"
                  className="ion-text-center"
                  style={{ padding: "2px" }}
                >
                  Go add your food items to the list
                </IonText>
              )}
            </IonCardHeader>
            <IonCardContent>
              {isCurrentDaySeted ? (
                <ProgressCard />
              ) : (
                <AddNewDay
                  showToast={showToast}
                  setShowToast={setShowToast}
                  showErrorToast={showErrorToast}
                  setShowErrorToast={setShowErrorToast}
                />
              )}
              <div style={{ padding: "1rem", margin: "1px" }}>
                <IonImg
                  src="/scale.png"
                  alt="image"
                  style={{
                    width: "fit-content",
                    height: "auto",
                    marginInline: "auto",
                    opacity: "0.7",
                  }}
                />
              </div>
              <IonToast
                position="middle"
                icon={thumbsUpOutline}
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Successfully added a new day!"
                duration={2000}
              />
              <IonToast
                position="middle"
                icon={alertCircleOutline}
                isOpen={showErrorToast}
                onDidDismiss={() => setShowErrorToast(false)}
                message="Calorie goal must be at least 1200"
                duration={2000}
                color="danger"
              />
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Start;
