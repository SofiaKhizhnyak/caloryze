import React, { useState } from "react";
import {
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonTitle,
  IonText,
  IonRouterLink,
} from "@ionic/react";
import { Redirect } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

function Signup() {
  const [error, setError] = useState("");
  const { signup, currentUser } = useAuth();

  const handleSignup = async (email, password) => {
    try {
      setError(""); //
      await signup(email, password);
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
            <IonTitle className="ion-text-center">Sign Up</IonTitle>
          </IonCardHeader>
          <IonCardContent>
            <AuthForm onSubmit={handleSignup} buttonText="Sign Up" />
            {error && (
              <IonText color="danger" style={{ padding: "1rem" }}>
                <p>{error}</p>
              </IonText>
            )}
            <IonText
              className="ion-text-center"
              style={{ display: "block", marginTop: "1rem" }}
            >
              Already have an account?{" "}
              <IonRouterLink routerLink="/login">Login</IonRouterLink>
            </IonText>
          </IonCardContent>
        </IonCard>
      </div>
    </IonPage>
  );
}

export default Signup;
