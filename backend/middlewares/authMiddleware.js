import jwt from 'jsonwebtoken';
 import { Admin } from '../models/adminModel.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  // Check if the token is in the cookies
  if (req.cookies.token) {
    token = req.cookies.token;
    

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Find admin by ID and attach to request
      req.admin = await Admin.findById(decoded._id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
