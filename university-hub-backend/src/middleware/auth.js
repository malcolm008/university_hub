import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const ambassadorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ambassador' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Ambassador access required' });
  }
};