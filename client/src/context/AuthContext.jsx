import { createContext, useState, useEffect, useContext } from "react";
import { registerUser, loginUser, fetchCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // checkingAuth is true while we verify a saved token on first load
  const [checkingAuth, setCheckingAuth] = useState(true);

  // on first load, if there's a saved token, try to fetch the user it belongs to
  useEffect(() => {
    const token = localStorage.getItem("tripify_token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetchCurrentUser()
      .then((data) => setUser(data))
      .catch(() => {
        // token expired or invalid, clear it out
        localStorage.removeItem("tripify_token");
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("tripify_token", data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("tripify_token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("tripify_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
