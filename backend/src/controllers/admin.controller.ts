import { Request, Response } from 'express';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getPendingPayments = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM payments WHERE status = 'PENDING' ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '결제 목록을 불러오는데 실패했습니다.' });
    }
};

export const approvePayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.body;

        // Start Transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Update Payment Status
            await connection.execute(
                "UPDATE payments SET status = 'PAID', approved_at = NOW() WHERE id = ?",
                [paymentId]
            );

            // Fetch Payment Info to activate subscription
            const [payments] = await connection.execute<RowDataPacket[]>(
                "SELECT * FROM payments WHERE id = ?",
                [paymentId]
            );
            const payment = payments[0];

            if (payment) {
                // Update or Create Subscription
                await connection.execute(
                    `INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status)
                     VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active')
                     ON DUPLICATE KEY UPDATE 
                     plan_type = VALUES(plan_type), 
                     start_date = NOW(), 
                     end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH), 
                     status = 'active'`,
                    [payment.user_id, payment.subscription_plan_id || 'basic_monthly']
                );
            }

            await connection.commit();
            res.json({ message: '결제가 승인되고 구독이 활성화되었습니다.' });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '결제 승인 중 오류가 발생했습니다.' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, email, role, created_at, is_active FROM users ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '사용자 목록을 불러오는데 실패했습니다.' });
    }
};
