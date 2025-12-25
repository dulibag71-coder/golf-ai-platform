'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Users, Trophy, TrendingUp, Settings, UserPlus, BarChart3, Calendar, FileText, ChevronRight, Crown, Medal, Award } from 'lucide-react';
import Link from 'next/link';
import FeatureGate from '@/components/FeatureGate';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avgScore: number;
    analysisCount: number;
    joinedAt: string;
    avatar: string;
}

interface TeamStats {
    totalMembers: number;
    avgScore: number;
    totalAnalyses: number;
    weeklyActive: number;
    improvement: number;
}

export default function TeamDashboardPage() {
    const [teamStats, setTeamStats] = useState<TeamStats>({
        totalMembers: 15,
        avgScore: 78,
        totalAnalyses: 234,
        weeklyActive: 12,
        improvement: 5.2
    });

    const [members, setMembers] = useState<TeamMember[]>([
        { id: '1', name: '김팀장', email: 'kim@team.com', role: 'admin', avgScore: 85, analysisCount: 32, joinedAt: '2024-01-15', avatar: '👑' },
        { id: '2', name: '이선수', email: 'lee@team.com', role: 'member', avgScore: 82, analysisCount: 28, joinedAt: '2024-02-20', avatar: '🏌️' },
        { id: '3', name: '박프로', email: 'park@team.com', role: 'member', avgScore: 79, analysisCount: 45, joinedAt: '2024-01-10', avatar: '⛳' },
        { id: '4', name: '최루키', email: 'choi@team.com', role: 'member', avgScore: 75, analysisCount: 18, joinedAt: '2024-03-05', avatar: '🎯' },
        { id: '5', name: '정멤버', email: 'jung@team.com', role: 'member', avgScore: 72, analysisCount: 22, joinedAt: '2024-02-28', avatar: '🏆' },
    ]);

    const [showInviteModal, setShowInviteModal] = useState(false);

    const sortedMembers = [...members].sort((a, b) => b.avgScore - a.avgScore);

    return (
        <FeatureGate featureName="team-dashboard">
            <div className="min-h-screen bg-black text-white font-sans">
                <Navbar />

                <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
                    >
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                                Team Command Center
                            </div>
                            <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                                팀 <span className="text-blue-400">대시보드</span>
                            </h1>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <AnimatedButton variant="outline" onClick={() => setShowInviteModal(true)}>
                                <UserPlus size={16} className="mr-2" />
                                팀원 초대
                            </AnimatedButton>
                            <Link href="/team/settings">
                                <AnimatedButton variant="outline">
                                    <Settings size={16} />
                                </AnimatedButton>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <BentoCard className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Users size={20} className="text-blue-400" />
                                </div>
                            </div>
                            <p className="text-[10px] font-mono uppercase text-muted">총 팀원</p>
                            <p className="font-display text-2xl font-black italic">{teamStats.totalMembers}명</p>
                        </BentoCard>

                        <BentoCard className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Trophy size={20} className="text-accent" />
                                </div>
                            </div>
                            <p className="text-[10px] font-mono uppercase text-muted">평균 점수</p>
                            <p className="font-display text-2xl font-black italic text-accent">{teamStats.avgScore}</p>
                        </BentoCard>

                        <BentoCard className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <BarChart3 size={20} className="text-purple-400" />
                                </div>
                            </div>
                            <p className="text-[10px] font-mono uppercase text-muted">총 분석</p>
                            <p className="font-display text-2xl font-black italic">{teamStats.totalAnalyses}</p>
                        </BentoCard>

                        <BentoCard className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Calendar size={20} className="text-green-400" />
                                </div>
                            </div>
                            <p className="text-[10px] font-mono uppercase text-muted">주간 활동</p>
                            <p className="font-display text-2xl font-black italic">{teamStats.weeklyActive}명</p>
                        </BentoCard>

                        <BentoCard className="p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <TrendingUp size={20} className="text-yellow-400" />
                                </div>
                            </div>
                            <p className="text-[10px] font-mono uppercase text-muted">향상률</p>
                            <p className="font-display text-2xl font-black italic text-green-400">+{teamStats.improvement}%</p>
                        </BentoCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Team Ranking */}
                        <BentoCard className="lg:col-span-2 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-lg font-black uppercase italic flex items-center gap-2">
                                    <Trophy size={18} className="text-yellow-400" />
                                    팀 내 랭킹
                                </h2>
                                <Link href="/team/leaderboard" className="text-xs text-blue-400 font-mono uppercase flex items-center gap-1 hover:underline">
                                    전체 보기 <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {sortedMembers.map((member, idx) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg font-black ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                    idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-white/5 text-muted'
                                                }`}>
                                                {idx === 0 ? <Crown size={20} /> : idx === 1 ? <Medal size={20} /> : idx === 2 ? <Award size={20} /> : idx + 1}
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-lg">
                                                {member.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold">{member.name}</p>
                                                    {member.role === 'admin' && (
                                                        <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded uppercase font-bold">관리자</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted">{member.analysisCount}회 분석</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display text-xl font-black italic text-accent">{member.avgScore}</p>
                                            <p className="text-[10px] text-muted uppercase">평균 점수</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <BentoCard className="p-6">
                                <h2 className="font-display text-lg font-black uppercase italic mb-4">빠른 작업</h2>
                                <div className="space-y-2">
                                    <Link href="/team/batch-analysis" className="w-full p-4 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                        <BarChart3 size={18} className="text-purple-400" />
                                        <span className="text-sm">일괄 분석</span>
                                        <ChevronRight size={14} className="ml-auto text-muted" />
                                    </Link>
                                    <Link href="/team/report" className="w-full p-4 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                        <FileText size={18} className="text-green-400" />
                                        <span className="text-sm">월간 리포트</span>
                                        <ChevronRight size={14} className="ml-auto text-muted" />
                                    </Link>
                                    <Link href="/tournament" className="w-full p-4 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                        <Trophy size={18} className="text-yellow-400" />
                                        <span className="text-sm">토너먼트 생성</span>
                                        <ChevronRight size={14} className="ml-auto text-muted" />
                                    </Link>
                                </div>
                            </BentoCard>

                            <BentoCard className="p-6">
                                <h2 className="font-display text-lg font-black uppercase italic mb-4 flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-400" />
                                    다가오는 이벤트
                                </h2>
                                <div className="space-y-3">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-sm font-bold">팀 내부 토너먼트</p>
                                        <p className="text-xs text-muted">12월 25일 오후 2시</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <p className="text-sm">월간 평가</p>
                                        <p className="text-xs text-muted">12월 30일</p>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>
                    </div>

                    {/* Invite Modal */}
                    {showInviteModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            >
                                <h3 className="font-display text-xl font-black italic mb-4">팀원 초대</h3>
                                <input
                                    type="email"
                                    placeholder="이메일 주소 입력"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-blue-500/50"
                                />
                                <div className="flex gap-3">
                                    <AnimatedButton variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                                        취소
                                    </AnimatedButton>
                                    <AnimatedButton variant="primary" className="flex-1">
                                        초대 전송
                                    </AnimatedButton>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </FeatureGate>
    );
}
