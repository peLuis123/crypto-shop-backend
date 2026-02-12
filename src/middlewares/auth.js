import { verifyAccessToken } from '../utils/tokenUtils.js';

export const auth = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token is invalid or expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication error' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ error: 'User access only' });
  }
  next();
};
