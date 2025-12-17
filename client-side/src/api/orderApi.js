export async function deleteOrder(id, token) {
	try {
		const res = await fetch(`http://127.0.0.1:8000/admin/orders/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!res.ok) {
			const data = await res.json()
			throw new Error(data.detail || 'Delete failed')
		}

		return true
	} catch (error) {
		throw new Error(error.message)
	}
}
