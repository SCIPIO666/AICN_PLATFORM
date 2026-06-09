import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: '280px' }}>
        <Navbar />
        
        <main style={{ 
          marginTop: '60px',
          padding: '24px',
          backgroundColor: '#f3f4f6',
          minHeight: 'calc(100vh - 60px)'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}