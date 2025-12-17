export async function createCategory(formData, token) {
	const response = await fetch('http://127.0.0.1:8000/admin/category', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail || 'create category error')
	}

	return response.json()
}

export async function editCategory(id, formData, token) {
	const response = await fetch(`http://127.0.0.1:8000/admin/category/${id}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail || 'edit category error')
	}

	return response.json()
}

export async function deleteCategory(id, token) {
	try {
		const response = await fetch(`http://127.0.0.1:8000/admin/category/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const data = await response.json()
			throw new Error(data.detail || 'Delete failed')
		}

		return true
	} catch (error) {
		throw new Error(error.message)
	}
}

export async function getLatestCategories() {
	const res = await fetch('http://127.0.0.1:8000/api/categories/latest')

	if (!res.ok) {
		throw new Error('Failed to load latest categories')
	}

	return await res.json()
}
