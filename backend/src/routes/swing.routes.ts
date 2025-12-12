import { Router } from 'express';
import upload from '../services/s3.service';
import { uploadSwing, requestAnalysis } from '../controllers/swing.controller';

const router = Router();

// Middleware to check auth would go here
// router.use(verifyToken);

router.post('/upload', upload.single('video'), uploadSwing);
router.post('/analyze', requestAnalysis);

export default router;
