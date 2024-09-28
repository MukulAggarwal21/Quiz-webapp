import mongoose from 'mongoose';

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // Reference to Question model
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  fastestFinish: {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    time: {
      type: Number, // Time in seconds
    },
  },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
