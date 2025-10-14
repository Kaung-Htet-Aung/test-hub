import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

interface GenerateQuestionsRequest {
  jobField: string;
  language: string;
  experienceLevel: string;
  numberOfQuestions: number;
}

export const generateQuestions = async (req: Request, res: Response) => {
  try {
    const {
      jobField,
      language,
      experienceLevel,
      numberOfQuestions,
    }: GenerateQuestionsRequest = req.body;

    if (!jobField || !language || !experienceLevel || !numberOfQuestions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (numberOfQuestions < 1 || numberOfQuestions > 20) {
      return res
        .status(400)
        .json({ error: "Number of questions must be between 1 and 20" });
    }

    const genAI = new GoogleGenerativeAI(
      "AIzaSyAeFTiS_X_tOYbt2RudCrSWUzZwtGxcyRM"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate ${numberOfQuestions} technical interview questions for a ${experienceLevel} level ${language} developer in the ${jobField} field.

Format the response as a valid JSON array. Example:
[
  {
    "question": "Question text",
    "type": "multiple-choice|short-answer|coding",
    "difficulty": "easy|medium|hard",
    "options": ["A","B","C","D"],
    "correctAnswer": "Correct answer",
    "explanation": "Explain why",
    "points": 3
  }
]

Respond ONLY with valid JSON — no markdown, no commentary.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    console.log(text);
    // ✅ Clean up extra text, markdown, or prefaces
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^[^{[]+/, "") // remove any text before the JSON array/object
      .replace(/[^}\]]+$/, ""); // remove any text after JSON

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", err);
      console.error("Raw text received:", text.slice(0, 500)); // show a snippet
      return res
        .status(500)
        .json({ error: "Failed to parse Gemini JSON output. Try again." });
    }

    if (!Array.isArray(questions)) {
      return res
        .status(500)
        .json({ error: "Gemini response was not an array of questions." });
    }

    return res.status(200).json({ questions });
  } catch (error: any) {
    console.error("Error generating questions:", error);
    return res.status(500).json({
      error: "Failed to generate questions.",
      details: error.message,
    });
  }
};
