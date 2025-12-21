import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getPendingPayments = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT * FROM payments WHERE status = 'PENDING' ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '결제 목록을 불러오는데 실패했습니다.' });
    }
};

export const approvePayment = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { paymentId } = req.body;

        await client.query('BEGIN');

        // Update Payment Status
        await client.query(
            "UPDATE payments SET status = 'PAID', approved_at = CURRENT_TIMESTAMP WHERE id = $1",
            [paymentId]
        );

        // Fetch Payment Info to activate subscription
        const paymentResult = await client.query(
            "SELECT * FROM payments WHERE id = $1",
            [paymentId]
        );
        const payment = paymentResult.rows[0];

        if (payment) {
            // Update or Create Subscription using ON CONFLICT (standard PG)
            await client.query(
                `INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status)
                 VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month', 'active')
                 ON CONFLICT (user_id) DO UPDATE SET 
                    plan_type = EXCLUDED.plan_type, 
                    start_date = CURRENT_TIMESTAMP, 
                    end_date = CURRENT_TIMESTAMP + INTERVAL '1 month', 
                    status = 'active'`,
                [payment.user_id, payment.subscription_plan_id || 'basic_monthly']
            );

            // Also update the user's role to reflect their new tier
            await client.query(
                "UPDATE users SET role = $1 WHERE id = $2",
                [payment.subscription_plan_id || 'pro', payment.user_id]
            );
        }

        await client.query('COMMIT');
        res.json({ message: '결제가 승인되고 구독이 활성화되었습니다.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: '결제 승인 중 오류가 발생했습니다.' });
    } finally {
        client.release();
    }
};

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const usersCount = await pool.query("SELECT COUNT(*) FROM users");
        const paymentsCount = await pool.query("SELECT COUNT(*) FROM payments WHERE status = 'PENDING'");
        const swingsCount = await pool.query("SELECT COUNT(*) FROM swing_videos");
        const revenue = await pool.query("SELECT SUM(amount) FROM payments WHERE status = 'PAID'");

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count),
            pendingPayments: parseInt(paymentsCount.rows[0].count),
            totalSwings: parseInt(swingsCount.rows[0].count),
            revenue: parseInt(revenue.rows[0].sum || '0')
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '통계 정보를 불러오는데 실패했습니다.' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "SELECT id, email, role, created_at, is_active FROM users ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '사용자 목록을 불러오는데 실패했습니다.' });
    }
};
