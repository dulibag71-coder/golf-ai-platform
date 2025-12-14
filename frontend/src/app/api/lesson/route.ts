import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendEmail, getLessonConfirmationEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'golf-ai-platform-secret-2024';

// 레슨 예약 목록 조회
export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);

        const bookings = await sql`
            SELECT * FROM lesson_bookings 
            WHERE user_id = ${decoded.userId}
            ORDER BY lesson_date DESC, lesson_time DESC
        `;

        return NextResponse.json(bookings);
    } catch (error: any) {
        console.error('Get lessons error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 레슨 예약 생성 + 이메일 발송
export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: '인증 필요' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const { lessonType, lessonDate, lessonTime, notes } = await request.json();

        if (!lessonType || !lessonDate || !lessonTime) {
            return NextResponse.json({ error: '필수 정보를 입력해주세요.' }, { status: 400 });
        }

        const result = await sql`
            INSERT INTO lesson_bookings (user_id, user_email, lesson_type, lesson_date, lesson_time, notes, status)
            VALUES (${decoded.userId}, ${decoded.email}, ${lessonType}, ${lessonDate}, ${lessonTime}, ${notes || ''}, 'confirmed')
            RETURNING *
        `;

        // 이메일 발송
        if (decoded.email) {
            const emailHtml = getLessonConfirmationEmail(
                lessonType,
                new Date(lessonDate).toLocaleDateString('ko-KR'),
                lessonTime
            );
            await sendEmail(decoded.email, `[Golfing AI] 레슨 예약 확인 - ${lessonType}`, emailHtml);
        }

        return NextResponse.json({
            message: '레슨 예약이 완료되었습니다! 확인 이메일이 발송되었습니다.',
            booking: result[0]
        });
    } catch (error: any) {
        console.error('Lesson booking error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
