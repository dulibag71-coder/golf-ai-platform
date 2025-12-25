import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const sql = getDb();
        const users = await sql`SELECT id, email, name, role, subscription_expires_at, created_at FROM users WHERE id = ${userId}`;

        if (users.length === 0) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        const user = users[0];

        // 추가 정보 (스윙 횟수 등)
        const swings = await sql`SELECT COUNT(*) as count FROM swing_analyses WHERE user_id = ${userId}`;
        const totalSwings = swings[0].count;

        return NextResponse.json({
            ...user,
            totalSwings
        });
    } catch (error: any) {
        return NextResponse.json({ error: '프로필 조회 실패' }, { status: 500 });
    }
}
