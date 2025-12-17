import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import styles from './Cart.module.scss'

export default function Cart({ isOpen, onClose }) {
	const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
		useCart()

	const handleOverlayClick = e => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const handleKeyDown = e => {
		if (e.key === 'Escape') {
			onClose()
		}
	}

	React.useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className={styles.overlay} onClick={handleOverlayClick}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h1 className={styles.title}>Cart</h1>
					<button className={styles.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				<div className={styles.content}>
					{cart.length === 0 ? (
						<div className={styles.empty}>Cart is empty</div>
					) : (
						<>
							<div className={styles.items}>
								{cart.map(item => (
									<div key={item.id} className={styles.item}>
										<div className={styles.itemInfo}>
											<div className={styles.name}>{item.title}</div>
										</div>

										<div className={styles.quantityControls}>
											<button
												onClick={() =>
													updateQuantity(item.id, item.quantity - 1)
												}
												className={styles.quantityBtn}
											>
												-
											</button>
											<span className={styles.quantity}>{item.quantity}</span>
											<button
												onClick={() =>
													updateQuantity(item.id, item.quantity + 1)
												}
												className={styles.quantityBtn}
											>
												+
											</button>
										</div>

										<div className={styles.itemTotal}>
											{item.price * item.quantity} руб.
										</div>

										<button
											onClick={() => removeFromCart(item.id)}
											className={styles.removeBtn}
										>
											Delete
										</button>
									</div>
								))}
							</div>

							<div className={styles.cartSummary}>
								<div className={styles.total}>
									<span className='text-[14px]'>Total price: </span>
									{getTotalPrice()} руб.
								</div>
								<div className={styles.actions}>
									<button onClick={clearCart} className={styles.clearBtn}>
										Clear
									</button>
									<Link
										to='/create-order'
										onClick={() => onClose()}
										className={styles.checkoutBtn}
									>
										Create order
									</Link>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
