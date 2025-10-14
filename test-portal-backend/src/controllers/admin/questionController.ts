import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../utils/errorCode";
import { addQuestions } from "../../services/admin/addQuestions";
interface ManualQuestionData {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "coding";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}
export const addQuestion = [
  body().isArray().withMessage("Request body must be an array of questions"),
  body("*.id").notEmpty().withMessage("id is required"),
  body("*.question").notEmpty().withMessage("question is required"),
  body("*.type").isString().notEmpty().withMessage("type is required"),
  body("*.difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("difficulty must be easy, medium, or hard"),
  body("*.options")
    .isArray({ min: 4, max: 4 })
    .withMessage("options must be an array with exactly 4 items"),
  body("*.correctAnswer").notEmpty().withMessage("correctAnswer is required"),
  body("*.points")
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

    const questionswithids = req.body as ManualQuestionData[];
    const questions = questionswithids.map(({ id, ...rest }) => rest);

    if (!Array.isArray(questions)) {
      return next(
        createError("Request body must be an array", 400, errorCode.invalid)
      );
    }

    try {
      await addQuestions(questions);

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
