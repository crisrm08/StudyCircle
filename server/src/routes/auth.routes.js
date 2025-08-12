import { Router } from "express";
import { login, checkEmail, linkSupabaseUser } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/check-email", checkEmail);
router.post("/user-link-supabase", linkSupabaseUser);

export default router;
