import { useEffect, useState } from 'react'
import { getLatestCategories } from '../../api/categoryApi'

export function useLatestCategories() {
	const [categories, setCategories] = useState([])
	const [loadingCategory, setLoading] = useState(true)
	const [errorCategory, setError] = useState(null)

	useEffect(() => {
		async function load() {
			try {
				const data = await getLatestCategories()
				setCategories(data)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [])

	return { categories, loadingCategory, errorCategory }
}
