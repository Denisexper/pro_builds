import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from "../products.components/cart.js";
import Swal from 'sweetalert2';

const Header = () => {

  const { cart, setCart, removeFromCart } = useCart();
  const [total, setTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cart]);

  const checkout = () => {
    Swal.fire({
      title: '¡Gracias por tu compra!',
      text: 'Tu total es: $' + total,
      icon: 'success',
    });
    // Vaciar el carrito
    setCart([])
    localStorage.removeItem("cart")
  };

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Tienda</h1>
        <div className="relative">
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="flex items-center focus:outline-none">
            <FaShoppingCart size={24} />
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">
              {cart.length}
            </span>
          </button>
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-lg p-4 z-10">
              <h2 className="text-lg font-bold mb-4">Tu carrito de compras</h2>
              {cart.length === 0 ? (
                <p>Aun hay productos en el carrito.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item._id} className="flex justify-between items-center">
                      <span>{item.name} - ${item.price} x {item.quantity}</span>
                      <button
                        onClick={() => {
                          removeFromCart(item._id);
                        }}
                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                      >
                        Eliminar
                      </button>

                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 text-lg font-semibold">
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={checkout}
                  className="mt-6 bg-green-500 text-white py-2 px-6 rounded-lg w-full hover:bg-green-600"
                >
                  Realizar compra
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
