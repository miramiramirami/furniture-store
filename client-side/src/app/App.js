import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AdminDashBoard from '../admin/AdminDashBoard/AdminDashBoard'
import Cart from '../components/Cart/Cart'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { CartProvider, useCart } from '../contexts/CartContext'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/ResigterPage'
import CategoriesPage from '../pages/categories/CategoriesPage'
import CategoryPage from '../pages/categories/CategoryPage'
import CreateOrderPage from '../pages/CreateOrder/CreateOrderPage'
import ExplorerPage from '../pages/ExplorerPage'
import FavoritesPage from '../pages/FavoritesPage'
import OrderPage from '../pages/OrderPage'
import ProductPage from '../pages/ProductPage'
import ProfilePage from '../pages/ProfilePage'
import ProtectedRoute from '../utils/ProtectedRoute'
import './App.css'
import { MainPage } from './main-page/MainPage'
import styles from './Main.module.scss'
import cartIcon from './static/images/cart.png'
import favoriteIcon from './static/images/favorite.png'
import profileIcon from './static/images/profile.png'
import quitIcon from './static/images/quit.png'

function Navigation() {
	const { user, logout } = useAuth()
	const { getTotalItems, isCartOpen, openCart, closeCart } = useCart()
	const totalCartItems = getTotalItems()

	return (
		<nav className={styles.nav}>
			<div className={user ? styles.logoWithUser : styles.logoWithoutUser}>
				<Link to='/'>LessNoise</Link>
			</div>

			<div className={styles.navLinks}>
				<Link to='/products'>Catalog</Link>
				<Link to='/categories'>Categories</Link>
				<Link to='/'>Contacts</Link>
			</div>

			<div className={styles.userActions}>
				{user ? (
					<>
						<Link to='/favorites'>
							<img src={favoriteIcon} alt='' />
						</Link>
						<button onClick={openCart}>
							<div className={styles.cart}>
								<img src={cartIcon} alt='' />
								{totalCartItems > 0 && (
									<div className={styles.totalCartItems}>{totalCartItems}</div>
								)}
							</div>
						</button>
						<Cart isOpen={isCartOpen} onClose={closeCart} />
						<Link to='/profile'>
							<img src={profileIcon} alt='' />
						</Link>
						<button onClick={logout}>
							<img src={quitIcon} alt='' />
						</button>
					</>
				) : (
					<>
						<Link to='/login'>Sign in</Link>
						<Link to='/register'>Sign up</Link>
					</>
				)}
			</div>
		</nav>
	)
}

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<Router>
					<Navigation />

					<Routes>
						<Route path='/' element={<MainPage />} />
						<Route path='/products' element={<ExplorerPage />} />

						<Route
							path='/create-order'
							element={
								<ProtectedRoute>
									<CreateOrderPage />
								</ProtectedRoute>
							}
						/>

						<Route path='/products/:productId' element={<ProductPage />} />

						<Route
							path='/profile/orders/:orderId'
							element={
								<ProtectedRoute>
									<OrderPage />
								</ProtectedRoute>
							}
						/>

						<Route path='/categories' element={<CategoriesPage />} />

						<Route path='/categories/:categoryId' element={<CategoryPage />} />

						<Route
							path='/favorites'
							element={
								<ProtectedRoute>
									<FavoritesPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/profile'
							element={
								<ProtectedRoute>
									<ProfilePage />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/admin'
							element={
								<ProtectedRoute adminRequired={true}>
									<AdminDashBoard />
								</ProtectedRoute>
							}
						/>
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
					</Routes>
				</Router>
			</CartProvider>
		</AuthProvider>
	)
}

export default App
