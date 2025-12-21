'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Trophy, Calendar, Users, Clock, Plus, ChevronRight, Play, Medal, Award, Crown, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Tournament {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    participants: number;
    maxParticipants: number;
    status: 'upcoming' | 'ongoing' | 'completed';
    prize?: string;
    type: 'individual' | 'team';
}

export default function TournamentPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

    const tournaments: Tournament[] = [
        {
            id: '1',
            name: '2024 윈터 챔피언십',
            description: '연말 최대 규모 온라인 토너먼트',
            startDate: '2024-12-25',
            endDate: '2024-12-31',
            participants: 156,
            maxParticipants: 200,
            status: 'upcoming',
            prize: '₩1,000,000',
            type: 'individual'
        },
        {
            id: '2',
            name: '드래곤즈 vs 이글스',
            description: '팀 대항전 시즌 3',
            startDate: '2024-12-20',
            endDate: '2024-12-22',
            participants: 40,
            maxParticipants: 40,
            status: 'ongoing',
            type: 'team'
        },
        {
            id: '3',
            name: '주간 미니 토너먼트',
            description: '매주 진행되는 소규모 대회',
            startDate: '2024-12-18',
            endDate: '2024-12-19',
            participants: 32,
            maxParticipants: 32,
            status: 'completed',
            prize: '₩100,000',
            type: 'individual'
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming':
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase rounded">예정</span>;
            case 'ongoing':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded flex items-center gap-1"><span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />진행중</span>;
            case 'completed':
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-[10px] font-bold uppercase rounded">완료</span>;
            default:
                return null;
        }
    };

    const leaderboard = [
        { rank: 1, name: '김프로', score: 94, icon: <Crown size={16} className="text-yellow-400" /> },
        { rank: 2, name: '이마스터', score: 91, icon: <Medal size={16} className="text-gray-300" /> },
        { rank: 3, name: '박세리', score: 89, icon: <Award size={16} className="text-orange-400" /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                            <Trophy size={12} />
                            Tournament Arena
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                            <span className="text-yellow-400">토너먼트</span>
                        </h1>
                    </div>
                    <AnimatedButton variant="primary" onClick={() => setShowCreateModal(true)} className="mt-4 md:mt-0">
                        <Plus size={16} className="mr-2" />
                        토너먼트 생성
                    </AnimatedButton>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-xl font-mono text-sm transition-all ${activeTab === 'all'
                                ? 'bg-yellow-500 text-black font-bold'
                                : 'bg-white/5 text-muted hover:text-white'
                            }`}
                    >
                        전체 토너먼트
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-6 py-2 rounded-xl font-mono text-sm transition-all ${activeTab === 'my'
                                ? 'bg-yellow-500 text-black font-bold'
                                : 'bg-white/5 text-muted hover:text-white'
                            }`}
                    >
                        내 토너먼트
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tournament List */}
                    <div className="lg:col-span-2 space-y-4">
                        {tournaments.map((tournament, idx) => (
                            <motion.div
                                key={tournament.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <BentoCard className={`p-6 hover:border-yellow-500/30 transition-all cursor-pointer ${tournament.status === 'ongoing' ? 'border-green-500/30 bg-green-500/5' : ''
                                    }`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(tournament.status)}
                                                <span className="text-[10px] font-mono uppercase text-muted">
                                                    {tournament.type === 'team' ? '팀전' : '개인전'}
                                                </span>
                                            </div>
                                            <h3 className="font-display text-xl font-black italic">{tournament.name}</h3>
                                            <p className="text-sm text-muted mt-1">{tournament.description}</p>
                                        </div>
                                        {tournament.prize && (
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono uppercase text-muted">상금</p>
                                                <p className="font-display text-lg font-black italic text-yellow-400">{tournament.prize}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-muted">
                                            <Calendar size={14} />
                                            <span className="text-xs">{new Date(tournament.startDate).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted">
                                            <Users size={14} />
                                            <span className="text-xs">{tournament.participants}/{tournament.maxParticipants}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted">
                                            <Clock size={14} />
                                            <span className="text-xs">
                                                {tournament.status === 'upcoming' ? '곧 시작' :
                                                    tournament.status === 'ongoing' ? '진행중' : '종료'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${tournament.status === 'ongoing' ? 'bg-green-500' :
                                                        tournament.status === 'completed' ? 'bg-gray-500' : 'bg-yellow-500'
                                                    }`}
                                                style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {tournament.status === 'upcoming' && (
                                            <AnimatedButton variant="primary" className="text-xs">
                                                참가 신청
                                            </AnimatedButton>
                                        )}
                                        {tournament.status === 'ongoing' && (
                                            <AnimatedButton variant="outline" className="text-xs">
                                                <Play size={14} className="mr-1" />
                                                경기 입장
                                            </AnimatedButton>
                                        )}
                                        {tournament.status === 'completed' && (
                                            <AnimatedButton variant="outline" className="text-xs">
                                                결과 보기
                                            </AnimatedButton>
                                        )}
                                    </div>
                                </BentoCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Live Leaderboard */}
                        <BentoCard className="p-6">
                            <h2 className="font-display text-lg font-black uppercase italic mb-4 flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-400" />
                                실시간 순위
                            </h2>
                            <div className="space-y-3">
                                {leaderboard.map((entry) => (
                                    <div key={entry.rank} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                                {entry.icon}
                                            </div>
                                            <span className="font-bold">{entry.name}</span>
                                        </div>
                                        <span className="font-display text-lg font-black italic text-accent">{entry.score}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/team/leaderboard" className="mt-4 text-xs text-yellow-400 font-mono uppercase flex items-center justify-center gap-1 hover:underline">
                                전체 순위 보기 <ChevronRight size={14} />
                            </Link>
                        </BentoCard>

                        {/* Upcoming */}
                        <BentoCard className="p-6">
                            <h2 className="font-display text-lg font-black uppercase italic mb-4">다가오는 대회</h2>
                            <div className="space-y-2">
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <p className="font-bold text-sm">신년 챔피언십</p>
                                    <p className="text-xs text-muted">2025년 1월 1일</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <p className="text-sm">프로암 토너먼트</p>
                                    <p className="text-xs text-muted">2025년 1월 15일</p>
                                </div>
                            </div>
                        </BentoCard>
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                        >
                            <h3 className="font-display text-xl font-black italic mb-6">토너먼트 생성</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-mono uppercase text-muted mb-2 block">대회명</label>
                                    <input
                                        type="text"
                                        placeholder="토너먼트 이름"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono uppercase text-muted mb-2 block">유형</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm">개인전</button>
                                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-muted">팀전</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-mono uppercase text-muted mb-2 block">시작일</label>
                                        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono uppercase text-muted mb-2 block">종료일</label>
                                        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono uppercase text-muted mb-2 block">최대 참가자</label>
                                    <input
                                        type="number"
                                        placeholder="32"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <AnimatedButton variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                                    취소
                                </AnimatedButton>
                                <AnimatedButton variant="primary" className="flex-1">
                                    생성하기
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
}
