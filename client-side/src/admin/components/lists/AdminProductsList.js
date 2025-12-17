import { useState } from 'react'
import { deleteProduct } from '../../../api/productsApi'
import { useProducts } from '../../../hooks/products/useProducts'
import styles from './AdminList.module.scss'

export default function AdminProductList({ setAdminTab }) {
	const { products, loading, error, getProducts } = useProducts()
	const [deleteTarget, setDeleteTarget] = useState(null)

	const handleDelete = async productId => {
		const token = localStorage.getItem('access_token')
		try {
			await deleteProduct(productId, token)
			getProducts()
			setDeleteTarget(null)
		} catch (err) {
			alert(err.message)
		}
	}

	return (
		<div>
			<div className={styles.listUpside}>
				<h1 className={styles.listTitle}>Products</h1>
				<button
					onClick={() => {
						setAdminTab({ page: 'productCreate' })
					}}
				>
					<span className='text-[24px]'>+</span> Add Product
				</button>
			</div>

			<div className={styles.table}>
				{loading && <div>Loading...</div>}
				{error && <div style={{ color: 'red' }}>Error: {error}</div>}

				{!loading && !error && products.length === 0 && (
					<div>No categories found</div>
				)}

				{!loading &&
					!error &&
					products.map(product => (
						<div key={product.id} className={styles.tableRow}>
							<div className={styles.categoryTitle}>{product.title}</div>

							<div className={styles.categoryTitle}>
								category: {product.category.title}
							</div>

							<div className={styles.productPrice}>{product.price} р</div>

							<div className={styles.actions}>
								<button
									className={styles.editBtn}
									onClick={() =>
										setAdminTab({ page: 'productEdit', id: product.id })
									}
								>
									Edit
								</button>
								<button
									className={styles.deleteBtn}
									onClick={() => setDeleteTarget(product.id)}
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
