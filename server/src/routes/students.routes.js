import { Router } from "express";
import { signup, saveOrUpdate} from "../controllers/students.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post("/student-signup", upload.fields([
    { name: "id_photo", maxCount: 1 },
    { name: "selfie_photo", maxCount: 1 }]), signup);   
                      
router.post("/student-save-update", upload.single("user_image"), saveOrUpdate); 

export default router;