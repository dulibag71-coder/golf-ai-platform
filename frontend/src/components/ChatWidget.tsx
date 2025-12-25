'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User as UserIcon } from 'lucide-react';

interface Message {
    id: string | number;
    user_id?: number | null;
    user_name: string;
    user_role: string;
    content: string;
    created_at: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch user info
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    const userId = user?.id;

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error('Failed to fetch chat messages:', e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            // Poll for new messages every 3 seconds for real-time feel
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || loading) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ content: inputMessage })
            });

            if (res.ok) {
                const newMessage = await res.json();
                setMessages(prev => [...prev, newMessage]);
                setInputMessage('');
                setTimeout(scrollToBottom, 100);
            }
        } catch (e) {
            console.error('Failed to send message:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-accent text-black shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:shadow-[0_0_40px_rgba(0,242,255,0.6)] transition-all z-50 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-black"></span>
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 w-96 h-[500px] bg-black/95 border border-accent/20 rounded-2xl shadow-[0_0_50px_rgba(0,242,255,0.2)] backdrop-blur-xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent/10 to-transparent border-b border-white/5 p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-display font-black text-lg tracking-tighter uppercase italic flex items-center gap-2">
                                    GLOBAL <span className="text-accent tech-glow">CHAT</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Neural_Uplink: Online</p>
                                </div>
                            </div>
                            <X size={18} className="text-muted hover:text-white cursor-pointer" onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-white/[0.02]">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 filter grayscale">
                                    <MessageCircle size={48} className="mb-2" />
                                    <p className="text-[10px] uppercase tracking-widest font-mono">No Logs Found</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.user_id === userId ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className={`text-[9px] font-mono uppercase tracking-widest ${msg.user_role === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                                                {msg.user_name}
                                            </span>
                                            <span className="text-[8px] text-muted font-mono opacity-50">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.user_id === userId
                                                ? 'bg-accent/20 text-white rounded-tr-sm border border-accent/10'
                                                : 'bg-white/5 text-white/90 rounded-tl-sm border border-white/10'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/50 border-t border-white/5">
                            <div className="flex gap-2 bg-white/5 rounded-xl border border-white/10 p-1 focus-within:border-accent/40 transition-all">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder={userId ? "통신 프로토콜 시작..." : "로그인이 필요합니다"}
                                    disabled={!userId || loading}
                                    className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!userId || loading || !inputMessage.trim()}
                                    className="h-9 w-9 rounded-lg bg-accent text-black disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
