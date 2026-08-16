import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/useAuth'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Carregando...</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
