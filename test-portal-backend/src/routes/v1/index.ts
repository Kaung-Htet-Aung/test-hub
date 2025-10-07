import express from "express";
import participants from "./api/admin";
const router = express.Router();

router.use("/api/v1/admin", participants);
export default router;
