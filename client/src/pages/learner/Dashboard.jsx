import { useAuth } from '../../contexts/AuthContext'

export default function LearnerDashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Learner Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Role: {user?.role}</p>
      <p>This is your learner dashboard shell.</p>
    </div>
  )
}