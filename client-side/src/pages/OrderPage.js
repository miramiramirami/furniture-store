import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUserOrder } from '../hooks/orders/useOrders'
import styles from './OrderPage.module.scss'

export default function OrderPage() {
	const { orderId } = useParams()
	const id = Number(orderId)
	const { order, loading, error } = useUserOrder(id)
	const [products, setProducts] = useState({})
	const [productsLoading, setProductsLoading] = useState(true)

	useEffect(() => {
		const fetchProducts = async () => {
			if (!order) return
			const productEntries = await Promise.all(
				order.items.map(async item => {
					try {
						const res = await fetch(
							`http://127.0.0.1:8000/api/products/${item.product_id}`
						)
						const data = await res.json()
						return [item.product_id, data]
					} catch (e) {
						console.error(e)
						return [item.product_id, null]
					}
				})
			)
			setProducts(Object.fromEntries(productEntries))
			setProductsLoading(false)
		}

		fetchProducts()
	}, [order])

	if (loading || productsLoading) return <div>loading</div>
	if (error) return <div>Ошибка - {error}</div>
	if (!order) return <div>Заказ не найден</div>

	return (
		<div className={styles.orderContainer}>
			<div className={styles.orderNumber}>Номер заказа: {order.id}</div>
			<p>Адрес: {order.address}</p>
			<p>Телефон для связи: {order.phone}</p>

			<div className={styles.orderItemsGrid}>
				{order.items.map(item => {
					const product = products[item.product_id]
					if (!product) return <div key={item.id}>Продукт не найден</div>

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

			<div className={styles.statusBlock}>
				<div className={styles.totalPrice}>Сумма: {order.amount}.00 руб</div>
				<div className={styles.orderStatus}>
					{order.status === 'pending' && 'В обработке...'}
				</div>
			</div>

			<p className={styles.paymentId}>Payment ID: {order.payment_id}</p>
		</div>
	)
}
