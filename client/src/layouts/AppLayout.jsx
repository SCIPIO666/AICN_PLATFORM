import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PublicNavbar from '@/components/PublicNavbar';
export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <PublicNavbar/>
      <Sidebar />
      
      <div className="flex-1 ml-[280px]">
        
        <main className="mt-[60px] p-6 min-h-[calc(100vh-60px)] bg-bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}