import { Router } from "express";
import { login, checkEmail } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/check-email", checkEmail);

export default router;
