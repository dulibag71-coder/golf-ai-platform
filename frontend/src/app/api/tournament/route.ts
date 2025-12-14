import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

// 대회 등록 목록 조회
export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const registrations = await sql`
            SELECT * FROM tournament_registrations 
            WHERE user_id = ${decoded.userId}
            ORDER BY tournament_date DESC
        `;

        return NextResponse.json(registrations);
    } catch (error: any) {
        console.error('Get tournaments error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 대회 등록
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { tournamentName, tournamentDate, programType } = await request.json();

        if (!tournamentName || !tournamentDate) {
            return NextResponse.json({ error: '대회명과 날짜를 입력해주세요.' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO tournament_registrations (user_id, tournament_name, tournament_date, program_type)
            VALUES (${decoded.userId}, ${tournamentName}, ${tournamentDate}, ${programType || 'general'})
            RETURNING *
        `;

        return NextResponse.json({
            message: '대회가 등록되었습니다!',
            tournament: result[0]
        });
    } catch (error: any) {
        console.error('Tournament registration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
