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

// 결제 승인 - 사용자 역할 업그레이드
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

        // 3. 사용자 역할을 플랜에 맞게 업그레이드 (pro 또는 elite)
        if (payment.user_id) {
            const newRole = payment.plan_name === '엘리트' ? 'elite' : 'pro';
            await sql`UPDATE users SET role = ${newRole} WHERE id = ${payment.user_id}`;
        }

        // 4. sender_name으로 사용자 찾아서 역할 업그레이드 (user_id가 없는 경우)
        if (!payment.user_id && payment.sender_name) {
            const newRole = payment.plan_name === '엘리트' ? 'elite' : 'pro';
            await sql`UPDATE users SET role = ${newRole} WHERE name = ${payment.sender_name}`;
        }

        return NextResponse.json({
            message: '결제가 승인되고 사용자 등급이 업그레이드되었습니다.',
            plan: payment.plan_name
        });
    } catch (error: any) {
        console.error('Approve payment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
