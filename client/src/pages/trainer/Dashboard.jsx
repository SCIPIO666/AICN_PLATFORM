import { useAuth } from '../../contexts/AuthContext'

export default function TrainerDashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Trainer Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      <p>This is your trainer dashboard shell.</p>
    </div>
  )
}