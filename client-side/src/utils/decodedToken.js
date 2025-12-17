import { jwtDecode } from 'jwt-decode'

export const decodeToken = token => {
	try {
		const decoded = jwtDecode(token)

		if (decoded.exp * 1000 < Date.now()) {
			return null
		}

		return decoded
	} catch (error) {
		console.error('Error decoding token:', error)
		return false
	}
}
