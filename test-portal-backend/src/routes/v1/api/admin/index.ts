import express from "express";
import {
  addOneParticipant,
  getAllParticipants,
} from "../../../../controllers/admin/participantController";
import { getAllGroups } from "../../../../controllers/admin/groupController";
const router = express.Router();

router.post("/participants", addOneParticipant);
router.get("/participants", getAllParticipants);
router.get("/groups", getAllGroups);
export default router;
