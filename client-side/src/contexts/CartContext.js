import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
	const [cart, setCart] = useState([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [isCartOpen, setIsCartOpen] = useState(false)

	useEffect(() => {
		const savedCart = localStorage.getItem('cart')
		if (savedCart) {
			try {
				setCart(JSON.parse(savedCart))
			} catch (err) {
				console.error('Loading cart data error:', err)
				setCart([])
			}
		}
		setIsLoaded(true)
	}, [])

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('cart', JSON.stringify(cart))
		}
	}, [cart, isLoaded])

	const addToCart = product => {
		setCart(prev => {
			const existingItem = prev.find(item => item.id === product.id)
			if (existingItem) {
				return prev.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			} else {
				return [...prev, { ...product, quantity: 1 }]
			}
		})
	}

	const removeFromCart = productId => {
		setCart(prev => prev.filter(item => item.id !== productId))
	}

	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) {
			removeFromCart(productId)
			return
		}
		setCart(prev =>
			prev.map(item =>
				item.id === productId ? { ...item, quantity: newQuantity } : item
			)
		)
	}

	const clearCart = () => setCart([])

	const getTotalItems = () =>
		cart.reduce((total, item) => total + item.quantity, 0)
	const getTotalPrice = () =>
		cart.reduce((total, item) => total + item.price * item.quantity, 0)

	const openCart = () => setIsCartOpen(true)
	const closeCart = () => setIsCartOpen(false)

	const value = {
		cart,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getTotalItems,
		getTotalPrice,
		isCartOpen,
		openCart,
		closeCart,
	}

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
	const context = useContext(CartContext)
	if (!context) throw new Error('useCart must be used within CartProvider')
	return context
}
