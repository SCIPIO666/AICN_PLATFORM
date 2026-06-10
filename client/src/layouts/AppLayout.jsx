import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-[280px]">
        <Navbar />
        
        <main className="mt-[60px] p-6 min-h-[calc(100vh-60px)] bg-bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}