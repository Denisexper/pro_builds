import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from '../utils/jwt.js';
import mongoose from "mongoose";

//para proceso de forgot y reseet password
import crypto from "crypto";
import nodemailer from "nodemailer";

//variables de entorno 
import dotenv from 'dotenv'
dotenv.config(); //cargamos variables de entorno


class UserController {

    async createUser(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Validar que la contraseña tenga al menos 8 caracteres
            if (password.length < 8) {
                return res.status(400).send({
                    status: false,
                    message: "Password must be at least 8 characters long"
                });
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear nuevo usuario con la contraseña hasheada
            const newUser = await User.create({ name, email, password: hashedPassword, role });

            res.status(200).send({
                message: "User created successfully",
                newUser
            });

        } catch (error) {
            res.status(500).send({
                message: "Error creating user",
                error: error.message
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find().select("-__v");

            res.status(200).send({

                message: "Users retrieved successfully",
                users
            });
        } catch (error) {
            res.status(500).send({

                message: "Error retrieving users",
                error: error.message
            });
        }
    }

    async getUser(req, res) {
        try {
            const { id } = req.params;

            //validacion para formato correcto de id
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                    message: "Invalid user ID format"
                });
            }

            const user = await User.findById(id).select("-__v");

            //validar si el usuario existe
            if (!user) {
                return res.status(404).send({

                    message: "User not found"
                });
            }
            res.status(200).send({
                message: "User retrieved successfully",
                user
            });
        } catch (error) {
            res.status(500).send({
                message: "Error retrieving user",
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;

            let { name, email, password, role } = req.body;

            // Si el campo password existe, lo hasheamos
            if (password) {
                if (password.length < 8) {

                    return res.status(400).send({
                        message: "Password must be at least 8 characters long",
                    });
                }
                password = await bcrypt.hash(password, 10); // Hasheamos la nueva contraseña
            }

            const updatedUser = await User.findByIdAndUpdate(id, { name, email, password, role }, { new: true });

            res.status(200).send({

                message: "User updated successfully",
                updatedUser
            });
        } catch (error) {
            res.status(500).send({

                message: "Error updating user",
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByIdAndDelete(id);

            res.status(200).send({

                message: "User deleted successfully",
                user
            });
        } catch (error) {
            res.status(500).send({
                message: "Error deleting user",
                error: error.message
            });
        }
    }

    async register (req, res) {
        try {
            const { name, email, password, role } = req.body;
            if(password.length < 8) {
                return res.status(400).send({
                    message: "Password must be at least 8 characters long",
                })
            }
            const hass = await bcrypt.hash(password, 10);

            const user = await User.create({ name, email, password: hass, role });

            const token = generateToken({ id: user._id, email: user.email, role: user.role })

            res.status(201).send({
                message: "User registred successfully",
                user,
                token
            })
        } catch (error) {
            res.status(400).send({
                message: "Error in the process user register",
                error
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).send({
                    message: "Please enter correct credentials"
                });
            }

            // Verificar la contraseña (comparar la ingresada con la hasheada)
            const isMatch = await bcrypt.compare(password, user.password);

            // crear token
            const token = generateToken({ id: user._id, email: user.email, role: user.role})

            if (!isMatch) {
                return res.status(400).send({
                    message: "Incorrect password"
                });
            }


            res.status(200).send({
                message: "User logged in successfully",
                user,
                token
            });
        } catch (error) {
            res.status(400).send({
                message: "Error logging in user",
                error: error.message
            });
        }
    }

    //reseet and updata password

    async forgotPassword(req, res) {
        try {
            
            const { email } = req.body;

            const user = await User.findOne({email});

            if(!user){
                return res.status(404).send({
                    message: "User not found"
                })
            }

            //generar token de recuperacion con crypto
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            //guardamos el token y expiracion en el usuario
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();

            //configuracion del transporte del email nodemail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            })

            //creamos correo electronico
            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL_USER,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the following link, or paste this into your browser to complete the process:\n\n
                    http://${req.headers.host}/reset-password/${resetToken}\n\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            //enviar correo electronico
            await transporter.sendMail(mailOptions);

            res.status(200).send({
                message: "Password reset email sent successfully"
            })


        } catch (error) {
            res.status(500).send({
                message: "Error sending password reset email",
                error:error.message
            })
        }
    }

    async reesetPassword(req, res) {
        try {
            const { token } = req.params;

            const { newPassword } = req.body;

            //buscamos el usuario por el token y verificamos si ha expirado
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            })

            if(!user){
                return res.status(400).send({
                    message: "Invalid or expired password reset token"
                })
            }

            //validar contraseña
            if(newPassword.length < 8){
                return res.status(400).send({
                    message: "Password must be at least 8 characters long"
                })
            }

            //hashear contraseña nueva
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            //actualizar contraseña y limpiar el token
            user.password = hashedPassword
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined
            await user.save();

            res.status(200).send({
                message: "Password reset successfully"
            })

        } catch (error) {
            res.status(500).send({
                message: "Error resetting password",
                error: error.message
            })
        }
    }



}


export default UserController;