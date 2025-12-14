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
        const history = await sql`
            SELECT id, score, created_at, analysis_result->>'score_total' as total_score 
            FROM swing_analyses 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;

        // analysis_result가 TEXT로 저장되어 있으므로 파싱 필요할 수 있음 (Postgres JSONB가 아닌 경우)
        // 위 쿼리는 JSONB를 가정한 것이나, 현재 TEXT일 수 있음. 안전하게 전체 가져와서 처리

        const rawHistory = await sql`
            SELECT id, score, created_at, analysis_result 
            FROM swing_analyses 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;

        const processedHistory = rawHistory.map(item => {
            let result = {};
            try {
                result = typeof item.analysis_result === 'string'
                    ? JSON.parse(item.analysis_result)
                    : item.analysis_result;
            } catch (e) { }

            return {
                id: item.id,
                created_at: item.created_at,
                score: item.score,
                details: result
            };
        });

        return NextResponse.json(processedHistory);
    } catch (error: any) {
        console.error('History error:', error);
        return NextResponse.json({ error: '분석 기록 조회 실패' }, { status: 500 });
    }
}
