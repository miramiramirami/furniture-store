import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import styles from './CreateOrderPage.module.scss'

export default function CreateOrderPage() {
	const { getTotalPrice } = useCart()
	const { user } = useAuth()
	const [cart, setCart] = useState([])

	useEffect(() => {
		const cartString = localStorage.getItem('cart')
		setCart(cartString ? JSON.parse(cartString) : [])
	}, [])

	const totalPrice = getTotalPrice()

	const [products, setProducts] = useState({})
	const [loadingProducts, setLoadingProducts] = useState(true)

	useEffect(() => {
		if (cart.length === 0) {
			setLoadingProducts(false)
			return
		}

		const fetchProducts = async () => {
			try {
				const productEntries = await Promise.all(
					cart.map(async item => {
						try {
							const res = await fetch(
								`http://127.0.0.1:8000/api/products/${item.id}`
							)
							if (!res.ok) throw new Error('Product not found')
							const data = await res.json()
							return [item.id, data]
						} catch (e) {
							console.error(e)
							return [item.id, null]
						}
					})
				)

				setProducts(Object.fromEntries(productEntries))
			} finally {
				setLoadingProducts(false)
			}
		}

		fetchProducts()
	}, [cart])

	const [address, setAddress] = useState('')
	const [phone, setPhone] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const handlePhoneChange = e => {
		const digits = e.target.value.replace(/\D/g, '')
		if (digits.length <= 11) setPhone(digits)
	}

	const handleCreateOrder = async () => {
		if (!user) {
			setError('Требуется авторизация')
			return
		}

		if (cart.length === 0) {
			setError('Корзина пуста')
			return
		}

		if (!address || address.length < 5) {
			setError('Введите корректный адрес доставки')
			return
		}

		if (phone.length !== 11) {
			setError('Телефон должен содержать 11 цифр')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const orderData = {
				address,
				phone,
				items: cart.map(item => ({
					product_id: item.id,
					price: item.price,
					quantity: item.quantity,
				})),
			}

			const token = localStorage.getItem('access_token')

			const res = await fetch('http://127.0.0.1:8000/api/orders/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(orderData),
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.detail || `Ошибка сервера: ${res.status}`)
			}

			localStorage.removeItem('cart')
			window.location.href = data.payment_url
		} catch (err) {
			setError(err.message || 'Неизвестная ошибка')
			setLoading(false)
		}
	}

	return (
		<div className={styles.createContiner}>
			<h2 className={styles.orderHeader}>Оформление заказа</h2>

			{cart.length === 0 && <div>Корзина пуста</div>}

			<div className={styles.orderInfo}>
				<label>Адрес доставки</label>
				<input
					type='text'
					value={address}
					onChange={e => setAddress(e.target.value)}
					placeholder='Город, улица, дом, квартира'
					className={styles.address}
				/>

				<label>Телефон для связи</label>
				<input
					type='tel'
					value={phone}
					onChange={handlePhoneChange}
					placeholder='79991234567'
				/>
			</div>

			<div className={styles.orderItemsGrid}>
				{loadingProducts && <div>Загрузка товаров...</div>}

				{cart.map(item => {
					const product = products[item.id]

					if (!product) {
						return <div key={item.id}>Товар не найден</div>
					}

					return (
						<Link
							to={`/products/${product.id}`}
							key={item.id}
							className={styles.orderItem}
						>
							<p>{product.title}</p>
							<img
								src={`http://127.0.0.1:8000${product.images?.[0].url}`}
								alt={product.title}
								className={styles.productImage}
							/>
							<p>Кол-во: {item.quantity}</p>
							<p>Цена: {item.price}.00 руб</p>
						</Link>
					)
				})}
			</div>

			<div className={styles.totalPrice}>
				Сумма заказа: {totalPrice}.00 руб.
			</div>

			{error && <div style={{ color: 'red' }}>Ошибка: {error}</div>}

			<button
				onClick={handleCreateOrder}
				disabled={loading || cart.length === 0}
				className={styles.createOrderButton}
			>
				{loading ? 'Создание заказа...' : 'Оформить заказ'}
			</button>
		</div>
	)
}
