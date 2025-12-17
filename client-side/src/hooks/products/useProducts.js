import { useEffect, useState } from 'react'

export function useProducts() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const getProducts = async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await fetch('http://127.0.0.1:8000/api/products')
			if (!response.ok) {
				throw new Error('get products error')
			}

			const data = await response.json()
			setProducts(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getProducts()
	}, [])

	return { products, loading, error, getProducts }
}
