import Quiz from '../models/quizModel.js';
import { v4 as uuidv4 } from 'uuid';

// Create Quiz
export const createQuiz = async (req, res) => {
  const { title, description, questions } = req.body;
  const adminId = req.admin.id; // Assuming `req.admin` is set by auth middleware

  try {
    const quiz = new Quiz({
      title,
      description,
      questions,
      admin: adminId,
      quizId: uuidv4(), // Generates unique ID for the quiz
    });

    await quiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
