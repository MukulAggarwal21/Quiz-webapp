import mongoose from 'mongoose';

// Question Schema
const questionSchema = new mongoose.Schema({
  quizID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4 options'], // Max 4 options
  },
}, { timestamps: true });

// Ensure there are no more than 4 options per question
function arrayLimit(val) {
  return val.length <= 4;
}

const Question = mongoose.model('Question', questionSchema);
export default Question;
