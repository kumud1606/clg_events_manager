import { Router } from "express";
import { getCertificates } from "../controllers/certificateController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, getCertificates);

export default router;
