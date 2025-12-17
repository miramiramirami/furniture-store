export async function createProduct(formData, token) {
	const response = await fetch('http://127.0.0.1:8000/admin/products', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail || 'create product error')
	}

	return response.json()
}

export async function editProduct(id, formData, token) {
	const response = await fetch(`http://127.0.0.1:8000/admin/products/${id}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.detail || 'edit product error')
	}

	return response.json()
}

export async function deleteProduct(id, token) {
	try {
		const response = await fetch(`http://127.0.0.1:8000/admin/products/${id}`, {
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

export async function getLatestProducts() {
	const res = await fetch('http://127.0.0.1:8000/api/products/latest')

	if (!res.ok) throw new Error('Failed to load latest products')

	return await res.json()
}
