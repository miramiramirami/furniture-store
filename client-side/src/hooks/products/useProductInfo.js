import { useEffect, useState } from 'react'

export function useProductInto(productId) {
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await fetch(
					`http://127.0.0.1:8000/api/products/${productId}`
				)
				if (!response.ok) throw new Error('Product not found')

				const productData = await response.json()
				setProduct(productData)
			} catch (error) {
				console.error('Product Error:', error)
			} finally {
				setLoading(false)
			}
		}

		if (productId) {
			fetchProduct()
		}
	}, [productId])

	return { product, loading }
}
