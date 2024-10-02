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
       const admin = await Admin.findOne({email});
       if (!admin ) {
            return res.status(400).json({ msg: 'Invalid email'  , success: false  });
       }
       if(!admin.isPasswordCorrect(password)){

            return res.status(400).json({ msg: 'Invalid email' , success: false  });
       }
       const token = admin.generateAccessToken();
       res.cookie('token', token, {
            httpOnly: true,  // Cookie can only be accessed by the server
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
            // secure: process.env.NODE_ENV === 'production', // Ensure it works only on HTTPS in production
            // sameSite: 'strict',  // Prevents CSRF attacks
        });
        return res.status(200).json({msg:'User Login Sucessfully'  ,success: true });



       
  } catch (error) {
       console.error(error.message);
  return res.status(404).json({msg:error.message  , success: false} );
  }

};
/**
 * Create a new Quiz
 * @param {Object} req - The request object, containing quiz data.
 * @param {Object} res - The response object, used to send back the desired HTTP response.
 */
// Function to generate a random 6-digit unique quiz ID
const generateQuizId = async () => {
  let quizId;
  const existingQuiz = await Quiz.findOne({ quizId }); // Check for uniqueness
  do {
    quizId = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number
  } while (existingQuiz); // Keep generating until a unique ID is found
  console.log(quizId)
  return quizId;
};

// Create Quiz Function
const createQuiz1 = async (req, res) => {
  try {
    const { title, duration, questionsData, startTime, endTime } = req.body;
    console.log("Received Quiz Title:", title);
    
    // Validate input data
    if (!title || !duration || !questionsData || questionsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please provide a valid title, duration, and questions data.",
      });
    }
  
    // Generate a unique quiz ID
    const quizId = await generateQuizId();
    
    // Create questions
    console.dir(questionsData);
    const questions = await Promise.all(
      questionsData.map(async (questionData) => {
        // Ensure to destructure using the correct key
        const { question, option1, option2, option3, option4, correctAnswer } = questionData;
  
        // Create question document
        const questionDoc = new Question({
          question, // Correct variable name
          options: [option1, option2, option3, option4], // Store options in an array
          correctAnswer,
        });
  
        const savedQuestion = await questionDoc.save(); // Save the question
        console.log("Saved Question Document:", savedQuestion);
        return savedQuestion._id; // Return the saved question ID
      })
    );
    
    // Create the quiz
    const quiz = new Quiz({
      quizId,
      title,
      questions,
      createdBy: req.admin._id, // Assuming createdBy is the admin's ID
      startTime,
      endTime,
      duration,
    });
    
    // Save the quiz
    const savedQuiz = await quiz.save();
    console.log("Saved Quiz Document:", savedQuiz);
    
    // Return the created quiz
    return res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      quiz: {
        quizId: savedQuiz.quizId,
        title: savedQuiz.title,
        duration: savedQuiz.duration,
        startTime: savedQuiz.startTime,
        endTime: savedQuiz.endTime,
        questions: savedQuiz.questions,
        createdBy: savedQuiz.createdBy,
        createdAt: savedQuiz.createdAt,
        updatedAt: savedQuiz.updatedAt,
      },
    });
    
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the quiz.",
      error: error.message, // Provide the error message for debugging
    });
  }
};


export { createQuiz1 };
