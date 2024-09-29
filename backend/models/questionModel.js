import mongoose from 'mongoose';

// Question Schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: Number, // Index of the correct answer
    required: true,
  }
}, { timestamps: true });

let Question;
try {
  Question = mongoose.model("question");
} catch (e) {
  Question = mongoose.model("question", questionSchema);
}

export { Question };
