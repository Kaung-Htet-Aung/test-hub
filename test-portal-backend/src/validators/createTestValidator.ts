import { body } from "express-validator";

export const createTestValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("instructions")
    .optional()
    .isString()
    .withMessage("Instructions must be a string"),

  body("passingScore")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Passing score must be between 0 and 100"),

  body("timeLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Time limit must be at least 1 minute"),

  body("scheduledDateTime")
    .notEmpty()
    .withMessage("Scheduled date/time is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("notifyBeforeStartMinutes")
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage("Notify before must be between 1 and 1440 minutes"),

  body("batchId").notEmpty().withMessage("BatchId is required"),
  body("groupId").notEmpty().withMessage("QuestionSet Id is required"),

  body("difficulty")
    .optional()
    .isIn(["EASY", "MEDIUM", "HARD"])
    .withMessage("Difficulty must be EASY, MEDIUM, or HARD"),
];
