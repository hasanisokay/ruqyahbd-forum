'use server'
import jwt from 'jsonwebtoken';

const generateToken = async (payload) => {
  const jwtSecret = process.env.SOCKET_SECRET_TOKEN;
  const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
  return token;
};

export default generateToken;