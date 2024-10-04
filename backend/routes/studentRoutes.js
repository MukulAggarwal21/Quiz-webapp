import express from 'express';
import { joinQuiz } from "../controllers/studentController.js";


const router = express.Router();

router.post('/join-quiz', joinQuiz);

export default router;