import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppShell() {
  console.log(' AppShell rendering')
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: '260px' }}>
        <Navbar />
        
        <main style={{ 
          marginTop: '60px',
          padding: '24px',
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#f3f4f6'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}