'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function CoachPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: '안녕하세요! 저는 당신의 AI 골프 코치입니다. 스윙에 대해 궁금한 점이 있으시면 무엇이든 물어보세요!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // 실제 AI 코치 API 호출
            const response = await api.post('/coach/chat', {
                message: userMessage,
                history: messages.slice(-10) // 최근 10개 메시지만 전송
            });

            setMessages(prev => [...prev, { role: 'ai', content: response.message }]);
        } catch (error) {
            console.error('AI 응답 오류:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: '죄송합니다. 잠시 후 다시 시도해주세요.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
                <h1 className="text-3xl font-bold mb-6 text-green-400">AI 골프 코치</h1>

                {/* Chat Messages */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-100'
                                    }`}>
                                    {msg.role === 'ai' && <span className="text-xs text-green-400 block mb-1">AI 코치</span>}
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-4 rounded-2xl text-gray-400">
                                    답변 작성 중...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="스윙에 대해 질문해보세요..."
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                전송
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setInput('드라이버 비거리를 늘리려면 어떻게 해야 하나요?')}
                        className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-left hover:border-green-500 transition"
                    >
                        <span className="text-green-400 text-sm">추천 질문</span>
                        <p className="mt-1">드라이버 비거리 늘리기</p>
                    </button>
                    <button
                        onClick={() => setInput('슬라이스를 고치는 방법을 알려주세요')}
                        className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-left hover:border-green-500 transition"
                    >
                        <span className="text-green-400 text-sm">추천 질문</span>
                        <p className="mt-1">슬라이스 교정하기</p>
                    </button>
                    <button
                        onClick={() => setInput('일관된 스윙을 위한 연습 방법은?')}
                        className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-left hover:border-green-500 transition"
                    >
                        <span className="text-green-400 text-sm">추천 질문</span>
                        <p className="mt-1">일관성 향상 연습법</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
