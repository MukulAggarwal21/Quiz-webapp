import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentQuizID: {
    type: String,
    default: uuidv4, // Unique ID for each student-quiz attempt
    unique: true,
  },
  quizID: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Quiz model
    ref: 'Quiz', // Refers to the Quiz model
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  finishedAt: {
    type: Date,
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
