import { Quiz } from '../models/quizModel.js'; // Assuming Mongoose Quiz model
import { Question } from '../models/questionModel.js'; // Assuming Mongoose Question model
import Student from '../models/studentModel.js';
import { AdminNameSpace, io } from '../server.js'; // Import the socket.io instance
import { StudentNameSpace } from '../server.js';
// import { createClient } from 'redis';

// const client = createClient({
//   url: 'redis://localhost:6379'
// });
// client.on('error', err => console.log('Redis Client Error', err));
// await client.connect();


export const handleSocketConnection = (StudentNameSpace) => {
  StudentNameSpace.on('connection', (socket) => {
    console.log('A student connected:', socket.id);

    // // Admin creates room and prepares the quiz
    // socket.on('readyQuiz', async (quizId) => {
    //   const quiz = await Quiz.findById(quizId);
    //   if (!quiz) return socket.emit('error', 'Quiz not found.');

    //   // Emit the roomId to admin
    //   socket.emit('roomCreated', { quizId });

    //   console.log(`Room created for quiz ${quizId} with roomId: ${quizId}`);
    // });

    // Student joins a quiz room
    socket.on('joinQuiz', async (data) => {
      //TODO: show students fellow students joined live.
      const { studentName, quizId } = data;
      const quiz = await Quiz.findOne({quizId});

      if (!quiz || !quiz.quizId) return socket.emit('error', 'Quiz room not available.');

      // Add student to the quiz room
      socket.join(quiz.quizId);
      console.log(`Student ${studentName} joined room ${quiz.quizId}`);
      console.log(`${studentName} joined room ${quiz.quizId}`);
      AdminNameSpace.to(quiz.quizId).emit('studentJoined', {studentName, quizId});
      StudentNameSpace.to(quiz.quizId).emit('studentJoined', {studentName, quizId});
      // // Update leaderboard for the room
      // if (!leaderboard[studentName]) {
      //   leaderboard[studentName] = { score: 0, studentId: studentName };
      // }

      // Emit the room ID back to the student and update leaderboard
      socket.emit('roomJoined', {studentName , roomId: quiz.quizId });
      // io.to(quiz.quizId).emit('updateLeaderboard', Object.values(leaderboard));
    });

    // // Admin starts the quiz
    // socket.on('startQuiz', async (quizId) => {
    //   const quiz = await Quiz.findById(quizId).populate('questions');
    //   if (!quiz || !quiz.quizId) return socket.emit('error', 'Room not found or quiz unavailable.');

    //   const questions = quiz.questions;
    //   if (questions && questions.length > 0) {
    //     io.to(quiz.quizId).emit('quizStarted', { quizId, title: quiz.title });

    //     // Emit the first question
    //     io.to(quiz.quizId).emit('newQuestion', questions[0]);

    //     let questionIndex = 1;
    //     const questionInterval = setInterval(() => {
    //       if (questionIndex < questions.length) {
    //         io.to(quiz.quizId).emit('newQuestion', questions[questionIndex]);
    //         questionIndex++;
    //       } else {
    //         clearInterval(questionInterval);
    //         io.to(quiz.quizId).emit('quizEnded', leaderboard);
    //       }
    //     }, 15000); // Broadcast each question every 15 seconds
    //   }
    // });

    // Student answers a question
    socket.on('answerQuestion', (data) => {
      const { studentId, questionId, isCorrect, timeTaken, duration, roomId } = data;
      const basePoints = 100;
      const score = basePoints + (duration - timeTaken);

      if (!leaderboard[studentId]) leaderboard[studentId] = { score: 0, studentId };
      leaderboard[studentId].score += isCorrect ? score : 0;

      socket.emit('answerResult', { isCorrect, score });
      io.to(roomId).emit('updateLeaderboard', Object.values(leaderboard));
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A student disconnected:', socket.id);
    });
  });
};