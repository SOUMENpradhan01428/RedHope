import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const storedName = localStorage.getItem("name");
      const storedRole = localStorage.getItem("role");
      
      if (storedName && storedRole) {
        setUser({ name: storedName, role: storedRole });
        setLoading(false);
      } else {
        // Mock getMe for now since backend doesn't have it
        setUser({ name: "User", role: "Donor" });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("role", data.user.role);
    sessionStorage.setItem("showWelcome", "true");
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const data = await authAPI.register(formData);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("role", data.user.role);
      sessionStorage.setItem("showWelcome", "true");
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    sessionStorage.removeItem("showWelcome");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
