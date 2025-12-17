import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../app/main-page/MainPage.module.scss'
import { useAuth } from '../../contexts/AuthContext'

export function RegisterPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const { register } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		if (password.length < 6) {
			return setError('Пароль должен быть не менее 6 символов')
		}

		if (password !== passwordConfirm) {
			return setError('Пароли не совпадают')
		}

		try {
			setError('')
			setLoading(true)
			const result = await register(email, password)

			if (result.success) {
				navigate('/')
			} else {
				setError(result.error)
			}
		} catch (error) {
			setError(error.message)
		}
		setLoading(false)
	}

	return (
		<div className={styles.authForm}>
			<h2>Sign up</h2>
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
				<div>
					<label>Password Confirmation:</label>
					<input
						type='password'
						value={passwordConfirm}
						onChange={e => setPasswordConfirm(e.target.value)}
						required
					/>
				</div>
				<button disabled={loading} type='submit'>
					{loading ? 'Loading...' : 'Create Account'}
				</button>
			</form>
			<div>
				Already have an account?{' '}
				<Link to='/login' className={styles.changeFromButton}>
					Sign in
				</Link>
			</div>
		</div>
	)
}
