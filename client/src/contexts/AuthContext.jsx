import React, { createContext, useContext } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { useLogin, useSignup, useLogout, useMe } from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get state from Zustand
  const { user, token, isAuthenticated, isLoading: storeLoading } = useAuthStore();

  // Get mutations from TanStack Query
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  
  // Fetch user data if token exists but no user
  const { data: userData, isLoading: userLoading, refetch } = useMe();
  
  // Determine loading state
  const isLoading = storeLoading || userLoading || 
                   loginMutation.isLoading || signupMutation.isLoading || 
                   logoutMutation.isLoading;
  
  // Use either store user or fetched user
  const currentUser = user || userData;
  const isAuth = isAuthenticated || !!currentUser;
  
  // Wrapper functions that components can use
  const login = async (email, password) => {
    const result = await loginMutation.mutateAsync({ email, password });
    return result;
  };
  
  const signup = async (userData) => {
    const result = await signupMutation.mutateAsync(userData);
    return result;
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const value = {
    user: currentUser,
    token,
    isAuthenticated: isAuth,
    isLoading,
    login,
    signup,
    logout,
    refetch,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};