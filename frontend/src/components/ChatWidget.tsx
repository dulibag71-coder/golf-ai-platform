'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    senderId: number;
    message: string;
    timestamp: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}').id : null;

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_room', 'general');
        });

        newSocket.on('receive_message', (data: Message) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!inputMessage.trim() || !socket || !userId) return;

        socket.emit('send_message', {
            roomId: 'general',
            message: inputMessage,
            senderId: userId
        });

        setInputMessage('');
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-accent text-black shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:shadow-[0_0_40px_rgba(0,242,255,0.6)] transition-all z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 w-96 h-[500px] bg-black/95 border border-accent/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.2)] backdrop-blur-xl z-50 flex flex-col overflow-hidden"
                    >
                        <div className="bg-accent/10 border-b border-accent/20 p-4">
                            <h3 className="font-display font-black text-lg tracking-tighter uppercase italic">GLOBAL <span className="text-accent">CHAT</span></h3>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Real-Time Protocol</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.senderId === userId ? 'bg-accent/20 text-white' : 'bg-white/5 text-white'}`}>
                                        <p className="text-sm break-words">{msg.message}</p>
                                        <p className="text-[9px] text-muted mt-1 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="메시지 입력..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="h-10 w-10 rounded-xl bg-accent text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
