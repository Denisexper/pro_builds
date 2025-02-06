import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



function CreateProduct() {

    const [ fromData, setFormData ] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...fromData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //obtenemos el token
        const token = localStorage.getItem('token');
        

        if(!token) {
          Swal.fire({
            title: 'Error',
            text: 'No tienes permisos para realizar esta acción',
            icon: "Error",
            confirmButtonText: "OK"
          })
          navigate("/")
          return
        }

        try {
            const response = await fetch("http://localhost:8080/api/create-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${token}`

                },
                body: JSON.stringify(fromData),
            });
            
            const data = await response.json();

            console.log(data);

            if(response.ok) {
                Swal.fire({
                    title: "Product created successfully",
                    icon: "success",
                    confirmButtonText: "OK",
                })
                
                

                navigate("/dashboard")
            } else {
                Swal.fire({
                    title: "Error creating product",
                    icon: "error",
                    confirmButtonText: "OK",
                })
            }
        } catch (error) {
            
            console.error(error);
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Crear Producto</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                Nombre del Producto
              </label>
              <input
                type="text"
                name="name"
                value={fromData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
      
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={fromData.price}
                onChange={handleChange}
                placeholder="Precio del producto"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
      
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                Descripción
              </label>
              <textarea
                name="description"
                value={fromData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
      
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">
                URL de la Imagen
              </label>
              <input
                type="text"
                name="image"
                value={fromData.image}
                onChange={handleChange}
                placeholder="URL de la imagen"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
      
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Crear Producto
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      );
}

export default CreateProduct;