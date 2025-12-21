import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for demo
        methods: ["GET", "POST"]
    }
});

import { initializeDatabase } from './config/init-db';

const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize Database
initializeDatabase().then(() => {
    console.log('Database synced');
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Golfing AI Platform API v1.0 - Cyberpunk Edition');
});

// Socket.io logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        const { roomId, message, senderId } = data;
        io.to(roomId).emit('receive_message', {
            message,
            senderId,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

import authRoutes from './routes/auth.routes';
import swingRoutes from './routes/swing.routes';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';

app.use('/api/auth', authRoutes);
app.use('/api/swing', swingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
