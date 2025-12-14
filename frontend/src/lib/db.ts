import { neon } from '@neondatabase/serverless';

// 런타임에만 DB 연결 (빌드 시점 에러 방지)
export function getDb() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    return neon(connectionString);
}

// 테이블 초기화 함수
export async function initializeDatabase() {
    const sql = getDb();

    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(100),
            role VARCHAR(20) DEFAULT 'user',
            subscription_expires_at TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP`;
    } catch (e) { }

    await sql`
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            email VARCHAR(255),
            amount INTEGER NOT NULL,
            sender_name VARCHAR(100),
            plan_name VARCHAR(50) DEFAULT 'pro',
            club_name VARCHAR(100),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS plan_name VARCHAR(50) DEFAULT 'pro'`;
        await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
        await sql`ALTER TABLE payments ADD COLUMN IF NOT EXISTS club_name VARCHAR(100)`;
    } catch (e) { }

    await sql`
        CREATE TABLE IF NOT EXISTS swing_analyses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            video_url TEXT,
            analysis_result TEXT,
            score INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 레슨 예약 테이블
    await sql`
        CREATE TABLE IF NOT EXISTS lesson_bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            user_email VARCHAR(255),
            lesson_type VARCHAR(100) NOT NULL,
            lesson_date DATE NOT NULL,
            lesson_time VARCHAR(10) NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 대회 등록 테이블
    await sql`
        CREATE TABLE IF NOT EXISTS tournament_registrations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            tournament_name VARCHAR(255) NOT NULL,
            tournament_date DATE NOT NULL,
            program_type VARCHAR(50),
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 동호회/팀 테이블
    await sql`
        CREATE TABLE IF NOT EXISTS clubs (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            owner_id INTEGER NOT NULL,
            plan VARCHAR(50) DEFAULT 'club_starter',
            max_members INTEGER DEFAULT 20,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // 동호회 멤버 테이블
    await sql`
        CREATE TABLE IF NOT EXISTS club_members (
            id SERIAL PRIMARY KEY,
            club_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            role VARCHAR(20) DEFAULT 'member',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}
