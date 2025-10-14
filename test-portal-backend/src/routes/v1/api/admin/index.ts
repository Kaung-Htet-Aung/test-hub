import express from "express";
import csvQueue from "../../../../jobs/queues/csvQueue";
import multer from "multer";
import {
  addOneParticipant,
  getAllParticipants,
} from "../../../../controllers/admin/participantController";
import { getAllGroups } from "../../../../controllers/admin/groupController";
import { generateQuestions } from "../../../../controllers/admin/generateQuestions";
import { addQuestion } from "../../../../controllers/admin/questionController";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/participants", addOneParticipant);
router.get("/participants", getAllParticipants);
router.get("/groups", getAllGroups);
router.post("/generate-questions", generateQuestions);
router.post("/add-questions", addQuestion);

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const groupId = req.body.groupId;
  const job = await csvQueue.add("processCsv", {
    filePath: req.file.path,
    groupId,
  });
  res.status(202).json({ message: "CSV upload started", jobId: job.id });
});

router.get("/upload-status/:id/stream", (req, res) => {
  const jobId = req.params.id;

  // Set headers for SSE
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const interval = setInterval(async () => {
    const job = await csvQueue.getJob(jobId);
    if (!job) return;

    const state = await job.getState();

    if (state === "completed" || state === "failed") {
      clearInterval(interval);
      res.write(`data: ${JSON.stringify({ done: true, state })}\n\n`);
      res.end();
    }
  }, 1000);

  req.on("close", () => clearInterval(interval));
});

export default router;
