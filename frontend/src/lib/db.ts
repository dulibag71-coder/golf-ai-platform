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
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            amount INTEGER NOT NULL,
            sender_name VARCHAR(100),
            plan_name VARCHAR(50) DEFAULT 'pro',
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await sql`
        CREATE TABLE IF NOT EXISTS swing_analyses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            video_url TEXT,
            analysis_result TEXT,
            score INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}
