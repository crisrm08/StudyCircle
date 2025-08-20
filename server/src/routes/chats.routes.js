import { Router }  from "express";
import { getActiveTutorships, getChatMessages, sendMessage } from "../controllers/chats.controller";

const router = Router();

router.get('/chats', getActiveTutorships);
router.get('/chats/:id/messages', getChatMessages);
router.post('/chats/:id/messages', sendMessage);

export default router;