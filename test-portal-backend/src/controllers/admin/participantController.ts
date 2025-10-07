import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { addParticipant } from "../../services/admin/addParticipant";
import { createError } from "../../utils/error";
import { errorCode } from "../../utils/errorCode";
import { getParticipants } from "../../services/admin/getParticipants";
const prisma = new PrismaClient();
import { Request, Response, NextFunction } from "express";
export const addOneParticipant = [
  body("name", "Invalid Name")
    .isLength({ min: 3, max: 20 })
    .notEmpty()
    .escape(),
  body("email", "Invalid Email").trim().isEmail(),
  body("phone", "invalid phone number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 }),
  body("note", "Invalid Note").optional({ nullable: true }).escape(),
  body("groupId", "Invalid Group").notEmpty().escape(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { name, email, phone, note, groupId } = req.body;
    const data = {
      name,
      email,
      phone,
      note,
      groupId,
    };
    const participant = await addParticipant(data);
    res.status(201).json({
      message: "Successfully created a new post",
      participantId: participant.id,
    });
  },
];

export const getAllParticipants = async (req: Request, res: Response) => {
  try {
    const participants = await getParticipants();
    res.status(200).json(participants);
  } catch (error) {
    console.error("Failed to get participants:", error);
    res.status(500).json({ error: "Unable to fetch participants." });
  }
};

// --- 2. Get a SINGLE Participant by ID ---
export const getParticipantById = async (req: Request, res: Response) => {
  // The ID comes from the URL parameter (e.g., /api/participants/some-cuid)
  const { id } = req.params;

  try {
    const participant = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        groupMembers: {
          select: {
            group: {
              select: { name: true },
            },
          },
        },
        attempts: true, // Include full attempt details for a single user
      },
    });

    // If no participant is found with that ID, send a 404 Not Found response
    if (!participant) {
      return res.status(404).json({ error: "Participant not found." });
    }

    res.status(200).json(participant);
  } catch (error) {
    console.error(`Failed to get participant ${id}:`, error);
    res.status(500).json({ error: "Unable to fetch participant." });
  }
};
