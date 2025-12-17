import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminRequired = false }) {
	const { user, isAdmin } = useAuth()

	if (!user) return <Navigate to='/login' />
	if (adminRequired && !isAdmin) return <Navigate to='/' replace />

	return children
}
