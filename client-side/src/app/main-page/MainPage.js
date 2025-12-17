import { Link } from 'react-router-dom'
import { LastProductCard } from '../../components/lastProducts/LastProductsCard'
import { useLatestCategories } from '../../hooks/categories/useLatestCategories'
import { useLatestProducts } from '../../hooks/products/useLatestProducts'
import chair from '../static/images/gptimage.png'
import styles from './MainPage.module.scss'

export function MainPage() {
	const { categories, loadingCategory, errorCategory } = useLatestCategories()
	const { products, loadingProduct, errorProduct } = useLatestProducts()

	return (
		<>
			<section className={styles.heroSection}>
				<div className={styles.heroInfo}>
					<h1 className={styles.heroHeader}>Less Noise</h1>
					<h3 className={styles.subtitleHero}>More Life</h3>

					<p className={styles.paragraphHero}>
						Simple Forms. Conscious Living.
					</p>

					<a className={styles.buttonHero} href='/products'>
						shopping
					</a>
				</div>

				<div className={styles.chair}>
					<img src={chair} alt='hero-chair' />
				</div>
			</section>

			<section className={styles.categorySection}>
				<h1 className={styles.categoryHeader}>Just in</h1>

				<div className={styles.categoriesGrid}>
					{categories.map(cat => (
						<Link
							to={`/categories/${cat.id}`}
							key={cat.id}
							className={styles.categoryCard}
						>
							<img
								src={`http://127.0.0.1:8000${cat.images?.[0]?.url}`}
								alt={cat.title}
								className={styles.categoryImage}
							/>
							<div className={styles.overlay}></div>
							<div className={styles.categoryTitle}>{cat.title}</div>
						</Link>
					))}
				</div>
			</section>

			<section className={styles.productsSection}>
				<h1 className={styles.productsHeader}>New</h1>
				<div className={styles.productsGrid}>
					{products.map(prd => (
						<Link
							to={`/products/${prd.id}`}
							key={prd.id}
							className={styles.productCard}
						>
							<LastProductCard
								product={prd}
								image={`http://127.0.0.1:8000${prd.images?.[0]?.url}`}
							/>
						</Link>
					))}
				</div>
			</section>
		</>
	)
}
