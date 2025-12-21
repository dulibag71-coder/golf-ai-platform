import { pool } from '../config/database';

export interface User {
    id?: number;
    email: string;
    password_hash: string;
    role: 'user' | 'admin';
    is_active: boolean;
    created_at?: Date;
}

export const UserModel = {
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return null;
        return result.rows[0] as User;
    },

    async create(user: User): Promise<number> {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
            [user.email, user.password_hash, user.role]
        );
        return result.rows[0].id;
    },

    async findById(id: number): Promise<User | null> {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        return result.rows[0] as User;
    }
};
