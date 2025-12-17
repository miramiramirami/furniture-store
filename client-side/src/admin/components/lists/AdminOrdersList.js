import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteOrder } from '../../../api/orderApi'
import { useAllOrders } from '../../../hooks/orders/useOrders'
import styles from './AdminList.module.scss'

export default function AdminOrderList({ setAdminTab }) {
	const { orders, loading, error, getOrders } = useAllOrders()
	const [deleteTarget, setDeleteTarget] = useState(null)

	const handleDelete = async orderId => {
		const token = localStorage.getItem('access_token')
		try {
			await deleteOrder(orderId, token)
			getOrders()
			setDeleteTarget(null)
		} catch (err) {
			alert(err.message)
		}
	}

	return (
		<div>
			<div className={styles.listUpside}>
				<h1 className={styles.listTitle}>Orders</h1>
			</div>

			<div className={styles.table}>
				{loading && <div>Loading...</div>}
				{error && <div style={{ color: 'red' }}>Error: {error}</div>}

				{!loading && !error && orders.length === 0 && (
					<div>No orders found</div>
				)}

				{!loading &&
					!error &&
					orders.map(order => (
						<div key={order.id} className={styles.tableRow}>
							<div className={styles.categoryTitle}>Order #{order.id}</div>
							<div className={styles.categoryTitle}>{order.user_email}</div>
							<div className={styles.productPrice}>{order.amount} ₽</div>
							<div className={styles.categoryTitle}>Status: {order.status}</div>

							<div className={styles.actions}>
								<Link
									to={`/profile/orders/${order.id}`}
									className={`${styles.editBtn} ${styles.button}`}
								>
									View
								</Link>
								<button
									className={styles.deleteBtn}
									onClick={() => setDeleteTarget(order.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))}

				{deleteTarget && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<p>Are you sure you want to delete this order?</p>
							<button onClick={() => handleDelete(deleteTarget)}>Yes</button>
							<button onClick={() => setDeleteTarget(null)}>No</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
