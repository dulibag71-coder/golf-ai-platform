import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

export async function POST(request: NextRequest) {
    console.log('[PAYMENT_API] Received new payment request');
    try {
        await initializeDatabase();
        const sql = getDb();

        const body = await request.json();
        const { amount, senderName, planName, clubName } = body;

        console.log('[PAYMENT_API] Request Details:', { senderName, planName, amount });

        if (!amount || !senderName) {
            return NextResponse.json({ error: '금액과 입금자명을 입력해주세요.' }, { status: 400 });
        }

        // 토큰에서 사용자 정보 추출
        let userEmail = null;
        let userId = null;
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                userEmail = decoded.email;
                userId = decoded.userId;
                console.log('[PAYMENT_API] Authenticated User:', userEmail);
            } catch (e: any) {
                console.warn('[PAYMENT_API] JWT Verification Failed:', e.message);
            }
        } else {
            console.warn('[PAYMENT_API] No Authorization header found');
        }

        // 결제 요청 저장
        const result = await sql`
            INSERT INTO payments (user_id, email, amount, sender_name, plan_name, club_name, status)
            VALUES (${userId}, ${userEmail}, ${amount}, ${senderName}, ${planName || 'pro'}, ${clubName || null}, 'pending')
            RETURNING id, status, created_at
        `;

        console.log('[PAYMENT_API] Request Saved to DB:', result[0].id);

        return NextResponse.json({
            message: '결제 요청이 접수되었습니다. 관리자 승인 후 서비스가 활성화됩니다.',
            paymentId: result[0].id
        });
    } catch (error: any) {
        console.error('[PAYMENT_API] Critical Error:', error);
        return NextResponse.json({ error: '결제 요청 실패: ' + error.message }, { status: 500 });
    }
}
