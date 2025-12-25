import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

// Get recent chat messages
export async function GET() {
    try {
        await initializeDatabase();
        const sql = getDb();

        const messages = await sql`
            SELECT id, user_id, user_name, user_role, content, created_at
            FROM chat_messages
            ORDER BY created_at DESC
            LIMIT 50
        `;

        return NextResponse.json(messages.reverse());
    } catch (error: any) {
        console.error('Chat fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Post a new message
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const { content } = await request.json();
        if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

        let userId = null;
        let userName = 'Guest';
        let userRole = 'user';

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
                userName = decoded.email?.split('@')[0] || 'User';
                userRole = decoded.role || 'user';
            } catch (e) { }
        }

        const result = await sql`
            INSERT INTO chat_messages (user_id, user_name, user_role, content)
            VALUES (${userId}, ${userName}, ${userRole}, ${content})
            RETURNING id, user_name, user_role, content, created_at
        `;

        return NextResponse.json(result[0]);
    } catch (error: any) {
        console.error('Chat post error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
