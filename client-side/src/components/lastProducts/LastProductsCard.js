import styles from './LastProductsCard.module.scss'

export function LastProductCard({ product, image }) {
	return (
		<>
			<img src={image} alt={product.title} className={styles.image} />
			<h1 className={styles.title}>{product.title}</h1>
			<span className={styles.price}>{product.price} руб.</span>
		</>
	)
}
