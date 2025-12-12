import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

