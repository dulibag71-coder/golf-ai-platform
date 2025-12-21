import { Router } from 'express';
import { getChatMessages, saveChatMessage } from '../controllers/chat.controller';

const router = Router();

router.get('/:roomId', getChatMessages);
router.post('/send', saveChatMessage);

export default router;
