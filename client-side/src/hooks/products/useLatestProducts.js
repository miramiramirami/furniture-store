import { useEffect, useState } from 'react'
import { getLatestProducts } from '../../api/productsApi'

export function useLatestProducts() {
	const [products, setProducts] = useState([])
	const [loadingProduct, setLoading] = useState(true)
	const [errorProduct, setError] = useState(null)

	useEffect(() => {
		async function load() {
			try {
				const data = await getLatestProducts()
				setProducts(data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [])

	return { products, loadingProduct, errorProduct }
}
