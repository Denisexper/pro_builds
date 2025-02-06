import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function UpdateProduct () {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        const fetchProductData = async () => {
           console.log("id del producto", id)
           
           try {
            const response = await fetch(`http://localhost:8080/api/get-product/${id}`)

            const data = await response.json()

            console.log("inf producto", data)

            if(response.ok) {
                setProduct({
                    name: data.product.name,
                    price: data.product.price,
                    description: data.product.description,
                    image: data.product.image
                })
            }
            else {
                console.log("error")
            }
           } catch (error) {
            console.error(error)
           }
        }
        fetchProductData()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target

        setProduct((preveProducts) => ({
            ...preveProducts,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        try {
            const response = await fetch(`http://localhost:8080/api/update-product/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
    
            const data = await response.json()

            Swal.fire({
                title: 'Producto actualizado',
                icon: 'success',
                confirmButtonText: 'agree'
            })
    
            console.log("data", data)
    
            navigate("/dashboard")
    
        } catch (error) {
            console.log("Error", error)
        }
}



return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Actualizar Producto</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
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
            value={product.price}
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
            value={product.description}
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
            value={product.image}
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
            Actualizar Producto
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

export default UpdateProduct;