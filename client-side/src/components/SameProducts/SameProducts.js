import { Link } from 'react-router-dom'
import styles from '../../app/main-page/MainPage.module.scss'
import { useCategoryProducts } from '../../hooks/categories/useCategoryInfo'
import { LastProductCard } from '../lastProducts/LastProductsCard'

export default function SameProducts({ id, productId }) {
	const { products, loading } = useCategoryProducts(id)

	if (loading) return null

	const filtered = products.filter(p => p.id !== Number(productId))

	if (filtered.length === 0) return null

	const limitedProducts = filtered.slice(0, 4)

	return (
		<div className={styles.productsSection}>
			<h1 className={styles.productsHeader}>Another</h1>

			<div className={styles.productsGrid}>
				{limitedProducts.map(prod => (
					<Link
						to={`/products/${prod.id}`}
						key={prod.id}
						className={styles.productCard}
					>
						<LastProductCard
							product={prod}
							image={`http://127.0.0.1:8000${prod.images?.[0]?.url}`}
						/>
					</Link>
				))}
			</div>
		</div>
	)
}
