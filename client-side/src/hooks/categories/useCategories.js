import { useEffect, useState } from 'react'

export function useCategories() {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const getCategories = async () => {
		try {
			setLoading(true)
			setError(null)

			const response = await fetch('http://127.0.0.1:8000/api/categories')
			if (!response.ok) {
				throw new Error('get categories error')
			}

			const data = await response.json()
			setCategories(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getCategories()
	}, [])

	return { categories, loading, error, getCategories }
}
