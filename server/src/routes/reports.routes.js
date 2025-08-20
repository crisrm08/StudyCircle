import { Router } from "express";
import { reportUser, getReports, discardReport, suspendUser } from "../controllers/reports.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post('/user/report/:id', upload.array('evidence', 5), reportUser);
router.get('/user/reports', getReports);
router.delete('/user/report/:id', discardReport);
router.patch('/user/report/:id', suspendUser);

export default router;