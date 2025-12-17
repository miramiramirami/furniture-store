import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export function useAllOrders() {
	const { user } = useAuth()
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const getOrders = async () => {
		if (!user) return

		try {
			setLoading(true)
			const token = localStorage.getItem('access_token')
			const res = await fetch('http://127.0.0.1:8000/admin/orders', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			if (!res.ok) throw new Error('Failed to load orders')
			const data = await res.json()
			setOrders(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getOrders()
	}, [user])

	return { orders, loading, error, getOrders }
}

export function useUserOrders() {
	const { user } = useAuth()
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!user) return

		const fetchOrders = async () => {
			try {
				setLoading(true)
				const token = localStorage.getItem('access_token')
				const res = await fetch('http://127.0.0.1:8000/api/orders/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				if (!res.ok) throw new Error('Failed to load orders')
				const data = await res.json()
				setOrders(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchOrders()
	}, [user])

	return { orders, loading, error }
}

export function useUserOrder(id) {
	const { user } = useAuth()
	const [order, setOrder] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!user) return

		const fetchOrder = async () => {
			setLoading(true)
			try {
				const token = localStorage.getItem('access_token')
				const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				const data = await res.json()

				if (!res.ok) {
					const msg = data.detail || `Ошибка: ${res.status}`
					throw new Error(msg)
				}

				setOrder(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchOrder()

		if (!order) return
	}, [user, id])

	return { order, loading, error }
}
