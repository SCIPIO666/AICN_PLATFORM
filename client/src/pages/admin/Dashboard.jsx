import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      <p>This is your admin dashboard shell.</p>
    </div>
  )
}