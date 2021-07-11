//Handles Firebase authentication via Mail

import React, { useContext, useState, useEffect } from "react";
import { auth } from "../Firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //Handles user sign up
  function signup(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password).catch((err) => {
      console.log(err);
    });
  }

  //Handles user login
  function login(email, password, name) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        return cred.user.updateProfile({
          displayName: name,
        });
      })
      .catch((err) => console.log(err));
  }

  //Handles user logout
  function logout() {
    return auth.signOut();
  }

  //Handles password reset
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  //Handles mail update
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  //Handles name update
  function updateName(name) {
    console.log("hi2");
    return currentUser.updateProfile({
      displayName: name,
    });
  }

  //Handles password change
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  //Setting current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateName,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  //Exporting all functions
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
