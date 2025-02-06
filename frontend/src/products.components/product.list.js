import React, { useState, useEffect } from "react";
import { useCart } from "../products.components/cart.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useCart()
  const navigate = useNavigate();
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if(!token) {
      console.log("token not found redirectng to login")
      navigate("/")
    }

    try {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role)
      console.log("User role", decodedToken.role);
    } catch (error) {
      console.log("error decoding token", error)
      navigate("/")
    }
    
    fetch("http://localhost:8080/api/getAll-product", {
      method: "GET",
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.products)) {

          const productsWithCorrectIds = data.products.map(product => ({
            ...product,
            id: typeof product.id === 'number' ? product.id : parseInt(product.id, 10),
          }));
          setProducts(productsWithCorrectIds);
        } else {
          throw new Error('Formato de respuesta inesperado');
        }
      })
      .catch(err => setError(err.message));
  }, [navigate]);

  const handleAddToCart = (product) => {
    addToCart(product);  // Usar la función del contexto para agregar al carrito

    Swal.fire({
      title: 'Producto agregado al carrito',
      text: 'El producto ha sido agregado correctamente',
      icon: 'success'
    });
  };

  const handleCreateProduct = () => {
    navigate("/create") // ruta para dirigir al create-product
  }

  const handleUpdateProduct = (id) => {
    navigate(`/update/${id}`) // ruta para dirigir al update-product
  }

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/delete-product/${id}`, {
        method: "DELETE",
      });
      if (!response.ok){
        throw new Error('failed to delete')
        
      }
      setProducts(products.filter(product => product._id !== id))

      Swal.fire({
        title: 'Producto eliminado',
        text: 'El producto ha sido eliminado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
      })
    } catch (error) {
      console.error("error deleting product", error);
    }
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-center text-gray-700 mb-10">Product List</h1>
      {error && <p>{error}</p>}
      {role === 'admin' && (
        <div className="text-center mb-8">
          <button
            onClick={handleCreateProduct}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Crear Producto
          </button>
        </div>        
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={product.id || index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-xl font-semibold text-gray-800">${product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4 w-full"
              >
                Agregar al carrito
              </button>
              {role === "admin" && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleUpdateProduct(product._id)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 w-1/2 mr-2"
                  >
                    Editar Producto
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-1/2 ml-2"
                  >
                    Eliminar Producto
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default ProductList;
