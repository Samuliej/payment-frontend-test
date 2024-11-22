import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import ProductList from './ProductList/ProductList';
import ShoppingCart from './ShoppingCart';

if (!import.meta.env.VITE_STRIPE_TEST_KEY) {
  throw new Error('Missing Stripe public key');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_TEST_KEY);

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const calculateTotal = (): number => {
    const itemsTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    // Only add shipping cost if there are items in the cart
    const shippingCost = cart.length > 0 ? 5 : 0;
    return itemsTotal + shippingCost;
  };


  return (
    <div>
      <ProductList addToCart={addToCart} />
      <ShoppingCart
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={calculateTotal()}
        shippingCost={cart.length > 0 ? 5 : 0}
      />
      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={calculateTotal()} />
      </Elements>
    </div>
  );
};

export default App;
