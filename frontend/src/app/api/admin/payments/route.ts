import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import { sendEmail, getPaymentApprovedEmail } from '@/lib/email';

// 대기중인 결제 목록 조회
export async function GET() {
    try {
        await initializeDatabase();

        const sql = getDb();

        try {
            await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
        } catch (e) { }

        const payments = await sql`
            SELECT id, user_id, email, amount, sender_name, plan_name, club_name, status, created_at
            FROM payments 
            WHERE status = 'pending'
            ORDER BY created_at DESC
        `;

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error('Get payments error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 플랜명에 따른 role 매핑
function getPlanRole(planName: string): string {
    const roleMap: Record<string, string> = {
        '프로': 'pro',
        '엘리트': 'elite',
        '동호회 스타터': 'club_starter',
        '동호회 프로': 'club_pro',
        '동호회 엔터프라이즈': 'club_enterprise'
    };
    return roleMap[planName] || 'pro';
}

// 결제 승인 + 이메일 발송
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

        // 4. 플랜에 맞는 role 설정
        const newRole = getPlanRole(payment.plan_name);

        // 5. 이메일로 사용자 찾아서 업그레이드
        let userEmail = payment.email;
        let updated = false;

        if (payment.email) {
            const result = await sql`
                UPDATE users 
                SET role = ${newRole}, subscription_expires_at = ${expiresAtStr} 
                WHERE email = ${payment.email}
                RETURNING id, email, role
            `;
            if (result.length > 0) {
                updated = true;
                userEmail = result[0].email;
                console.log('Updated by email:', result[0]);
            }
        }

        if (!updated && payment.user_id) {
            const result = await sql`
                UPDATE users 
                SET role = ${newRole}, subscription_expires_at = ${expiresAtStr} 
                WHERE id = ${payment.user_id}
                RETURNING email
            `;
            if (result.length > 0) {
                userEmail = result[0].email;
            }
        }

        // 6. 결제 승인 이메일 발송
        if (userEmail) {
            const emailHtml = getPaymentApprovedEmail(
                payment.plan_name,
                expiresAt.toLocaleDateString('ko-KR')
            );
            await sendEmail(userEmail, `[Golfing AI] 결제 승인 완료 - ${payment.plan_name} 플랜 활성화`, emailHtml);
        }

        return NextResponse.json({
            message: '결제 승인 완료! 이메일이 발송되었습니다.',
            plan: payment.plan_name,
            role: newRole,
            email: userEmail,
            expiresAt: expiresAtStr
        });
    } catch (error: any) {
        console.error('Approve payment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
