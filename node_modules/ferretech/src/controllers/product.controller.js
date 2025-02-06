import Product from '../models/products.models.js'

class productControll {

    async createProduct (req, res) {
        try {
            const { name, price, description, image, createdAt } = req.body;

            const productReady = await Product.create({name, price, description, image, createdAt});

            res.status(200).send({
                message: 'Product created successfully',
                productReady
            })

        } catch (error) {
            
           res.status(500).send({
            message: 'Error creating product',
            error: error.message
           })
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await Product.find().select("-__v");
            
            // Verificar si no hay productos
            if (products.length === 0) {
                return res.status(404).send({ message: 'No products found' });
            }
    
            // Enviar los productos en un objeto
            res.status(200).send({
                message: 'Products retrieved successfully',
                products // Enviamos el array de productos
            });
        } catch (error) {
            // Manejar errores de manera más detallada
            res.status(500).send({
                message: 'Error getting all products',
                error: error.message // Devolvemos el mensaje del error para depuración
            });
        }
    }
    
    async getProduct (req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id).select("-__v");

            res.status(200).send({
                message: 'Product retrieved successfully',

                product
            })

        } catch (error) {

            res.status(500).send({

                message: 'Error getting product',

                error: error.message
            })
        }
    }

    async updateProduct (req, res) {
        try {
            const { id } = req.params;

            const { name, price, description, image, createdAt } = req.body;

            const product = await Product.findByIdAndUpdate( id, {name, price, description, image, createdAt}, {new: true})

            res.status(200).send({
                message: 'Product updated successfully',
                product
            })
        } catch (error) {

            res.status(500).send({

                message: 'Error updating product',
                error: error.message
            })
        }
    }
    
    async deleteProduct (req, res) {
        try {
            const { id } = req.params;

            const productDelete = await Product.findByIdAndDelete(id);

            res.status(200).send({

                message: 'Product deleted successfully'
            })
        } catch (error) {
            res.status(500).send({
                message: 'Error deleting product',
                error: error.message
            })
        }
    }
}

export default productControll;