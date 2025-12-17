import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useFavorites } from '../../hooks/favorites/useFavorites'
import starBlack from './images/fav.png'
import star from './images/fav1.png'
import styles from './ProductCard.module.scss'

export function ProductCard({ product }) {
	const { user } = useAuth()
	const { toggleFavorite, isProductInFavorites, favorites } = useFavorites()
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		setIsFavorite(isProductInFavorites(product.id))
	}, [favorites, product.id])

	const handleFavoriteClick = async () => {
		if (!user) return alert('Sign in for adding favorites')

		const success = await toggleFavorite(product.id)
		if (!success) alert('Add to favorite error')
	}

	const imageUrl =
		product.images && product.images.length > 0
			? `http://127.0.0.1:8000${product.images[0].url}`
			: 'http://127.0.0.1:8000/static/not_image.png'

	return (
		<div className={styles.card}>
			<div className={styles.imageWrapper}>
				<img src={imageUrl} alt={product.title} className={styles.fadeImage} />

				<div className={styles.overlay}></div>
				<div className={styles.info}>
					<div className={styles.centralInfo}>
						<h4 className={styles.title}>{product.title}</h4>
						<span className={styles.price}>{product.price} руб.</span>
						<Link to={`/products/${product.id}`} className={styles.moreButton}>
							more
						</Link>
					</div>

					<div className={styles.favButton}>
						<button onClick={handleFavoriteClick}>
							{isFavorite ? (
								<img src={starBlack} alt='black-star' width={32} height={32} />
							) : (
								<img src={star} alt='white-star' width={32} height={32} />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
