import { Admin } from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Quiz } from '../models/quizModel.js';
import { Question } from '../models/questionModel.js';

/**
 * Register a new Admin
 * @param {Object} req - The request object, containing admin registration data.
 * @param {Object} res - The response object, used to send back the desired HTTP response.
 */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        msg: 'Admin already exists',
        success: false 
      });
    }

    // Hash the password before saving
   

    // Create a new admin instance
    const newAdmin = new Admin({
      email,
      password,
      name,
    });

    await newAdmin.save();
    return res.status(201).json({ 
      msg: 'Admin registered successfully', 
      admin: { email: newAdmin.email, name: newAdmin.name },
      success: true 
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ 
      msg: 'An error occurred during admin registration', 
      error: error.message,
      success: false 
    });
  }
};

/**
 * Admin login
 * @param {Object} req - The request object, containing admin login data.
 * @param {Object} res - The response object, used to send back the desired HTTP response.
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    // Check if the admin exists
    if (!admin) {
      return res.status(400).json({ 
        msg: 'Invalid email or password', 
        success: false 
      });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Invalid email or password', 
        success: false 
      });
    }

    // Generate a token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ 
      msg: 'Login successful', 
      admin: { email: admin.email, name: admin.name },
      success: true 
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ 
      msg: 'An error occurred during login', 
      error: error.message,
      success: false 
    });
  }
};

/**
 * Create a new Quiz
 * @param {Object} req - The request object, containing quiz data.
 * @param {Object} res - The response object, used to send back the desired HTTP response.
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, questionsData, startTime, endTime, duration } = req.body;
    const createdBy = req.admin?._id; // Admin ID from the middleware

    // Validate input data
    if (!title || !questionsData || !Array.isArray(questionsData) || questionsData.length === 0 || !duration || !createdBy) {
      return res.status(400).json({ 
        message: "Invalid parameters. Please ensure all required fields are filled correctly.", 
        errors: { title, questionsData, duration, createdBy },
        success: false 
      });
    }

    // Step 1: Create an array to hold question IDs
    const questionIds = [];

    // Step 2: Iterate over the questions data from the request
    for (const questionData of questionsData) {
      // Validate each question's data
      if (!questionData.question || 
          !questionData.option1 || 
          !questionData.option2 || 
          !questionData.option3 || 
          !questionData.option4 || 
          !questionData.correctAnswer) {
        return res.status(400).json({ 
          message: "Each question must include a question text and all options.", 
          success: false 
        });
      }

      try {
        // Create a new question document
        const question = new Question({
          question: questionData.question,
          options: [
            questionData.option1,
            questionData.option2,
            questionData.option3,
            questionData.option4,
          ],
          correctAnswer: questionData.correctAnswer,
        });

        // Save the question to the database
        const savedQuestion = await question.save();
        questionIds.push(savedQuestion._id); // Add the saved question ID to the array
      } catch (error) {
        // Log the specific error encountered while saving a question
        console.error(`Error saving question "${questionData.question}": ${error.message}`);
        return res.status(500).json({ 
          message: `Error saving question: ${error.message}`, 
          success: false 
        });
      }
    }

    console.log("Question IDs:", questionIds); // Log question IDs for debugging purposes

    // Step 3: Create a new quiz with the saved question IDs
    const quiz = new Quiz({
      title,
      questions: questionIds,
      createdBy,
      startTime,
      endTime,
      duration: Number(duration), // Ensure duration is a Number
    });

    // Step 4: Save the quiz to the database
    await quiz.save();

    // Step 5: Send the response back to the client
    res.status(201).json({ 
      message: 'Quiz created successfully', 
      quiz: { 
        id: quiz._id, 
        title: quiz.title, 
        questions: quiz.questions, 
        createdBy: quiz.createdBy, 
        startTime: quiz.startTime, 
        endTime: quiz.endTime, 
        duration: quiz.duration 
      },
      success: true 
    });
  } catch (error) {
    // Log the overall error encountered while creating the quiz
    console.error(`Error creating quiz: ${error.message}`);
    res.status(500).json({ 
      message: 'An error occurred while creating the quiz', 
      error: error.message,
      success: false 
    });
  }
};
