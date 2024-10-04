import { Quiz } from '../models/quizModel.js'; // Assuming Mongoose Quiz model
import { Question } from '../models/questionModel.js'; // Assuming Mongoose Question model
import { io } from '../server.js'; // Import the socket.io instance

let leaderboard = {}; // Track scores of all students
let rooms = {}; // Track room data for each quiz



export const handleSocketConnection = (AdminNameSpace, name) => {
  AdminNameSpace.on('connection', (socket) => {
    console.log('An admin connected:', socket.id);

    // Admin creates room and prepares the quiz
    socket.on('readyQuiz', async (quizId) => {
      const quiz = await Quiz.findOne({quizId});
      if (!quiz) return socket.emit('error', 'Quiz not found.');

      // Emit the roomId to admin
      socket.join(quiz.quizId);
      console.log(`Room created for quiz ${quizId} with roomId: ${quizId}`);
      console.log(`Room joined by admin for quiz ${quizId} with roomId: ${quizId}`);
      io.to(quizId).emit('roomCreated', { quizId });
      io.to(quizId).emit('adminJoined', {name, quizId});
      
    });

    // // Student joins a quiz room
    // socket.on('joinQuiz', async (data) => {
    //   //TODO: show admin the students joined live.

    // });

    // Admin starts the quiz
    socket.on('startQuiz', async (quizId) => {
      const quiz = await Quiz.findById(quizId).populate('questions');
      if (!quiz || !quiz.quizId) return socket.emit('error', 'Room not found or quiz unavailable.');

      const questions = quiz.questions;
      if (questions && questions.length > 0) {
        io.to(quiz.quizId).emit('quizStarted', { quizId, title: quiz.title });

        // Emit the first question
        io.to(quiz.quizId).emit('newQuestion', questions[0]);

        let questionIndex = 1;
        const questionInterval = setInterval(() => {
          if (questionIndex < questions.length) {
            io.to(quiz.quizId).emit('newQuestion', questions[questionIndex]);
            questionIndex++;
          } else {
            clearInterval(questionInterval);
            io.to(quiz.quizId).emit('quizEnded', leaderboard);
          }
        }, 15000); // Broadcast each question every 15 seconds
      }
    });

    // // Student answers a question
    // socket.on('answerQuestion', (data) => {
    //   const { studentId, questionId, isCorrect, timeTaken, duration, roomId } = data;
    //   const basePoints = 100;
    //   const score = basePoints + (duration - timeTaken);

    //   if (!leaderboard[studentId]) leaderboard[studentId] = { score: 0, studentId };
    //   leaderboard[studentId].score += isCorrect ? score : 0;

    //   socket.emit('answerResult', { isCorrect, score });
    //   io.to(roomId).emit('updateLeaderboard', Object.values(leaderboard));
    // });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('An admin disconnected:', socket.id);
    });
  });
};