import React, { useState } from "react";
import {
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonRouterLink,
} from "@ionic/react";

import { Redirect } from "react-router";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const { login, currentUser } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  if (currentUser) {
    return <Redirect to="/start" />;
  }

  return (
    <IonPage>
      <div className="centered-wrapper">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">Login</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <AuthForm onSubmit={handleLogin} buttonText="Login" />
            {error && (
              <IonText color="danger" style={{ padding: "1rem" }}>
                <p>{error}</p>
              </IonText>
            )}
            <IonText
              className="ion-text-center"
              style={{ display: "block", marginTop: "1rem" }}
            >
              Don't have an account yet?{" "}
              <IonRouterLink routerLink="/signup">Sign Up</IonRouterLink>
            </IonText>
          </IonCardContent>
        </IonCard>
      </div>
    </IonPage>
  );
}

export default Login;
