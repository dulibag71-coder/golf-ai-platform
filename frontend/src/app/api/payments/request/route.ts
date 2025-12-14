import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

// 결제 요청 생성 - 로그인된 사용자의 이메일 저장
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const sql = getDb();
        const { amount, senderName, planName, clubName } = await request.json();

        if (!amount || !senderName) {
            return NextResponse.json({ error: '금액과 입금자명을 입력해주세요.' }, { status: 400 });
        }

        // 토큰에서 사용자 이메일 추출
        let userEmail = null;
        let userId = null;
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (token) {
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                userEmail = decoded.email;
                userId = decoded.userId;
            } catch (e) { }
        }

        // payments 테이블에 email 컬럼 추가 (없으면)
        try {
            await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
            await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS club_name VARCHAR(100)`;
        } catch (e) { }

        // 결제 요청 저장 (이메일 포함)
        const result = await sql`
            INSERT INTO payments (user_id, email, amount, sender_name, plan_name, club_name, status)
            VALUES (${userId}, ${userEmail}, ${amount}, ${senderName}, ${planName || 'pro'}, ${clubName || null}, 'pending')
            RETURNING id, email, amount, sender_name, plan_name, status, created_at
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
