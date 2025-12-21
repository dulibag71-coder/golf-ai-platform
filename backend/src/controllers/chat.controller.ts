import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const result = await pool.query(
            'SELECT * FROM chat_messages WHERE room_id = $1 ORDER BY created_at ASC',
            [roomId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '메시지를 불러오는 중 오류가 발생했습니다.' });
    }
};

export const saveChatMessage = async (req: Request, res: Response) => {
    try {
        const { roomId, senderId, message } = req.body;
        await pool.query(
            'INSERT INTO chat_messages (room_id, sender_id, message) VALUES ($1, $2, $3)',
            [roomId, senderId, message]
        );
        res.status(201).json({ message: '메시지가 저장되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '메시지 저장 중 오류가 발생했습니다.' });
    }
};
