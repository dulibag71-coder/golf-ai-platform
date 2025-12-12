import { Router } from 'express';
import { isAdmin } from '../middlewares/admin.middleware';
import { getPendingPayments, approvePayment, getAllUsers } from '../controllers/admin.controller';

const router = Router();

router.use(isAdmin); // Protect all routes

router.get('/payments/pending', getPendingPayments);
router.post('/payments/approve', approvePayment);
router.get('/users', getAllUsers);

export default router;
