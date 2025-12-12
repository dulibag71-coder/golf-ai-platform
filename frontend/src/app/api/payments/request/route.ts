import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';

// 결제 요청 생성
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const sql = getDb();
        const { userId, amount, senderName, planName } = await request.json();

        if (!amount || !senderName) {
            return NextResponse.json({ error: '금액과 입금자명을 입력해주세요.' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO payments (user_id, amount, sender_name, status)
            VALUES (${userId || null}, ${amount}, ${senderName}, 'pending')
            RETURNING id, amount, sender_name, status, created_at
        `;

        return NextResponse.json({
            message: '결제 요청이 접수되었습니다. 관리자 승인 후 서비스가 활성화됩니다.',
            payment: result[0]
        });
    } catch (error: any) {
        console.error('Payment request error:', error);
        return NextResponse.json({ error: '결제 요청 실패: ' + error.message }, { status: 500 });
    }
}
