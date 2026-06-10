import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes/router';


const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: false 
    } 
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
            }}
          />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;