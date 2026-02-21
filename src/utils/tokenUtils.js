import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateTokens = (userId,role) => {
  const accessToken = jwt.sign(
    { id: userId, role: role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: userId, role: role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
