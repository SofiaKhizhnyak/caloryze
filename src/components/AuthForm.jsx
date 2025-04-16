import React, { useState } from "react";
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonCardContent,
} from "@ionic/react";

function AuthForm({ onSubmit, buttonText }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <IonCardContent>
      <form onSubmit={handleSubmit}>
        <IonList>
          <IonItem className="custom-input-item">
            <IonLabel
              position="stacked"
              style={{
                color: "#e34400ff",
                fontSize: "1.5rem",
                marginBottom: "2px",
              }}
            >
              Email:
            </IonLabel>

            <IonInput
              required
              fill="outline"
              type="email"
              className="custom-input"
              value={email}
              disabled={false}
              onIonChange={(e) => setEmail(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem className="custom-input-item">
            <IonLabel
              position="stacked"
              style={{
                color: "#e34400ff",
                fontSize: "1.5rem",
                marginBottom: "2px",
              }}
            >
              Password:
            </IonLabel>

            <IonInput
              required
              fill="outline"
              type="password"
              className="custom-input"
              value={password}
              disabled={false}
              onIonChange={(e) => setPassword(e.detail.value)}
            ></IonInput>
          </IonItem>
        </IonList>

        <div style={{ padding: "1rem" }}>
          <IonButton expand="block" type="submit">
            {buttonText}
          </IonButton>
        </div>
      </form>
    </IonCardContent>
  );
}

export default AuthForm;
