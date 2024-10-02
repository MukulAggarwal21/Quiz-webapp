import mongoose from 'mongoose';

// Function to generate a 6-digit unique quiz ID


// Quiz Schema
const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    unique: true,
   
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
  
  
  
  next();
});

let Quiz;
try {
  Quiz = mongoose.model("quiz");
} catch (e) {
  Quiz = mongoose.model("quiz", quizSchema);

}

export { Quiz };
