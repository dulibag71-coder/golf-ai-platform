import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    },

    async create(user: User): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [user.email, user.password_hash, user.role]
        );
        return result.insertId;
    },

    async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return rows[0] as User;
    }
};
