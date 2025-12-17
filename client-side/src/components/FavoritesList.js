import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../app/main-page/MainPage.module.scss'
import { useFavorites } from '../hooks/favorites/useFavorites'
import { LastProductCard } from './lastProducts/LastProductsCard'

export function FavoritesList() {
	const { toggleFavorite, favorites, getFavorites } = useFavorites()
	const [loading, setLoading] = useState(true)
	const [localFavorites, setLocalFavorites] = useState([])

	useEffect(() => {
		const fetchFavorites = async () => {
			const favs = await getFavorites()
			setLocalFavorites(favs)
			setLoading(false)
		}
		fetchFavorites()
	}, [])

	if (loading) return <div>Loading...</div>
	if (!localFavorites || localFavorites.length === 0)
		return <div>No favorites</div>

	const handleDeleteFavorite = async id => {
		const success = await toggleFavorite(id)
		if (success) {
			setLocalFavorites(prev => prev.filter(fav => fav.id !== id))
		} else {
			alert('Favorite delete error')
		}
	}

	return (
		<div className={styles.productsGrid}>
			{localFavorites.map(prd => (
				<div className={styles.favoriteCard}>
					<button
						onClick={() => handleDeleteFavorite(prd.id)}
						className={styles.favoriteDelete}
					>
						Delete
					</button>
					<LastProductCard
						product={prd}
						image={`http://127.0.0.1:8000${prd.images?.[0]?.url}`}
					/>
					<Link className={styles.favLinkProduct} to={`../products/${prd.id}`}>
						On product page >
					</Link>
				</div>
			))}
		</div>
	)
}
