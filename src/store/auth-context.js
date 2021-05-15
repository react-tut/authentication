import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remaningDuration = adjExpirationTime - currentTime;
  return remaningDuration;
};

const retriveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");
  const remaningDuration = calculateRemainingTime(storedExpirationTime);

  if (remaningDuration <= 3600) {
    localStorage.clear();
    return null;
  }
  return {
    storedToken,
    remaningDuration,
  };
};

export const AuthContextProvider = (props) => {
  const data = retriveStoredToken();
  let initialToken = null;
  if (data) {
    initialToken = data.storedToken;
  }
  const [token, setToken] = useState(initialToken);

  const useIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.clear();
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (userToken, expirationTime) => {
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("expirationTime", expirationTime);

    const remaningDuration = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remaningDuration);
  };

  const contextValue = {
    token: token,
    isLoggedIn: useIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  useEffect(() => {
    if (data) {
      logoutTimer = setTimeout(logoutHandler, data.remaningDuration);
    }
  }, [data, logoutHandler]);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
