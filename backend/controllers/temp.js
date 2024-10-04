import { Quiz } from "../models/quizModel.js";
import { Question } from "../models/questionModel.js"; // Assuming question model is in models/questionModel.js

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event when admin starts the quiz
    socket.on('startQuiz', async (quizId) => {
      console.log(`Quiz ${quizId} started`);

      // Fetch all the quiz questions using the UUID
      const quiz = await Quiz.findById("66f92bb6a4e1e65169cf2e95").exec();
      console.log(quiz)
      if (!quiz) {
        throw new Error('Quiz not found');
      }
  
      // Manually fetch all questions by their IDs
      const questionIds = quiz.questions;
      const questions = await Question.find({ _id: { $in: questionIds } }).exec();
    
      console.log("--below questions---");
      console.dir(questions);

      // Check if there are questions available
      if (questions && questions.length > 0) {
        // Emit the quiz started event to all students
        io.emit('quizStarted', { quizId, title: quiz.title, duration: quiz.duration });
        // Emit the first question to all students
        io.emit('newQuestion', questions[0]);

        // Start broadcasting next questions after 15 seconds
        let questionIndex = 1;
        const questionInterval = setInterval(() => {
          if (questionIndex < questions.length) {
            io.emit('newQuestion', questions[questionIndex]);
            questionIndex++;
          } else {
            clearInterval(questionInterval);
            // Quiz finished, broadcast leaderboard
            io.emit('quizEnded');
          }
        }, 15000); // Broadcast next question every 15 seconds
      } else {
        console.error('No questions found for the quiz');
        socket.emit('error', { message: 'No questions found for the quiz.' }); // Emit error to admin
      }
    });

    // Event when a student answers a question
    socket.on('answerQuestion', (data) => {
      const { studentId, questionId, isCorrect, timeTaken, duration } = data;

      // Calculate score: base 100 + (duration - time taken)
      const basePoints = 100;
      const score = basePoints + (duration - timeTaken);

      console.log(`Student ${studentId} answered question ${questionId}. Correct: ${isCorrect}, Score: ${score}`);

      // Emit result to the specific student and update leaderboard
      socket.emit('answerResult', { isCorrect, score });
      io.emit('updateLeaderboard', { studentId, score });
    });

    // Admin sends leaderboard
    socket.on('sendLeaderboard', (leaderboard) => {
      io.emit('receiveLeaderboard', leaderboard);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};
