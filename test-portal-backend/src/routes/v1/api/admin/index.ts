import express from "express";
import csvQueue from "../../../../jobs/queues/csvQueue";
import multer from "multer";
import {
  addOneParticipant,
  getAllParticipants,
} from "../../../../controllers/admin/participantController";
import { getAllGroups } from "../../../../controllers/admin/groupController";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/participants", addOneParticipant);
router.get("/participants", getAllParticipants);
router.get("/groups", getAllGroups);

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  await csvQueue.add("processCsv", { filePath: req.file.path });
  res.json({ message: "File uploaded and queued for processing" });
});

export default router;
