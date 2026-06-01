import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as loginApi, signup as signupApi, logout as logoutApi, getMe } from '../api/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'SET_TOKEN':
      localStorage.setItem('accessToken', action.payload);
      return { ...state, token: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return { ...state, user: null, token: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const user = await getMe();
          dispatch({ type: 'SET_USER', payload: user });
        } catch (err) {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUser();
  }, [state.token]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    dispatch({ type: 'SET_TOKEN', payload: data.token });
    dispatch({ type: 'SET_USER', payload: data.user });
    return data;
  };

  const signup = async (userData) => {
    const data = await signupApi(userData);
    // After signup, optionally auto-login? We'll just return.
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {}
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);