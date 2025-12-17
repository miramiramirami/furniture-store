import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export function useFavorites() {
	const { user } = useAuth()
	const [favorites, setFavorites] = useState(user?.favorites || [])
	const token = localStorage.getItem('access_token')

	const getFavorites = async () => {
		if (!user) return []
		try {
			const response = await fetch('http://localhost:8000/api/favorites/', {
				headers: { Authorization: `Bearer ${token}` },
			})
			if (!response.ok) throw new Error('fetch error')
			const data = await response.json()
			const favArray = Array.isArray(data) ? data : data.favorites || []
			setFavorites(favArray)
			return favArray
		} catch (err) {
			console.error('Get favorites error:', err)
			return []
		}
	}

	const isProductInFavorites = productId => {
		return (
			Array.isArray(favorites) && favorites.some(fav => fav.id === productId)
		)
	}

	const toggleFavorite = async productId => {
		if (!user) {
			alert('Sign in for adding to favorites')
			return false
		}

		const isCurrentlyFavorite = isProductInFavorites(productId)
		try {
			const method = isCurrentlyFavorite ? 'DELETE' : 'POST'
			const response = await fetch(
				`http://localhost:8000/api/favorites/${productId}`,
				{
					method,
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			if (!response.ok) throw new Error('Fetch error')

			setFavorites(prev =>
				isCurrentlyFavorite
					? prev.filter(fav => fav.id !== productId)
					: [...prev, { id: productId }]
			)
			return true
		} catch (err) {
			console.error('Favorite Error:', err)
			alert('Reload favorites error')
			return false
		}
	}

	useEffect(() => {
		if (user) getFavorites()
	}, [user])

	return { favorites, toggleFavorite, isProductInFavorites, getFavorites }
}
