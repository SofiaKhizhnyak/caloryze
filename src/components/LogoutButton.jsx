import React from "react";
import { IonButton } from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  return (
    <IonButton expand="block" color="danger" onClick={handleLogout}>
      Logout
    </IonButton>
  );
}

export default LogoutButton;
