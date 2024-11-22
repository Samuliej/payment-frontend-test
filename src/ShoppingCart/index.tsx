import React from 'react'

interface Product {
    id: number;
    name: string
    price: number
}

interface CartItem extends Product {
    quantity: number
}

interface ShoppingCartProps {
    cart: CartItem[];
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    total: number;
    shippingCost: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, updateQuantity, removeFromCart, total, shippingCost }) => (
    <div>
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
            <p>Your cart is empty.</p>
        ) : (
            <>
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            {item.name} - ${(item.price / 100).toFixed(2)} x {item.quantity}
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                min="1"
                            />
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <div>
                    <h3>Subtotal: ${((total - shippingCost) / 100).toFixed(2)}</h3>
                    <h3>Shipping: ${(shippingCost / 100).toFixed(2)}</h3>
                    <h3>Total: ${(total / 100).toFixed(2)}</h3>
                </div>
            </>
        )}
    </div>
);
  
export default ShoppingCart;