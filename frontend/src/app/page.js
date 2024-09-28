"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState } from "react";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export default function Home() {
  const [data, setData] = useState([]);

  async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "HELLO" }],
        },
        {
          role: "model",
          parts: [{ text: "Hello there! How can I assist you today?" }],
        },
      ],
    });

    // Modify the prompt to request a proper JSON response
    const formattedPrompt = `Generate 20 multiple choice questions about "${prompt}" with 4 answer options each. Each question should have 4 options numbered 1, 2, 3, and 4, and specify one correct answer. Return the result in this format as an array of JSON objects, each having "question", "option1", "option2", "option3", "option4", and "correctAnswer" without any additional characters or formatting.`;

    const result = await chat.sendMessage(formattedPrompt);
    const responseText = result.response.text(); // Get the response text

    // Log the raw response
    console.log("Raw AI response:", responseText);

    // Remove any unnecessary characters (like backticks) from the response
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();

    // Parse response if it's a stringified JSON
    try {
      const parsedData = JSON.parse(cleanedResponse); // Parse the cleaned response
      setData(parsedData); // Save the parsed data in the state
    } catch (error) {
      console.error("Error parsing AI response:", error);
      alert("The response from the AI was not in the expected format. Please try again.");
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    const prompt = event.target.prompt.value || "";
    runChat(prompt);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <p className="mb-4 text-lg font-semibold">Enter your topic here</p>
        <input
          type="text"
          placeholder="Enter your topic here"
          name="prompt"
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <br />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold p-3 rounded-lg mt-4 hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>

      {data.length > 0 && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Generated Questions</h1>
          <ul className="space-y-6">
            {data.map((questionData, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-lg">
                <p className="text-lg font-semibold mb-2">{`${index + 1}. ${questionData.question}`}</p>
                <ul className="pl-4">
                  <li className="mb-1">1. {questionData.option1}</li>
                  <li className="mb-1">2. {questionData.option2}</li>
                  <li className="mb-1">3. {questionData.option3}</li>
                  <li className="mb-1">4. {questionData.option4}</li>
                </ul>
                <p className="text-green-600 font-bold mt-2">
                  Correct Answer: {questionData.correctAnswer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
