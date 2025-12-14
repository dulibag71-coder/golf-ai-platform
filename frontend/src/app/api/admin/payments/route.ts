import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';

// 대기중인 결제 목록 조회
export async function GET() {
    try {
        await initializeDatabase();

        const sql = getDb();
        const payments = await sql`
            SELECT p.*, u.email 
            FROM payments p 
            LEFT JOIN users u ON p.user_id = u.id 
            WHERE p.status = 'pending'
            ORDER BY p.created_at DESC
        `;

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error('Get payments error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 결제 승인 - 사용자 역할 업그레이드 + 구독 만료일 설정 (1달 후)
export async function POST(request: NextRequest) {
    try {
        const sql = getDb();
        const { paymentId } = await request.json();

        // 1. 결제 정보 조회
        const payments = await sql`SELECT * FROM payments WHERE id = ${paymentId}`;
        if (payments.length === 0) {
            return NextResponse.json({ error: '결제를 찾을 수 없습니다.' }, { status: 404 });
        }

        const payment = payments[0];

        // 2. 결제 상태를 approved로 변경
        await sql`UPDATE payments SET status = 'approved' WHERE id = ${paymentId}`;

        // 3. 구독 만료일 계산 (현재 시간 + 1달)
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        const expiresAtStr = expiresAt.toISOString();

        // 4. 사용자 역할 업그레이드 + 구독 만료일 설정
        const newRole = payment.plan_name === '엘리트' ? 'elite' : 'pro';

        if (payment.user_id) {
            await sql`UPDATE users SET role = ${newRole}, subscription_expires_at = ${expiresAtStr} WHERE id = ${payment.user_id}`;
        }

        // sender_name으로 찾기 (user_id 없을 때)
        if (!payment.user_id && payment.sender_name) {
            await sql`UPDATE users SET role = ${newRole}, subscription_expires_at = ${expiresAtStr} WHERE name = ${payment.sender_name}`;
        }

        return NextResponse.json({
            message: '결제 승인 완료! 구독이 1달간 활성화됩니다.',
            plan: payment.plan_name,
            expiresAt: expiresAtStr
        });
    } catch (error: any) {
        console.error('Approve payment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
