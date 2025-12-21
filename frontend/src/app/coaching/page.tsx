'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { MessageCircle, Send, User, Star, Calendar, Clock, Video, Award, ChevronRight, Phone } from 'lucide-react';

interface Coach {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: string;
    avatar: string;
    available: boolean;
    price: number;
    bio: string;
}

interface Message {
    id: string;
    sender: 'user' | 'coach' | 'system';
    content: string;
    timestamp: Date;
}

const coaches: Coach[] = [
    {
        id: '1',
        name: '김프로',
        specialty: '드라이버 & 장타',
        rating: 4.9,
        experience: '15년',
        avatar: '🏌️',
        available: true,
        price: 50000,
        bio: 'KPGA 투어 프로 출신, 장타 전문 코치'
    },
    {
        id: '2',
        name: '이마스터',
        specialty: '숏게임 & 퍼팅',
        rating: 4.8,
        experience: '12년',
        avatar: '⛳',
        available: true,
        price: 45000,
        bio: 'PGA 투어 캐디 출신, 그린 주변 전문가'
    },
    {
        id: '3',
        name: '박코치',
        specialty: '스윙 교정',
        rating: 4.7,
        experience: '10년',
        avatar: '🎯',
        available: false,
        price: 40000,
        bio: '생체역학 기반 스윙 분석 전문가'
    },
];

export default function CoachingPage() {
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startChat = (coach: Coach) => {
        setSelectedCoach(coach);
        setMessages([
            {
                id: '1',
                sender: 'system',
                content: `${coach.name}님과의 1:1 코칭 세션이 시작되었습니다.`,
                timestamp: new Date()
            },
            {
                id: '2',
                sender: 'coach',
                content: `안녕하세요! ${coach.name}입니다. 오늘은 어떤 부분을 개선하고 싶으신가요?`,
                timestamp: new Date()
            }
        ]);
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || !selectedCoach) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/coach/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputMessage,
                    coachId: selectedCoach.id,
                    coachName: selectedCoach.name,
                    specialty: selectedCoach.specialty
                }),
            });

            const data = await response.json();

            const coachMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'coach',
                content: data.response || '네, 좋은 질문입니다. 자세히 설명해 드릴게요.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, coachMessage]);
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                        Pro Coaching Network
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                        1:1 <span className="text-purple-400">프로 코칭</span>
                    </h1>
                </motion.div>

                {!selectedCoach ? (
                    /* Coach Selection */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {coaches.map((coach, idx) => (
                            <motion.div
                                key={coach.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <BentoCard className={`p-6 h-full flex flex-col ${!coach.available ? 'opacity-50' : 'hover:border-purple-500/50'} transition-all`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-3xl">
                                            {coach.avatar}
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold text-yellow-500">{coach.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-display text-xl font-black italic mb-1">{coach.name}</h3>
                                    <p className="text-sm text-purple-400 mb-2">{coach.specialty}</p>
                                    <p className="text-xs text-muted mb-4">{coach.bio}</p>

                                    <div className="flex gap-4 mb-4">
                                        <div className="flex items-center gap-1 text-muted">
                                            <Clock size={12} />
                                            <span className="text-xs">{coach.experience}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted">
                                            <Award size={12} />
                                            <span className="text-xs">검증됨</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-mono uppercase text-muted">세션당</span>
                                            <span className="font-display text-xl font-black italic">₩{coach.price.toLocaleString()}</span>
                                        </div>

                                        <AnimatedButton
                                            variant={coach.available ? "primary" : "outline"}
                                            className="w-full"
                                            onClick={() => coach.available && startChat(coach)}
                                            disabled={!coach.available}
                                        >
                                            {coach.available ? '코칭 시작' : '현재 불가'}
                                        </AnimatedButton>
                                    </div>
                                </BentoCard>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Chat Interface */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Coach Info Sidebar */}
                        <BentoCard className="p-6 lg:col-span-1">
                            <button
                                onClick={() => setSelectedCoach(null)}
                                className="text-xs text-muted hover:text-white mb-4 flex items-center gap-1"
                            >
                                ← 다른 코치 선택
                            </button>

                            <div className="text-center">
                                <div className="h-20 w-20 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center text-4xl mb-4">
                                    {selectedCoach.avatar}
                                </div>
                                <h3 className="font-display text-xl font-black italic">{selectedCoach.name}</h3>
                                <p className="text-sm text-purple-400">{selectedCoach.specialty}</p>

                                <div className="flex justify-center gap-4 mt-4 text-muted">
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs">{selectedCoach.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span className="text-xs">{selectedCoach.experience}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <button className="w-full p-3 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                    <Video size={18} className="text-purple-400" />
                                    <span className="text-sm">화상 코칭 요청</span>
                                </button>
                                <button className="w-full p-3 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                    <Calendar size={18} className="text-purple-400" />
                                    <span className="text-sm">예약하기</span>
                                </button>
                            </div>
                        </BentoCard>

                        {/* Chat Area */}
                        <BentoCard className="lg:col-span-3 p-0 flex flex-col h-[600px]">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg">
                                    {selectedCoach.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold">{selectedCoach.name}</h4>
                                    <p className="text-[10px] text-green-400 uppercase">온라인</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.sender === 'system' ? (
                                            <div className="w-full text-center">
                                                <span className="text-xs text-muted bg-white/5 px-3 py-1 rounded-full">
                                                    {message.content}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={`max-w-[70%] p-4 rounded-2xl ${message.sender === 'user'
                                                    ? 'bg-purple-500/20 text-white'
                                                    : 'bg-white/5 text-white'
                                                }`}>
                                                <p className="text-sm">{message.content}</p>
                                                <p className="text-[9px] text-muted mt-1">
                                                    {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 p-4 rounded-2xl">
                                            <div className="flex gap-1">
                                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="메시지를 입력하세요..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={isLoading || !inputMessage.trim()}
                                        className="h-12 w-12 rounded-xl bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </BentoCard>
                    </div>
                )}
            </main>
        </div>
    );
}
