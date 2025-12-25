import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';

// 관리자 통계 조회
export async function GET() {
    try {
        await initializeDatabase();

        const sql = getDb();

        // 총 사용자 수
        const userCount = await sql`SELECT COUNT(*) as count FROM users`;

        // 대기 중인 결제 수
        const pendingPayments = await sql`SELECT COUNT(*) as count FROM payments WHERE status = 'pending'`;

        // 승인된 결제 총액 (매출)
        const revenue = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'approved'`;

        // 총 스윙 분석 수
        const swingCount = await sql`SELECT COUNT(*) as count FROM swing_analyses`;

        // 요금제별 그룹화 데이터
        const distribution = await sql`
            SELECT role, COUNT(*) as value 
            FROM users 
            GROUP BY role
        `;

        return NextResponse.json({
            totalUsers: parseInt(userCount[0]?.count) || 0,
            pendingPayments: parseInt(pendingPayments[0]?.count) || 0,
            revenue: parseInt(revenue[0]?.total) || 0,
            totalSwings: parseInt(swingCount[0]?.count) || 0,
            distribution: distribution.map(d => ({
                name: d.role.toUpperCase(),
                value: parseInt(d.value)
            }))
        });
    } catch (error: any) {
        console.error('Get stats error:', error);
        return NextResponse.json({
            totalUsers: 0,
            pendingPayments: 0,
            revenue: 0,
            totalSwings: 0
        });
    }
}
