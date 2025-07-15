import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/v1/user/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        response = await response.json();
        console.log("User fetched:", response);
        setUser(response.data);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuth, isLoading, setUser, setIsAuth, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
