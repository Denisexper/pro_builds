import jwt from 'jsonwebtoken';

const secretKey = 's3cuR3k3y#123!JwT$';

// Función para generar el token
export const generateToken = (user) => {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
};
