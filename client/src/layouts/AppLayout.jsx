import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';
import PublicNavbar from '@/components/PublicNavbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-page)' }}>
      <PublicNavbar />
      <Sidebar />
      
      <div className="min-w-0 w-full transition-all duration-300 lg:pl-72">
        <main 
          className="min-h-screen w-full px-4 py-5 md:px-6 md:py-6"
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
