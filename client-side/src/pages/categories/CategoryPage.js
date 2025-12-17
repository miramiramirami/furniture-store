import { useParams } from 'react-router-dom'
import { ProductCard } from '../../components/ProductCard/ProductCard'
import styles from '../../components/ProductList.module.scss'
import { useCategoryProducts } from '../../hooks/categories/useCategoryInfo'

export default function CategoryPage() {
	const { categoryId } = useParams()
	const id = Number(categoryId)
	const { products, category, loading } = useCategoryProducts(id)

	if (loading) return <div>Loading category...</div>
	if (!category) return <div>Category not found</div>
	if (products.length === 0) return <div>No products in this category</div>

	return (
		<div className={styles.container}>
			<h2>{category.title}</h2>
			<div className={styles.grid}>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}
