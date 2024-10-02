// components/Student.js
"use client"




// /pages/student.js

import { useState, useEffect } from 'react';

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const StudentPage = () => {
  const [quizId, setQuizId] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const joinQuiz = () => {
    socket.emit('joinQuiz', { quizId }); // Emit an event to join the quiz
  };

  useEffect(() => {
    socket.on('quizStarted', (data) => {
      setQuizStarted(true);
      setQuizData(data); // Set quiz data received from admin
      console.log('Quiz started: ', data);
    });

    return () => {
      socket.off('quizStarted'); // Clean up the listener on unmount
    };
  }, []);

  return (
    <div>
      <h1>Student Quiz Page</h1>
      {!quizStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter Quiz ID"
            onChange={(e) => setQuizId(e.target.value)}
          />
          <button onClick={joinQuiz}>Join Quiz</button>
        </div>
      ) : (
        <h2>Quiz Started: {quizData.title} with duration {quizData.duration} minutes</h2>
      )}
    </div>
  );
};

export default StudentPage;


