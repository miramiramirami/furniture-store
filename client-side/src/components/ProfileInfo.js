import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserOrders } from '../hooks/orders/useOrders'
import style from './ProfileInfo.module.scss'

export default function Profile() {
	const { user, logout } = useAuth()
	const { orders, loading, error } = useUserOrders()

	return (
		<div className={style.profileContainer}>
			<h2 className={style.profileHeader}>Profile</h2>

			<div className={style.profileInfo}>
				<h4 className={style.profileEmail}>{user.email}</h4>

				{user.isAdmin ? (
					<a className={style.profileButton} href='/admin'>
						admin page
					</a>
				) : (
					<button className={style.profileButton} onClick={logout}>
						logout
					</button>
				)}
			</div>

			<div>
				<h1 className={style.profileHeader}>Orders</h1>
				{loading && <p>Loading orders...</p>}
				{orders.length === 0 && !loading && <p>No orders yet</p>}
				{error && <p style={{ color: 'red' }}>{error}</p>}

				<ul>
					{orders.map(order => (
						<Link to={`orders/${order.id}`}>
							<li className={style.order} key={order.id}>
								<p>Заказ #{order.id}</p>
								<p>Цена: {order.amount} RUB </p>
								<p>Статус: {order.status}</p>
							</li>
						</Link>
					))}
				</ul>
			</div>
		</div>
	)
}
