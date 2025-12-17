import { useState } from 'react'
import { createCategory } from '../../api/categoryApi'
import '../../app/Main.module.scss'

export function CategoryCreate() {
	const token = localStorage.getItem('access_token')

	const [form, setForm] = useState({
		title: '',
		description: '',
	})

	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [createdStatus, setCreatedStatus] = useState('')

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

			await createCategory(formData, token)
		} catch (error) {
			setError(error?.message || 'Category create Error')
		}

		setLoading(false)
		setCreatedStatus('Category was created')
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2>Create Category</h2>
			{error && <div>{error}</div>}
			{createdStatus.length > 0 && <h3>{createdStatus}</h3>}

			<label>Title</label>
			<input name='title' value={form.title} onChange={handleChange} required />
			<label>Description</label>
			<input
				name='description'
				value={form.description}
				onChange={handleChange}
			/>

			<label>Images: </label>
			<input type='file' multiple onChange={handleFilesChange} />

			<button disabled={loading}>{loading ? 'Loading...' : 'Create'}</button>
		</form>
	)
}
