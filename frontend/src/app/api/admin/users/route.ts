import { NextRequest, NextResponse } from 'next/server';
import { sql, initializeDatabase } from '@/lib/db';

export async function GET() {
    try {
        await initializeDatabase();

        const users = await sql`
            SELECT id, email, name, role, is_active, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
