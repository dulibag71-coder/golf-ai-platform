'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { FileText, Download, Calendar, TrendingUp, Users, BarChart3, PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import FeatureGate from '@/components/FeatureGate';

export default function MonthlyReportPage() {
    const [selectedMonth, setSelectedMonth] = useState('2024-12');

    const reportData = {
        overview: {
            totalMembers: 15,
            activeMembers: 12,
            totalAnalyses: 234,
            avgScore: 78,
            improvement: 5.2,
        },
        topPerformers: [
            { name: '김프로', score: 94, improvement: 8 },
            { name: '이마스터', score: 91, improvement: 5 },
            { name: '박세리', score: 89, improvement: 6 },
        ],
        improvements: [
            { name: '최루키', improvement: 15, from: 65, to: 80 },
            { name: '정멤버', improvement: 10, from: 70, to: 80 },
            { name: '한선수', improvement: 8, from: 75, to: 83 },
        ],
        weeklyData: [
            { week: '1주차', analyses: 45, avgScore: 76 },
            { week: '2주차', analyses: 62, avgScore: 77 },
            { week: '3주차', analyses: 58, avgScore: 79 },
            { week: '4주차', analyses: 69, avgScore: 80 },
        ]
    };

    const handleDownload = () => {
        // Generate PDF report (mock)
        alert('PDF 리포트 다운로드를 시작합니다.');
    };

    return (
        <FeatureGate featureName="monthly-report">
            <div className="min-h-screen bg-black text-white font-sans">
                <Navbar />

                <main className="max-w-6xl mx-auto px-6 pt-28 pb-16">
                    {/* ... rest of the main content ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
                    >
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                                Monthly Analytics
                            </div>
                            <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                                월간 <span className="text-green-400">리포트</span>
                            </h1>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                            >
                                <option value="2024-12">2024년 12월</option>
                                <option value="2024-11">2024년 11월</option>
                                <option value="2024-10">2024년 10월</option>
                            </select>
                            <AnimatedButton variant="primary" onClick={handleDownload}>
                                <Download size={16} className="mr-2" />
                                PDF 다운로드
                            </AnimatedButton>
                        </div>
                    </motion.div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <BentoCard className="p-5">
                            <Users size={20} className="text-blue-400 mb-2" />
                            <p className="text-[10px] font-mono uppercase text-muted">총 팀원</p>
                            <p className="font-display text-2xl font-black italic">{reportData.overview.totalMembers}</p>
                        </BentoCard>
                        <BentoCard className="p-5">
                            <Users size={20} className="text-green-400 mb-2" />
                            <p className="text-[10px] font-mono uppercase text-muted">활성 팀원</p>
                            <p className="font-display text-2xl font-black italic">{reportData.overview.activeMembers}</p>
                        </BentoCard>
                        <BentoCard className="p-5">
                            <BarChart3 size={20} className="text-purple-400 mb-2" />
                            <p className="text-[10px] font-mono uppercase text-muted">총 분석</p>
                            <p className="font-display text-2xl font-black italic">{reportData.overview.totalAnalyses}</p>
                        </BentoCard>
                        <BentoCard className="p-5">
                            <PieChart size={20} className="text-accent mb-2" />
                            <p className="text-[10px] font-mono uppercase text-muted">평균 점수</p>
                            <p className="font-display text-2xl font-black italic text-accent">{reportData.overview.avgScore}</p>
                        </BentoCard>
                        <BentoCard className="p-5">
                            <TrendingUp size={20} className="text-green-400 mb-2" />
                            <p className="text-[10px] font-mono uppercase text-muted">향상률</p>
                            <p className="font-display text-2xl font-black italic text-green-400">+{reportData.overview.improvement}%</p>
                        </BentoCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Top Performers */}
                        <BentoCard className="p-6">
                            <h2 className="font-display text-lg font-black uppercase italic mb-6">🏆 이달의 TOP 3</h2>
                            <div className="space-y-4">
                                {reportData.topPerformers.map((performer, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                    'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-bold">{performer.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display text-xl font-black italic text-accent">{performer.score}</p>
                                            <p className="text-xs text-green-400 flex items-center justify-end gap-1">
                                                <ArrowUp size={12} />+{performer.improvement}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* Most Improved */}
                        <BentoCard className="p-6">
                            <h2 className="font-display text-lg font-black uppercase italic mb-6">📈 성장 MVP</h2>
                            <div className="space-y-4">
                                {reportData.improvements.map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <TrendingUp size={20} className="text-green-400" />
                                            </div>
                                            <div>
                                                <span className="font-bold">{member.name}</span>
                                                <p className="text-xs text-muted">{member.from} → {member.to}</p>
                                            </div>
                                        </div>
                                        <p className="font-display text-xl font-black italic text-green-400">+{member.improvement}%</p>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>
                    </div>

                    {/* Weekly Breakdown */}
                    <BentoCard className="p-6">
                        <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                            <Calendar size={18} className="text-green-400" />
                            주차별 분석
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                            {reportData.weeklyData.map((week, idx) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-xl text-center">
                                    <p className="text-[10px] font-mono uppercase text-muted mb-2">{week.week}</p>
                                    <p className="font-display text-2xl font-black italic">{week.analyses}</p>
                                    <p className="text-xs text-muted">분석</p>
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                        <p className="font-display text-lg font-black italic text-accent">{week.avgScore}</p>
                                        <p className="text-[10px] text-muted">평균 점수</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </main>
            </div>
        </FeatureGate>
    );
}
