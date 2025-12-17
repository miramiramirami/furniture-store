import { useEffect, useState } from 'react'
import { editProduct } from '../../api/productsApi'
import '../../app/Main.module.scss'

export default function ProductEdit({ id }) {
	const token = localStorage.getItem('access_token')

	const [form, setForm] = useState({
		title: '',
		description: '',
		price: '',
		category_id: '',
	})

	const [files, setFiles] = useState([])
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [updatedStatus, setUpdatedStatus] = useState('')

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch('http://127.0.0.1:8000/api/categories')
				if (!response.ok) throw new Error('Get categories error')
				const data = await response.json()
				setCategories(data)
			} catch (error) {
				setError(error.message)
			}
		}

		fetchCategories()
	}, [])

	useEffect(() => {
		if (!id) return

		const fetchProduct = async () => {
			const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`)
			const data = await res.json()
			setForm({
				title: data.title,
				description: data.description,
				price: data.price,
				category_id: data.category_id,
			})
		}

		fetchProduct()
	}, [id])

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleFilesChange = e => {
		setFiles(Array.from(e.target.files))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			const formData = new FormData()
			formData.append('title', form.title)
			formData.append('description', form.description)
			formData.append('price', Number(form.price))
			formData.append('category_id', form.category_id)

			files.forEach(file => {
				formData.append('files', file)
			})

			await editProduct(id, formData, token)
		} catch (error) {
			setError(error?.message || 'Product create Error')
		}

		setLoading(false)
		setUpdatedStatus('Product was updated')
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Edit Product</h2>
			{error && <div>{error}</div>}
			{updatedStatus.length > 0 && <h3>{updatedStatus}</h3>}

			<label>Title</label>
			<input
				name='title'
				value={form.title}
				onChange={handleChange}
				placeholder='Title'
				required
			/>
			<label>Description</label>
			<input
				name='description'
				value={form.description}
				onChange={handleChange}
				placeholder='Description'
			/>
			<label>Price</label>
			<input
				name='price'
				value={form.price}
				onChange={handleChange}
				placeholder='Price'
				required
			/>

			<label>Category:</label>
			<select
				name='category_id'
				value={form.category_id}
				onChange={handleChange}
				required
			>
				<option value=''>Choose category</option>
				{categories.map(category => (
					<option key={category.id} value={category.id}>
						{category.title}
					</option>
				))}
			</select>

			<label>Images:</label>
			<input type='file' multiple onChange={handleFilesChange} />

			{files.length > 0 && (
				<ul>
					{files.map(file => (
						<li key={file.name}>{file.name}</li>
					))}
				</ul>
			)}

			<button disabled={loading}>{loading ? 'Loading...' : 'Update'}</button>
		</form>
	)
}
