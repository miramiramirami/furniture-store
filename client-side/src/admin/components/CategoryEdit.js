import { useEffect, useState } from 'react'
import { editCategory } from '../../api/categoryApi'
import '../../app/Main.module.scss'

export default function CategoryEdit({ id }) {
	const token = localStorage.getItem('access_token')

	const [form, setForm] = useState({
		title: '',
		description: '',
	})

	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [updatedStatus, setUpdatedStatus] = useState('')

	useEffect(() => {
		if (!id) return

		const fetchCategory = async () => {
			const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`)
			const data = await res.json()
			setForm({
				title: data.title,
				description: data.description,
			})
		}

		fetchCategory()
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

			files.forEach(file => {
				formData.append('files', file)
			})

			await editCategory(id, formData, token)
		} catch (error) {
			setError(error?.message || 'Category update Error')
		}

		setLoading(false)
		setUpdatedStatus('Category was updated')
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Edit Category</h2>
			{error && <div>{error}</div>}
			{updatedStatus.length > 0 && <h3>{updatedStatus}</h3>}

			<label>Title</label>
			<input name='title' value={form.title} onChange={handleChange} required />
			<label>Description</label>
			<input
				name='description'
				value={form.description}
				onChange={handleChange}
			/>

			<label>Image: </label>
			<input type='file' multiple onChange={handleFilesChange} />

			<button disabled={loading}>{loading ? 'Loading...' : 'Update'}</button>
		</form>
	)
}
