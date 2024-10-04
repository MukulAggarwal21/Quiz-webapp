import Student from "../models/studentModel.js";
import { Quiz } from "../models/quizModel.js";
import { Question } from "../models/questionModel.js";
import { StudentNameSpace } from "../server.js";
import { handleSocketConnection } from "./studentSocketcontroller.js";

export const joinQuiz = async (req, res)=>{
    try {
        const {studentName, quizId} = req.body;
        const quiz = await Quiz.findOne({quizId});
        console.log("Student Quiz joining request", studentName, quizId);
        handleSocketConnection(StudentNameSpace);
        if (!quiz || !quiz.quizId) {
            return res.status(404).json({msg: 'Quiz not found', success: false});
        }
        return res.status(200).json({msg: 'Quiz found', success: true});
    } catch (error) {
        return res.status(500).json({msg: 'An error occurred while joining the quiz.', error: error.message, success: false});
    }
}