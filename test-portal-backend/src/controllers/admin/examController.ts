import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../utils/errorCode";
import {
  createExamService,
  getAllExamService,
  getOneExamService,
} from "../../services/admin/examServices";

export const createExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array({ onlyFirstError: true });
  if (errors.length > 0) {
    return next(createError(errors[0].msg, 400, errorCode.invalid));
  }

  const test = req.body;
  console.log(test);
  try {
    await createExamService(test);

    return res.status(201).json({
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

export const getAllExams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exams = await getAllExamService();
    return res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (err: any) {
    return next(createError(err.message, 400, errorCode.invalid));
  }
};

export const getOneExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.params;
  console.log(data);
  try {
    const exam = await getOneExamService(data.id);
    return res.status(200).json({
      success: true,
      exam,
    });
  } catch (err: any) {
    return next(createError(err.message, 400, errorCode.invalid));
  }
};
