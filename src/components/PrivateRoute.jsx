PrivateRoute;
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
