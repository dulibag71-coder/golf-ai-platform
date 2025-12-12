import { NextRequest, NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const sql = getDb();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
        }

        // 사용자 조회
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;

        if (users.length === 0) {
            return NextResponse.json({ error: '가입되지 않은 이메일입니다.' }, { status: 401 });
        }

        const user = users[0];

        // 비밀번호 확인
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        return NextResponse.json({
            message: '로그인 성공!',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: '로그인 실패: ' + error.message }, { status: 500 });
    }
}
