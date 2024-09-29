import mongoose from 'mongoose';

// Function to generate a 5-digit unique quiz ID
const generateQuizId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit number
};

// Quiz Schema
const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    unique: true,
    default: generateQuizId, // Generates the 5-digit quiz ID
  },
  title: {
    type: String,
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Correct reference to Admin model
   
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // Duration in minutes (Change from String to Number)
   
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

// Ensure the `quizId` is unique before saving
quizSchema.pre('save', async function(next) {
  const quiz = this;
  
  if (!quiz.quizId) {
    let unique = false;
    
    while (!unique) {
      const newQuizId = generateQuizId();
      const existingQuiz = await this.constructor.findOne({ quizId: newQuizId });
      
      if (!existingQuiz) {
        quiz.quizId = newQuizId;
        unique = true;
      }
    }
  }
  
  next();
});

let Quiz;
try {
  Quiz = mongoose.model("quiz");
} catch (e) {
  Quiz = mongoose.model("quiz", quizSchema);
}

export { Quiz };
