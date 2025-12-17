const API_URL = 'http://127.0.0.1:8000'

export async function apiLogin(email, password) {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
		credentials: 'include',
	})

	let data = null
	try {
		data = await response.json()
	} catch (err) {
		console.warn('No JSON in response')
	}

	if (!response.ok) {
		throw new Error(data?.detail || 'Login failed')
	}

	return data
}

export async function apiRegister(email, password) {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
		credentials: 'include',
	})

	let data = null
	try {
		data = await response.json()
	} catch {
		data = null
	}

	if (!response.ok) {
		throw new Error(data?.detail || data?.error || 'Registration failed')
	}

	return data
}

export async function apiRefresh() {
	const response = await fetch(`${API_URL}/auth/refresh`, {
		method: 'POST',
		credentials: 'include',
	})

	if (!response.ok) {
		throw new Error('Unable to refresh token')
	}

	return response.json()
}
