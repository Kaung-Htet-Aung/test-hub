import { getGroups } from "../../services/admin/getGroups";
import { Request, Response } from "express";
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await getGroups();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Failed to get groups:", error);
    res.status(500).json({ error: "Unable to fetch groups." });
  }
};
