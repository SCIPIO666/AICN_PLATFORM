import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';
import PublicNavbar from '@/components/PublicNavbar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <PublicNavbar />
      <Sidebar />
      
      <div className="flex-1 transition-all duration-300 ml-72">
        <main 
          className="min-h-screen px-6 py-6 md:px-8 md:py-8"
          style={{ 
            marginTop: '80px',
            background: 'var(--bg-page)',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
          <Outlet />
          <ToastContainer />
        </main>
      </div>
    </div>
  );
}