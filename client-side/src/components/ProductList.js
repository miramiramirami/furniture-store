import { useProducts } from '../hooks/products/useProducts'
import { ProductCard } from './ProductCard/ProductCard'
import styles from './ProductList.module.scss'

export function ProductList() {
	const { products, loading, error } = useProducts()

	if (loading) {
		return <div>Loading</div>
	}

	if (error) {
		return <div>Error - {error}</div>
	}

	if (!products || products.length === 0) return <div>No products</div>

	return (
		<div className={styles.container}>
			<h2 className='mt-4'>Catalog</h2>
			<div className={styles.grid}>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}
