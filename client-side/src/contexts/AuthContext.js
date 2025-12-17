import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { apiLogin, apiRefresh, apiRegister } from '../api/auth'
import { decodeToken } from '../utils/decodedToken'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const saveAccessToken = token => localStorage.setItem('access_token', token)
	const removeAccessToken = () => localStorage.removeItem('access_token')

	const loadUserFromAccess = token => {
		if (!token) return null
		const decoded = decodeToken(token)
		if (!decoded) return null
		return {
			email: decoded.sub,
			isAdmin: decoded.is_admin === 1,
			favorites: [],
		}
	}

	const login = async (email, password) => {
		try {
			const data = await apiLogin(email, password)
			saveAccessToken(data.access_token)
			const user = loadUserFromAccess(data.access_token)
			setUser(user)
			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	const register = async (email, password) => {
		try {
			await apiRegister(email, password)
			await login(email, password)
			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	const refreshToken = useCallback(async () => {
		try {
			const data = await apiRefresh()
			saveAccessToken(data.access_token)
			const user = loadUserFromAccess(data.access_token)
			setUser(user)
			return true
		} catch (err) {
			logout()
			return false
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			await fetch('http://127.0.0.1:8000/auth/logout', {
				method: 'POST',
				credentials: 'include',
			})
		} catch (err) {
			console.error('Ошибка при logout', err)
		}

		removeAccessToken()
		setUser(null)
		localStorage.removeItem('cart')
		window.location.href = '/'
	}, [])

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem('access_token')
			if (!token) {
				setLoading(false)
				return
			}

			const currentUser = loadUserFromAccess(token)
			if (currentUser) {
				setUser(currentUser)
			} else {
				await refreshToken()
			}
			setLoading(false)
		}
		init()
	}, [refreshToken])

	useEffect(() => {
		const interval = setInterval(() => {
			refreshToken()
		}, 15 * 60 * 1000)
		return () => clearInterval(interval)
	}, [refreshToken])

	const value = useMemo(
		() => ({
			user,
			isAdmin: user?.isAdmin || false,
			login,
			register,
			logout,
		}),
		[user, login, logout]
	)

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)
}
