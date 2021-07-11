//Makes other routes private and redirects to intro page if user hasn't not logged in

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        );
      }}
    ></Route>
  );
}
