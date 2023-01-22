import product from 'ecommerce/schemas/product';
import React, { useContext, createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
const Context = createContext();

export const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantities, setTotalQuantities] = useState(0);
	const [qty, setQty] = useState(1);

	useEffect(() => {
		const cartItemsStorage = localStorage.getItem('cartItems');
		const totalPriceStorage = localStorage.getItem('totalPrice');
		const totalQuantitiesStorage = localStorage.getItem('totalQuantities');
		if (cartItemsStorage) {
			setCartItems(JSON.parse(cartItemsStorage));
			setTotalPrice(JSON.parse(totalPriceStorage));
			setTotalQuantities(JSON.parse(totalQuantitiesStorage));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
		localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
	}, [cartItems]);

	let foundProduct;
	let index;

	const incQty = () => {
		setQty((prevQty) => prevQty + 1);
	};

	const decQty = () => {
		setQty((prevQty) => Math.max(prevQty - 1, 1));
	};

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find((item) => item._id === product._id);
		setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
		setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === product._id) {
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
				}
			});

			setCartItems(updatedCartItems);
		} else {
			product.quantity = quantity;
			setCartItems([...cartItems, { ...product }]);
		}
		toast.success(`${qty} ${product.name} added to the cart.`);
	};

	const toggleCartItemQuantity = (id, value) => {
		foundProduct = cartItems.find((item) => item._id === id);
		index = cartItems.findIndex((item) => item._id === id);
		if (value === 'inc') {
			let newCartItems = [...cartItems];
			newCartItems[index] = { ...foundProduct, quantity: foundProduct.quantity + 1 };
			setCartItems(newCartItems);
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
			setTotalQuantities((prevQuantities) => prevQuantities + 1);
		} else if (value === 'dec') {
			let newCartItems = [...cartItems];
			newCartItems[index] = { ...foundProduct, quantity: foundProduct.quantity - 1 };
			if (foundProduct.quantity > 1) {
				setCartItems(newCartItems);
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevQuantities) => prevQuantities - 1);
			} else {
				setCartItems([...cartItems.filter((item) => item._id !== id)]);
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantities((prevQuantities) => prevQuantities - 1);
			}
		}
	};

	const deleteCartItem = (id) => {
		foundProduct = cartItems.find((item) => item._id === id);
		setCartItems([...cartItems.filter((item) => item._id !== id)]);
		setTotalPrice(
			(prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity,
		);
		setTotalQuantities((prevQuantities) => prevQuantities - foundProduct.quantity);
	};

	return (
		<Context.Provider
			value={{
				showCart,
				cartItems,
				totalPrice,
				totalQuantities,
				qty,
				incQty,
				decQty,
				onAdd,
				setShowCart,
				toggleCartItemQuantity,
				deleteCartItem,
				setCartItems,
				setTotalPrice,
				setTotalQuantities,
			}}>
			{children}
		</Context.Provider>
	);
};

export const useStateContex = () => useContext(Context);
