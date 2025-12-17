import { Link } from 'react-router-dom'
import styles from './CategoryCard.module.scss'

export function CategoryCard({ category, size }) {
	const firstImageUrl = category.images?.[0]?.url
	const imageSrc = firstImageUrl
		? `http://127.0.0.1:8000${firstImageUrl}`
		: 'http://127.0.0.1:8000/static/not_image.png'

	return (
		<Link
			to={`/categories/${category.id}`}
			className={`${styles.categoryCard} ${styles[size]}`}
		>
			<img src={imageSrc} alt={category.title} />
			<div className={styles.overlay}></div>
			<div className={styles.categoryTitle}>{category.title}</div>
		</Link>
	)
}
