import { NextRequest, NextResponse } from 'next/server';
import { sql, initializeDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(request: NextRequest) {
    try {
        // 테이블 초기화 (첫 요청 시)
        await initializeDatabase();

        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
        }

        // 이메일 중복 확인
        const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 400 });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const result = await sql`
            INSERT INTO users (email, password, name) 
            VALUES (${email}, ${hashedPassword}, ${name || ''})
            RETURNING id, email, name, role
        `;

        const user = result[0];

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        return NextResponse.json({
            message: '회원가입 성공!',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json({ error: '회원가입 실패: ' + error.message }, { status: 500 });
    }
}
