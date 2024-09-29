 import { Admin } from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Quiz } from '../models/quizModel.js';
import { Question } from '../models/questionModel.js';

// Register Admin
export const registerAdmin = async (req, res) => {
    try {
     const { email , password , name}= req.body;
     const admin =  await Admin.findOne({email});
     console.log(admin)
     if(admin) {
          return res.status(400).json({ msg: 'Admin already exists' });
     }
     const newAdmin = new Admin({
          email,
          password,
          name
      });
      
     await newAdmin.save();
     console.log("new admin -", newAdmin);
      return res.status(200).json({msg:'User Signup Sucessfully'});
    } catch (error) {
     console.error(error.message);
     return res.status(404).json({msg:error.message});
     
    }


     
};


// Admin login
export const loginAdmin = async (req, res) => {
     try {
          const { email, password } = req.body;
          const admin = await Admin.findOne({email});
          if (!admin ) {
               return res.status(400).json({ msg: 'Invalid email' });
          }
          if(!admin.isPasswordCorrect(password)){

               return res.status(400).json({ msg: 'Invalid email' });
          }
          const token = admin.generateAccessToken();
          res.cookie('token', token, {
               httpOnly: true,  // Cookie can only be accessed by the server
               maxAge: 24 * 60 * 60 * 1000,  // 1 day
               // secure: process.env.NODE_ENV === 'production', // Ensure it works only on HTTPS in production
               // sameSite: 'strict',  // Prevents CSRF attacks
           });
           return res.status(200).json({msg:'User Login Sucessfully'});



          
     } catch (error) {
          console.error(error.message);
     return res.status(404).json({msg:error.message});
     }
  
};









   export const createQuiz = async (req, res) => {
     try {
       const { title, questionsData, startTime, endTime, duration } = req.body;
       const createdBy = req.admin._id; // Admin ID from the middleware
       console.log(createdBy)
       if(!createdBy ||!duration){
          return res.status(404).json({msg:"no params founf", createdBy ,duration})
       }
   
       // Step 1: Create an array to hold question IDs
       const questionIds = [];
   
       // Step 2: Iterate over the questions data from the request
       for (const questionData of questionsData) {
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
       }
   
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
   
       // Step 5: Send the response back
       res.status(201).json({ message: 'Quiz created successfully', quiz });
     } catch (error) {
       console.error(error.message);
       res.status(500).json({ message: 'An error occurred', error: error.message });
     }
   };