import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../app/main-page/MainPage.module.scss'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const { login } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		try {
			setError('')
			setLoading(false)
			const result = await login(email, password)

			if (result.success) {
				navigate('/')
			} else {
				setError(result.error)
			}
		} catch {
			setError('Ошибка при входе')
		}
		setLoading(false)
	}

	return (
		<div className={styles.authForm}>
			<h2>Sign in</h2>
			{error && <div className={styles.error}>{error}</div>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email:</label>
					<input
						type='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<button disabled={loading} type='submit'>
					{loading ? 'Loading...' : 'Login'}
				</button>
			</form>
			<div>
				Don’t have an account?{' '}
				<Link to='/register' className={styles.changeFromButton}>
					Sign up
				</Link>
			</div>
		</div>
	)
}
