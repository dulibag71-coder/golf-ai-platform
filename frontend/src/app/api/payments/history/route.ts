import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const sql = getDb();
        const history = await sql`
            SELECT * FROM payments 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;

        return NextResponse.json(history);
    } catch (error: any) {
        return NextResponse.json({ error: '결제 내역 조회 실패' }, { status: 500 });
    }
}
