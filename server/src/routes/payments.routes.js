import { Router } from "express";
import { upsertStudentPaymentMethod, getStudentPaymentMethod, upsertTutorCashingMethod, getTutorCashingMethod } from "../controllers/payments.controller.js";

const router = Router();

router.put('/student-payment-methods/:id', upsertStudentPaymentMethod);
router.get('/student-payment-methods/:id', getStudentPaymentMethod);
router.put('/tutor-cashing-methods/:id', upsertTutorCashingMethod);
router.get('/tutor-cashing-methods/:id', getTutorCashingMethod);

export default router; 