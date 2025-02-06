import express from 'express';
import productControll from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/aut.middleware.js';
import { verifyRoleToken } from '../middleware/aut.middleware.js';

const Productcontroll = new productControll();

const app = express.Router();

app.post("/create-product", verifyToken , verifyRoleToken, Productcontroll.createProduct);
app.get("/getAll-product", verifyToken, Productcontroll.getAllProducts);
app.get("/get-product/:id", Productcontroll.getProduct);
app.put("/update-product/:id", Productcontroll.updateProduct);
app.delete("/delete-product/:id", Productcontroll.deleteProduct);



export default app