import { Router } from "express";
import { signup, saveOrUpdate, getTutorAvailability, listTutors, getTutorById  } from "../controllers/tutors.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post("/tutor-signup", upload.fields([
    { name: "id_photo", maxCount: 1 },
    { name: "selfie_photo", maxCount: 1 }]), signup);   
                      
router.post("/tutor-save-update", upload.single("user_image"), saveOrUpdate); 

router.get("/tutor-availability", getTutorAvailability);
router.get("/tutors", listTutors);
router.get("/tutor/:id", getTutorById);

export default router;