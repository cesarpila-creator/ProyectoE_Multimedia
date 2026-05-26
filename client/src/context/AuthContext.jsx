import { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { saveToken, removeToken, getToken } from "../utils/auth";

// CONTEXT
const AuthContext = createContext();

// PROVIDER
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // LOAD SESSION
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // RESTORE USER
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("USER PARSE ERROR");

        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // SAVE TOKEN
      saveToken(token);

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(user));

      // UPDATE STATE
      setUser(user);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,

        message: error.response?.data?.message || "Error iniciando sesión",
      };
    }
  };

  // REGISTER
  const register = async (username, email, password) => {
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,

        message: error.response?.data?.message || "Error registrando usuario",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    removeToken();

    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        login,

        register,

        logout,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};
