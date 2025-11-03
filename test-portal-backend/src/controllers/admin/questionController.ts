import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../utils/errorCode";
import { addQuestionService } from "../../services/admin/questionServices";
import { getQuestionSetService } from "../../services/admin/questionServices";

import { ManualQuestionData } from "../../types/question-type";
export const addQuestion = [
  body("title")
    .notEmpty()
    .withMessage("Quiz title is required")
    .isString()
    .withMessage("Title must be a string"),

  // 2. Validate the 'questions' array itself
  body("questions")
    .isArray({ min: 1 })
    .withMessage("There must be at least one question"),

  body("questions.*.id").notEmpty().withMessage("id is required"),
  body("questions.*.question").notEmpty().withMessage("question is required"),
  body("questions.*.type")
    .isString()
    .notEmpty()
    .withMessage("type is required"),
  body("questions.*.difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("difficulty must be easy, medium, or hard"),
  body("questions.*.options")
    .isArray({ min: 4, max: 4 })
    .withMessage("options must be an array with exactly 4 items"),
  body("questions.*.correctAnswer")
    .notEmpty()
    .withMessage("correctAnswer is required"),
  body("questions.*.points")
    .isNumeric()
    .withMessage("points must be a number")
    .custom((value) => value > 0)
    .withMessage("points must be positive"),

  // Controller
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const data = req.body as ManualQuestionData;
    console.log("request data", data);
    if (!Array.isArray(data.questions)) {
      return next(
        createError("Request body must be an array", 400, errorCode.invalid)
      );
    }

    try {
      await addQuestionService(data);

      res.status(201).json({
        success: true,
        message: "Questions created successfully",
      });
    } catch (err: any) {
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        code: err.code || "INTERNAL_ERROR",
      });
    }
  },
];

export const getAllQuestionSets = async (req: Request, res: Response) => {
  try {
    const groups = await getQuestionSetService();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Failed to get groups:", error);
    res.status(500).json({ error: "Unable to fetch groups." });
  }
};
