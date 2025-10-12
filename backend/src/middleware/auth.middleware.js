import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
 // adjust path as needed

//rnd_sK09x9Elp5tXXdDdWIcZPT1tczgl



export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No Token Provided' });
    }

    const decoded = jwt.verify(token,'mysecretkey');

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    console.error('Error in protectRoute middleware:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
