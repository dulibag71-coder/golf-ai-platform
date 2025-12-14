'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

// 플랜별 AI 코치 제한
const PLAN_AI_LIMIT: Record<string, number> = {
    'user': 5,
    'pro': -1,
    'elite': -1,
    'club_starter': -1,
    'club_pro': -1,
    'club_enterprise': -1
};

export default function CoachPage() {
    const [userRole, setUserRole] = useState<string>('user');
    const [messageCount, setMessageCount] = useState(0);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: '안녕하세요! 저는 코치 김프로입니다. 골프에 대해 무엇이든 물어보세요! 🏌️' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const fetchRole = async () => {
                    try {
                        const userData = await api.get('/auth/me', token);
                        if (userData?.role) {
                            setUserRole(userData.role);
                            const user = JSON.parse(localStorage.getItem('user') || '{}');
                            user.role = userData.role;
                            localStorage.setItem('user', JSON.stringify(user));
                        }
                    } catch {
                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                        setUserRole(user.role || 'user');
                    }
                };
                fetchRole();
            }
        }
    }, []);

    const limit = PLAN_AI_LIMIT[userRole] || 5;
    const canChat = limit === -1 || messageCount < limit;

    const sendMessage = async () => {
        if (!input.trim() || !canChat) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await api.post('/coach/chat', {
                message: userMessage,
                history: messages.slice(-10)
            });
            setMessages(prev => [...prev, { role: 'ai', content: response.message }]);
            setMessageCount(prev => prev + 1);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: '죄송합니다. 잠시 후 다시 시도해주세요.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
                <div className={`mb-4 p-3 rounded-xl flex justify-between items-center ${userRole === 'user' ? 'bg-gray-800' : 'bg-green-900/30 border border-green-500'}`}>
                    <div>
                        <span className={`text-xs px-2 py-1 rounded ${userRole !== 'user' ? 'bg-green-600' : 'bg-gray-600'}`}>
                            {userRole === 'user' ? '무료' : userRole === 'elite' ? '엘리트' : userRole.startsWith('club') ? '동호회' : '프로'}
                        </span>
                        <span className="ml-3 text-sm text-gray-400">
                            {limit === -1 ? '무제한 상담' : `오늘 ${messageCount}/${limit}회 사용`}
                        </span>
                    </div>
                    {userRole === 'user' && <Link href="/pricing" className="text-green-400 text-sm hover:underline">업그레이드 →</Link>}
                </div>

                <h1 className="text-3xl font-bold mb-6 text-green-400">🏌️ AI 골프 코치</h1>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-green-600' : 'bg-gray-800'}`}>
                                    {msg.role === 'ai' && <span className="text-xs text-green-400 block mb-1">코치 김프로</span>}
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><div className="bg-gray-800 p-4 rounded-2xl text-gray-400">답변 작성 중...</div></div>}
                    </div>

                    <div className="p-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder={canChat ? "스윙에 대해 질문해보세요..." : "업그레이드가 필요합니다"}
                                disabled={!canChat}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 disabled:opacity-50"
                            />
                            <button onClick={sendMessage} disabled={loading || !canChat} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold disabled:opacity-50">
                                전송
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
