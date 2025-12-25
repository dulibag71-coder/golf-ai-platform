import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();
        const sql = getDb();

        const { searchParams } = new URL(request.url);
        const scope = searchParams.get('scope') || 'global';

        // 실시간 랭킹 데이터 집계 (평균 점수 기준)
        // swing_analyses 테이블에서 사용자별 평균 점수와 총 분석 횟수 계산
        const leaderboard = await sql`
            SELECT 
                u.id, 
                u.name, 
                u.email,
                COALESCE(AVG(s.score), 0)::INTEGER as avg_score,
                COUNT(s.id)::INTEGER as total_analyses,
                'KR' as country -- 기본값
            FROM users u
            LEFT JOIN swing_analyses s ON u.id = s.user_id
            WHERE u.role != 'admin'
            GROUP BY u.id, u.name, u.email
            ORDER BY avg_score DESC, total_analyses DESC
            LIMIT 50
        `;

        // 랭킹 부여
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            id: entry.id.toString(),
            name: entry.name || entry.email.split('@')[0],
            avgScore: entry.avg_score,
            totalAnalyses: entry.total_analyses,
            improvement: 0, // 나중에 히스토리 비교로 구현 가능
            country: entry.country,
            avatar: entry.avg_score > 90 ? '👑' : entry.avg_score > 80 ? '🏌️' : '⛳'
        }));

        return NextResponse.json(rankedLeaderboard);
    } catch (error: any) {
        console.error('Leaderboard fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
