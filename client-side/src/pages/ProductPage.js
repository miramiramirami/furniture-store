import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SameProducts from '../components/SameProducts/SameProducts'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useProductInto } from '../hooks/products/useProductInfo'
import styles from './Products.module.scss'
import backButton from './static/images/backButton.png'
import nextButton from './static/images/nextButton.png'

export default function ProductPage() {
	const { productId } = useParams()
	const id = Number(productId)
	const { product, loading } = useProductInto(id)
	const { addToCart, openCart } = useCart()
	const [index, setIndex] = useState(0)
	const { user } = useAuth()

	const categoryId = product?.category?.id ?? null

	if (loading) return <div>Product loading...</div>
	if (!product) return <div>Product not found</div>

	const handleAddToCart = () => {
		if (!user) return alert('Sign in for adding to cart')
		addToCart(product)
		openCart()
	}

	const handleNext = () => {
		if (index === product.images.length - 1) return
		setIndex(prev => prev + 1)
	}

	const handleBack = () => {
		if (index === 0) return
		setIndex(prev => prev - 1)
	}

	return (
		<div className={styles.contentContainer}>
			<Link to='/products' className={styles.backButton}>
				<img src={backButton} alt='backButton' />
				<span>Products</span>
			</Link>

			<div className={styles.productContainer}>
				<div className={styles.productImages}>
					<img
						src={`http://127.0.0.1:8000${product.images?.[index].url}`}
						alt={product.title}
						className={styles.mainImage}
					/>

					<button
						className={`${styles.imageButton} ${
							index === 0 ? styles.buttonNonactive : ''
						} ${styles.leftButton}`}
						onClick={handleBack}
					>
						<img src={backButton} alt='back' />
					</button>

					<button
						className={`${styles.imageButton} ${
							index === product.images.length - 1 ? styles.buttonNonactive : ''
						} ${styles.rightButton}`}
						onClick={handleNext}
					>
						<img src={nextButton} alt='next' />
					</button>
				</div>

				<div className={styles.productInfo}>
					<div className={styles.productCategory}>
						{product.category?.title && (
							<Link to={`/categories/${product.category.id}`}>
								<span>{product.category.title}</span>
							</Link>
						)}
					</div>

					<h1 className={styles.productTitle}>{product.title}</h1>
					<h1 className={styles.productDescriptionTitle}>Описание</h1>
					<p className={styles.productDescription}>{product.description}</p>
					<span className={styles.productPrice}>
						<span>Цена</span> {product.price} руб.
					</span>

					<button className={styles.productButton} onClick={handleAddToCart}>
						To cart
					</button>
				</div>
			</div>

			<SameProducts id={categoryId} productId={Number(productId)} />
		</div>
	)
}
