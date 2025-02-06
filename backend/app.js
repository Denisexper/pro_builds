import cors from 'cors';
import express from 'express';
import connect from './src/config/connection.js';
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';

const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // Cambia el origen al del frontend
    credentials: true // Permitir el uso de credenciales (cookies, tokens, etc.)
  }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`)
})

connect()
app.use('/api', productRoutes)
app.use('/app', userRoutes)

//para connectar el backend con el frontend es necesario utilizar cors "intercambio de recursos de origen cruzados"

