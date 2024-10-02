import express from 'express';
import { registerAdmin } from '../controllers/adminController.js';
import { loginAdmin } from '../controllers/adminController.js';
import { createQuiz1 } from '../controllers/adminController.js';

import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin routes for signup and login
router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);

// Admin protected route for creating quiz
// router.post('/quiz', protectAdmin,createQuiz);
// router.post('/quiz1', protectAdmin,createQuiz);
router.post('/quiz2', protectAdmin,createQuiz1);
export default router;
