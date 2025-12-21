import { pool } from './database';

export const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100),
                role VARCHAR(20) DEFAULT 'user',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Payments Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                amount INTEGER NOT NULL,
                sender_name VARCHAR(100),
                plan_name VARCHAR(50),
                club_name VARCHAR(100),
                status VARCHAR(20) DEFAULT 'PENDING',
                approved_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Subscriptions Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL,
                plan_type VARCHAR(50) NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                status VARCHAR(20) DEFAULT 'active'
            )
        `);

        // Swing Videos Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS swing_videos (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                video_url TEXT NOT NULL,
                upload_status VARCHAR(50) DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Swing Analyses Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS swing_analyses (
                id SERIAL PRIMARY KEY,
                video_id INTEGER NOT NULL,
                score_total INTEGER,
                score_stability INTEGER,
                score_path INTEGER,
                score_impact INTEGER,
                score_weight_transfer INTEGER,
                score_release INTEGER,
                score_consistency INTEGER,
                diagnosis_problems JSONB,
                diagnosis_good_point TEXT,
                injury_risk_warning TEXT,
                keypoints_json JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Chat Messages Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                room_id VARCHAR(100) NOT NULL,
                sender_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query('COMMIT');
        console.log('Database initialized successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error initializing database:', error);
    } finally {
        client.release();
    }
};
