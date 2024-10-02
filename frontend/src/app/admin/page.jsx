"use client"
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const AdminPage = () => {
  // Hardcoded quiz data
  const [quizData] = useState({
    quizId: "62e15f98-bb12-4463-b4f3-d16074546b44", // Unique identifier for the quiz
    title: "Sample Quiz", // Title of the quiz
    questions: [], // Array to hold questions for the quiz
    duration: 10, // Hardcoded quiz duration (e.g., 10 minutes)
    _id: "66fce2bf26aac1934677f0d9", // MongoDB document ID
    createdAt: "2024-10-02T06:05:51.780Z", // Creation timestamp
    updatedAt: "2024-10-02T06:05:51.780Z", // Last updated timestamp
    __v: 0 // Version key for Mongoose
  });

  // State to manage quiz status and leaderboard
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // State to hold leaderboard data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question

  // Function to start the quiz
  const startQuiz = () => {
    socket.emit('startQuiz', quizData.quizId); // Emit an event to start the quiz
    setIsQuizStarted(true);
  };

  // Listen for quiz started event
  useEffect(() => {
    socket.on('quizStarted', (data) => {
      console.log('Quiz started: ', data);
      // Handle any additional logic when the quiz starts if necessary
    });

    // Listen for leaderboard event from the backend
    socket.on('updateLeaderboard', (data) => {
      console.log('Leaderboard updated: ', data);
      setLeaderboard(data); // Update the leaderboard state with the received data
    });

    return () => {
      socket.off('quizStarted'); // Clean up the listener on unmount
      socket.off('updateLeaderboard'); // Clean up leaderboard listener on unmount
    };
  }, []);

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Increment question index
    // Logic to show the next question can go here, if applicable
  };

  return (
    <div>
      <h1>Admin Quiz Dashboard</h1>
      {!isQuizStarted ? (
        <div>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : (
        <div>
          <h2>Quiz Started: {quizData.title}</h2>
          <h3>Leaderboard:</h3>
          <ul>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <li key={index}>{entry.studentName}: {entry.score} points</li>
              ))
            ) : (
              <li>No participants yet.</li>
            )}
          </ul>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
