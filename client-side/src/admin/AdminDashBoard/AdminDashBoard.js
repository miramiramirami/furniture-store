import { useState } from 'react'
import { CategoryCreate } from '../components/CategoryCreate'
import CategoryEdit from '../components/CategoryEdit'
import { AdminCategoriesList } from '../components/lists/AdminCategoriesList'
import AdminOrderList from '../components/lists/AdminOrdersList'
import AdminProductList from '../components/lists/AdminProductsList'
import ProductCreate from '../components/ProductCreate'
import ProductEdit from '../components/ProductEdit'
import styles from './AdminDashBoard.module.scss'

export default function AdminDashBoard() {
	const [adminTab, setAdminTab] = useState({ page: 'orders', id: null })

	return (
		<div className={styles.dashboardContent}>
			<ul className={styles.tabs}>
				<li>
					<button
						className={`${styles.tabBtn} ${
							adminTab.page === 'orders' ? styles.active : ''
						}`}
						onClick={() => setAdminTab({ page: 'orders', id: null })}
					>
						Orders
					</button>
				</li>

				<li>
					<button
						className={`${styles.tabBtn} ${
							adminTab.page === 'products' ? styles.active : ''
						}`}
						onClick={() => setAdminTab({ page: 'products', id: null })}
					>
						Products
					</button>
				</li>

				<li>
					<button
						className={`${styles.tabBtn} ${
							adminTab.page === 'categories' ? styles.active : ''
						}`}
						onClick={() => setAdminTab({ page: 'categories', id: null })}
					>
						Categories
					</button>
				</li>
			</ul>

			<div className={styles.dashboardLists}>
				{adminTab.page === 'orders' && (
					<AdminOrderList setAdminTab={setAdminTab} />
				)}

				{adminTab.page === 'products' && (
					<AdminProductList setAdminTab={setAdminTab} />
				)}

				{adminTab.page === 'productCreate' && <ProductCreate />}

				{adminTab.page === 'productEdit' && <ProductEdit id={adminTab.id} />}

				{adminTab.page === 'categories' && (
					<AdminCategoriesList setAdminTab={setAdminTab} />
				)}

				{adminTab.page === 'categoryCreate' && <CategoryCreate />}

				{adminTab.page === 'categoryUpdate' && (
					<CategoryEdit id={adminTab.id} />
				)}
			</div>
		</div>
	)
}
