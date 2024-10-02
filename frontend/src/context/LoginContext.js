"use client"
import { createContext, useContext, useState } from 'react';
const LoginContext = createContext();

export function LoginProvider({ children }) {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const login = () => {
    setIsAuthenticated(true);
    console.log("user is logged");
  };
const logout = () => {
 setIsAuthenticated(false);
    console.log('user is logged out');
  };

  return (
    <LoginContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext(){
  const context =useContext(LoginContext);
  if(!context){
    throw new Error("useLogin Context must be used within a LoginProvider")

  }
  return context;
}
