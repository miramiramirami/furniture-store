import { useState } from 'react'
import { deleteCategory } from '../../../api/categoryApi'
import { useCategories } from '../../../hooks/categories/useCategories'
import styles from './AdminList.module.scss'

export function AdminCategoriesList({ setAdminTab }) {
	const { categories, loading, error, getCategories } = useCategories()
	const [deleteTarget, setDeleteTarget] = useState(null)

	const handleDelete = async categoryId => {
		const token = localStorage.getItem('access_token')
		try {
			await deleteCategory(categoryId, token)
			getCategories()
			setDeleteTarget(null)
		} catch (err) {
			alert(err.message)
		}
	}

	return (
		<div>
			<div className={styles.listUpside}>
				<h1 className={styles.listTitle}>Categories</h1>
				<button onClick={() => setAdminTab({ page: 'categoryCreate' })}>
					<span className='text-[24px]'>+</span> Add Category
				</button>
			</div>

			<div className={styles.table}>
				{loading && <div>Loading...</div>}
				{error && <div style={{ color: 'red' }}>Error: {error}</div>}

				{!loading && !error && categories.length === 0 && (
					<div>No categories found</div>
				)}

				{!loading &&
					!error &&
					categories.map(category => (
						<div key={category.id} className={styles.tableRow}>
							<div className={styles.categoryTitle}>{category.title}</div>
							<div className={styles.actions}>
								<button
									className={styles.editBtn}
									onClick={() =>
										setAdminTab({ page: 'categoryUpdate', id: category.id })
									}
								>
									Edit
								</button>
								<button
									className={styles.deleteBtn}
									onClick={() => setDeleteTarget(category.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))}

				{deleteTarget && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<p>Are you sure you want to delete this category?</p>
							<button onClick={() => handleDelete(deleteTarget)}>Yes</button>
							<button onClick={() => setDeleteTarget(null)}>No</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
