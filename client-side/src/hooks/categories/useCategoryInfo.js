import { useEffect, useState } from 'react'

export function useCategoryProducts(categoryId) {
	const [products, setProducts] = useState([])
	const [category, setCategory] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				setLoading(true)

				const [productsRes, categoryRes] = await Promise.all([
					fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/products`),
					fetch(`http://127.0.0.1:8000/api/categories/${categoryId}`),
				])

				if (!productsRes.ok || !categoryRes.ok) {
					throw new Error('Failed to load category or products')
				}

				const productsData = await productsRes.json()
				const categoryData = await categoryRes.json()

				setProducts(productsData)
				setCategory(categoryData)
			} catch (error) {
				console.error('Category products error: ', error)
			} finally {
				setLoading(false)
			}
		}

		if (categoryId) {
			fetchCategoryData()
		}
	}, [categoryId])

	return { products, category, loading }
}
