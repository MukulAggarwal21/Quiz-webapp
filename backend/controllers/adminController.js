 import { Admin } from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register Admin
export const registerAdmin = async (req, res) => {
     const { email , password , name}= req.body;
     const admin = Admin.findOne()
};


// Admin login
export const loginAdmin = async (req, res) => {
  
};

