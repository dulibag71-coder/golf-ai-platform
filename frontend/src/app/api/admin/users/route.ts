import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';

export async function GET() {
    try {
        await initializeDatabase();

        const sql = getDb();
        const users = await sql`
            SELECT id, email, name, role, subscription_expires_at, is_active, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;

        // 만료 체크 및 상태 추가
        const now = new Date();
        const usersWithStatus = users.map(user => ({
            ...user,
            subscription_status: user.subscription_expires_at
                ? (new Date(user.subscription_expires_at) > now ? 'active' : 'expired')
                : (user.role === 'user' ? 'free' : 'unknown')
        }));

        return NextResponse.json(usersWithStatus);
    } catch (error: any) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
