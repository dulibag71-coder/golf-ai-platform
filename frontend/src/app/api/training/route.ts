import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail, getTrainingStartEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

// 훈련 프로그램 목록 및 진행 상황 조회
export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        // 훈련 프로그램 테이블 생성
        await sql`
            CREATE TABLE IF NOT EXISTS training_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                program_id VARCHAR(50) NOT NULL,
                program_name VARCHAR(100) NOT NULL,
                week_number INTEGER DEFAULT 1,
                total_weeks INTEGER NOT NULL,
                tasks_completed INTEGER DEFAULT 0,
                total_tasks INTEGER DEFAULT 21,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const progress = await sql`
            SELECT * FROM training_progress 
            WHERE user_id = ${decoded.userId}
            ORDER BY started_at DESC
        `;

        return NextResponse.json(progress);
    } catch (error: any) {
        console.error('Get training error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 훈련 프로그램 시작 + 이메일 발송
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        // 테이블 생성
        await sql`
            CREATE TABLE IF NOT EXISTS training_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                program_id VARCHAR(50) NOT NULL,
                program_name VARCHAR(100) NOT NULL,
                week_number INTEGER DEFAULT 1,
                total_weeks INTEGER NOT NULL,
                tasks_completed INTEGER DEFAULT 0,
                total_tasks INTEGER DEFAULT 21,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { programId, programName, weeks } = await request.json();

        if (!programId || !programName) {
            return NextResponse.json({ error: '프로그램을 선택해주세요.' }, { status: 400 });
        }

        // 기존 진행 중인 같은 프로그램 체크
        const existing = await sql`
            SELECT * FROM training_progress 
            WHERE user_id = ${decoded.userId} AND program_id = ${programId}
        `;

        if (existing.length > 0) {
            return NextResponse.json({
                message: '이미 진행 중인 프로그램입니다.',
                progress: existing[0]
            });
        }

        const result = await sql`
            INSERT INTO training_progress (user_id, program_id, program_name, total_weeks, total_tasks)
            VALUES (${decoded.userId}, ${programId}, ${programName}, ${weeks}, ${weeks * 7})
            RETURNING *
        `;

        // 훈련 시작 이메일 발송
        if (decoded.email) {
            const emailHtml = getTrainingStartEmail(programName, weeks);
            await sendEmail(decoded.email, `[Golfing AI] ${programName} 훈련 시작!`, emailHtml);
        }

        return NextResponse.json({
            message: `${programName} 프로그램이 시작되었습니다! 이메일이 발송되었습니다.`,
            progress: result[0]
        });
    } catch (error: any) {
        console.error('Training start error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 훈련 진행 상황 업데이트
export async function PUT(request: NextRequest) {
    try {
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { progressId, tasksCompleted, weekNumber } = await request.json();

        const result = await sql`
            UPDATE training_progress 
            SET tasks_completed = ${tasksCompleted}, 
                week_number = ${weekNumber},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${progressId} AND user_id = ${decoded.userId}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: '프로그램을 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json({
            message: '진행 상황이 업데이트되었습니다!',
            progress: result[0]
        });
    } catch (error: any) {
        console.error('Training update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
