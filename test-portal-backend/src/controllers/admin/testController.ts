import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../utils/errorCode";
import { createTest } from "../../services/admin/createTests";
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
export const createTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array({ onlyFirstError: true });
  if (errors.length > 0) {
    return next(createError(errors[0].msg, 400, errorCode.invalid));
  }

  const test = req.body;

  try {
    await createTest(test);

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
};
