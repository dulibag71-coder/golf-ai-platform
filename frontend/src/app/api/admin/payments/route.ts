import { NextRequest, NextResponse } from 'next/server';
import { sql, initializeDatabase } from '@/lib/db';

// 대기중인 결제 목록 조회
export async function GET() {
    try {
        await initializeDatabase();

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

// 결제 승인
export async function POST(request: NextRequest) {
    try {
        const { paymentId } = await request.json();

        await sql`UPDATE payments SET status = 'approved' WHERE id = ${paymentId}`;

        return NextResponse.json({ message: '결제가 승인되었습니다.' });
    } catch (error: any) {
        console.error('Approve payment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
