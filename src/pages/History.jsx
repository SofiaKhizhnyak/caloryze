import "../styles/Calendar.css";
import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
} from "@ionic/react";
import Calendar from "../components/Calendar";

const History = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="centered-wrapper">
          <IonCardTitle className="responsive-title history-header">
            Food Log Calendar
          </IonCardTitle>
          <IonCard>
            <IonCardContent>
              <Calendar />
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default History;
