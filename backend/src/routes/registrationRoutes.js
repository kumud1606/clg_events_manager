import { Router } from "express";
import { createRegistration } from "../controllers/registrationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", requireAuth, createRegistration);

export default router;
