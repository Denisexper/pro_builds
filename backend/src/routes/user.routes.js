import express from 'express';
import UserController from "../controllers/user.controller.js";
import { verifyToken } from '../middleware/aut.middleware.js';

const usercontroll = new UserController();

const app = express.Router()

//rutas privadas utilizan jwt
app.post("/create-user", usercontroll.createUser)
app.get("/get-users", usercontroll.getAllUsers)
app.get("/get-user/:id", usercontroll.getUser)
app.put("/update-user/:id", usercontroll.updateUser)
app.delete("/delete-user/:id", usercontroll.deleteUser)

//Login user ruta publica no usa jwt
app.post("/register", usercontroll.register)
app.post("/login", usercontroll.login)

//forgot and reeset password
app.post('/forgot-password', usercontroll.forgotPassword)
app.post('/reset-password', usercontroll.reesetPassword)

export default app;

//aqui tambien podemos agregarle middlewares a las rutas 