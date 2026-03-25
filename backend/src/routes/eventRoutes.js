import { Router } from "express";
import { createEvent, getEvents } from "../controllers/eventController.js";
import { requireAuth, requireManager } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getEvents);
router.post("/", requireAuth, requireManager, createEvent);

export default router;
