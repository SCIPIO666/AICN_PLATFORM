const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null }); // 1. Start loading, clear old errors
    
    try {
      const response = await api.post('/login', { email, password });
      // 2. Success! Save the data
      set({ 
        user: response.data.user, 
        token: response.data.token, 
        isLoading: false 
      });
    } catch (err) {
      // 3. Failure! Save the error message
      set({ 
        error: err.response?.data?.message || "Login failed", 
        isLoading: false 
      });
    }
  }
}));