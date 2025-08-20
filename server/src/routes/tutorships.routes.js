import { Router } from 'express';
import {
    makeTutorshipRequest,
    getTutorshipRequests,
    getTutorshipRequestStatus,
    cancelTutorshipRequest,
    acceptTutorshipRequest,
    rejectTutorshipRequest,
    closeTutorship,
    rateTutorship,
    readMessage
} from '../controllers/tutorships.controller';

const router = Router();

router.post('/tutorship/request', makeTutorshipRequest);
router.get('/tutorship/requests', getTutorshipRequests);
router.get('/tutorship/requests/:id', getTutorshipRequestStatus);
router.delete('/tutorship/request/:id', cancelTutorshipRequest);
router.patch('/tutorship/requests/:id/accept', acceptTutorshipRequest);
router.patch('/tutorship/requests/:id/reject', rejectTutorshipRequest);
router.patch('/tutorship/requests/:id/close', closeTutorship);
router.post('/tutorship/requests/:id/rate', rateTutorship);
router.patch("/tutorship/requests/:id/read", readMessage)

export default router;

