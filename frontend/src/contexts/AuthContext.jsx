import { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Optionally decode token to get user email
      setUser({ email: 'user@example.com' });
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (email, password) => {
    await apiSignup(email, password);
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}