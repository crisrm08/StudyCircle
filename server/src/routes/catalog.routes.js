import { Router } from "express";
import {
  getSubjectsWithTopics,
  getUserTopics,
  getOccupationsAndLevels,
  getCareers
} from "../controllers/catalog.controller.js";

const router = Router();

router.get("/subjects-topics", getSubjectsWithTopics);
router.get("/user-topics", getUserTopics);
router.get("/ocupations-academic-levels", getOccupationsAndLevels);
router.get("/careers", getCareers);

export default router;
 