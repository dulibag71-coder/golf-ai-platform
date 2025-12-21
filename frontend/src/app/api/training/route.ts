import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail, getTrainingStartEmail } from '@/lib/email';
import { trainingStartSchema, trainingUpdateSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

async function ensureTable(sql: any) {
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
}

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();
        await ensureTable(sql);

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const progress = await sql`
            SELECT * FROM training_progress 
            WHERE user_id = ${decoded.userId}
            ORDER BY started_at DESC
        `;

        return NextResponse.json(progress);
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
        const validatedData = trainingStartSchema.parse(body);

        await initializeDatabase();
        const sql = getDb();
        await ensureTable(sql);

        const existing = await sql`
            SELECT * FROM training_progress 
            WHERE user_id = ${decoded.userId} AND program_id = ${validatedData.programId}
        `;

        if (existing.length > 0) {
            return NextResponse.json({
                message: 'ALREADY_IN_PROGRESS',
                progress: existing[0]
            });
        }

        const result = await sql`
            INSERT INTO training_progress (user_id, program_id, program_name, total_weeks, total_tasks)
            VALUES (${decoded.userId}, ${validatedData.programId}, ${validatedData.programName}, ${validatedData.weeks}, ${validatedData.weeks * 7})
            RETURNING *
        `;

        if (decoded.email) {
            try {
                const emailHtml = getTrainingStartEmail(validatedData.programName, validatedData.weeks);
                await sendEmail(decoded.email, `[Golfing AI] ${validatedData.programName} 훈련 시작!`, emailHtml);
            } catch (e) {
                console.error('Email sending failed:', e);
            }
        }

        return NextResponse.json({
            message: 'MODULE_INITIALIZED_SUCCESSFULLY',
            progress: result[0]
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const body = await request.json();
        const validatedData = trainingUpdateSchema.parse(body);

        await initializeDatabase();
        const sql = getDb();

        const result = await sql`
            UPDATE training_progress 
            SET tasks_completed = ${validatedData.tasksCompleted}, 
                week_number = ${validatedData.weekNumber},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${validatedData.progressId} AND user_id = ${decoded.userId}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'PROGRESS_UPDATED_SUCCESSFULLY',
            progress: result[0]
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
