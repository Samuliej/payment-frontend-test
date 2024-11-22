import React from 'react'

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductListProps {
    addToCart: (product: Product) => void
}

const products: Product[] = [
    { id: 1, name: 'T-shirt', price: 1500 },
    { id: 2, name: 'Jeans', price: 5000 },
    { id: 3, name: 'Hat', price: 2500 }
]

const ProductList: React.FC<ProductListProps> = ({ addToCart }) => (
    <div>
    <h2>Products</h2>
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} - ${(product.price / 100).toFixed(2)}
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </li>
      ))}
    </ul>
  </div>
)

export default ProductList