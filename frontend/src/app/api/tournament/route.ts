import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { tournamentSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const registrations = await sql`
            SELECT * FROM tournament_registrations 
            WHERE user_id = ${decoded.userId}
            ORDER BY tournament_date DESC
        `;

        return NextResponse.json(registrations);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const body = await request.json();

        const validatedData = tournamentSchema.parse(body);

        await initializeDatabase();
        const sql = getDb();

        const result = await sql`
            INSERT INTO tournament_registrations (user_id, tournament_name, tournament_date, program_type)
            VALUES (${decoded.userId}, ${validatedData.tournamentName}, ${validatedData.tournamentDate}, ${validatedData.programType || 'general'})
            RETURNING *
        `;

        return NextResponse.json({
            message: 'MISSION_LOGGED_SUCCESSFULLY',
            tournament: result[0]
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
