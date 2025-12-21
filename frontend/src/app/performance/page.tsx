'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { TrendingUp, Calendar, Target, Award, ChevronRight, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

interface PerformanceData {
    date: string;
    score: number;
    swingSpeed: number;
    accuracy: number;
}

interface AnalysisRecord {
    id: number;
    date: string;
    overallScore: number;
    swingSpeed: number;
    impactAngle: number;
    balance: number;
}

export default function PerformancePage() {
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [analysisRecords, setAnalysisRecords] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

    useEffect(() => {
        loadPerformanceData();
    }, [timeRange]);

    const loadPerformanceData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/performance/history?range=${timeRange}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                setPerformanceData(data.chartData || []);
                setAnalysisRecords(data.records || []);
            }
        } catch (error) {
            console.error('Failed to load performance data:', error);
            // Generate sample data for demo
            generateSampleData();
        } finally {
            setLoading(false);
        }
    };

    const generateSampleData = () => {
        const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
        const data: PerformanceData[] = [];
        const records: AnalysisRecord[] = [];

        for (let i = days; i >= 0; i -= (days > 30 ? 7 : 1)) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const score = Math.floor(Math.random() * 25) + 70;

            data.push({
                date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
                score,
                swingSpeed: Math.floor(Math.random() * 20) + 75,
                accuracy: Math.floor(Math.random() * 20) + 70,
            });

            if (Math.random() > 0.5) {
                records.push({
                    id: i,
                    date: date.toISOString(),
                    overallScore: score,
                    swingSpeed: Math.floor(Math.random() * 20) + 75,
                    impactAngle: Math.floor(Math.random() * 15) + 80,
                    balance: Math.floor(Math.random() * 20) + 75,
                });
            }
        }

        setPerformanceData(data);
        setAnalysisRecords(records.slice(0, 10));
    };

    const radarData = [
        { subject: '스윙 속도', A: 85, fullMark: 100 },
        { subject: '임팩트', A: 78, fullMark: 100 },
        { subject: '밸런스', A: 82, fullMark: 100 },
        { subject: '템포', A: 75, fullMark: 100 },
        { subject: '팔로우스루', A: 80, fullMark: 100 },
        { subject: '정확도', A: 88, fullMark: 100 },
    ];

    const averageScore = performanceData.length > 0
        ? Math.round(performanceData.reduce((acc, d) => acc + d.score, 0) / performanceData.length)
        : 0;

    const improvement = performanceData.length > 1
        ? performanceData[performanceData.length - 1].score - performanceData[0].score
        : 0;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                        Performance Chronicle
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                        성능 <span className="text-accent">연대기</span>
                    </h1>
                </motion.div>

                {/* Time Range Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                        {(['week', 'month', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-6 py-2 rounded-lg font-mono text-xs uppercase transition-all ${timeRange === range
                                        ? 'bg-accent text-black font-bold'
                                        : 'text-muted hover:text-white'
                                    }`}
                            >
                                {range === 'week' ? '1주' : range === 'month' ? '1개월' : '1년'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <BentoCard className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Target size={20} className="text-accent" />
                            </div>
                            <span className="text-[10px] font-mono uppercase text-muted">평균 점수</span>
                        </div>
                        <p className="font-display text-3xl font-black italic">{averageScore}</p>
                    </BentoCard>

                    <BentoCard className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp size={20} className="text-green-400" />
                            </div>
                            <span className="text-[10px] font-mono uppercase text-muted">성장률</span>
                        </div>
                        <p className={`font-display text-3xl font-black italic ${improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {improvement >= 0 ? '+' : ''}{improvement}%
                        </p>
                    </BentoCard>

                    <BentoCard className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Zap size={20} className="text-purple-400" />
                            </div>
                            <span className="text-[10px] font-mono uppercase text-muted">분석 횟수</span>
                        </div>
                        <p className="font-display text-3xl font-black italic">{analysisRecords.length}</p>
                    </BentoCard>

                    <BentoCard className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Award size={20} className="text-blue-400" />
                            </div>
                            <span className="text-[10px] font-mono uppercase text-muted">최고 점수</span>
                        </div>
                        <p className="font-display text-3xl font-black italic text-accent">
                            {performanceData.length > 0 ? Math.max(...performanceData.map(d => d.score)) : 0}
                        </p>
                    </BentoCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <BentoCard className="lg:col-span-2 p-6">
                        <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                            <TrendingUp size={18} className="text-accent" />
                            점수 추이
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="date" stroke="#666" fontSize={10} />
                                    <YAxis stroke="#666" fontSize={10} domain={[50, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(0,0,0,0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#00f2ff"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </BentoCard>

                    {/* Radar Chart */}
                    <BentoCard className="p-6">
                        <h2 className="font-display text-lg font-black uppercase italic mb-6">
                            능력치 분석
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                    <Radar
                                        dataKey="A"
                                        stroke="#00f2ff"
                                        fill="#00f2ff"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </BentoCard>
                </div>

                {/* Analysis History */}
                <BentoCard className="mt-6 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-lg font-black uppercase italic flex items-center gap-2">
                            <Clock size={18} className="text-accent" />
                            분석 기록
                        </h2>
                        <Link href="/swing-analysis" className="text-accent text-xs font-mono uppercase flex items-center gap-1 hover:underline">
                            새 분석 <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {analysisRecords.length > 0 ? (
                            analysisRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                            <span className="font-display text-lg font-black italic text-accent">{record.overallScore}</span>
                                        </div>
                                        <div>
                                            <p className="font-mono text-sm">{new Date(record.date).toLocaleDateString('ko-KR')}</p>
                                            <p className="text-[10px] text-muted uppercase">
                                                속도 {record.swingSpeed} | 임팩트 {record.impactAngle} | 밸런스 {record.balance}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-muted" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted">
                                <Zap size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="font-mono text-sm">분석 기록이 없습니다</p>
                                <Link href="/swing-analysis" className="text-accent text-xs mt-2 inline-block hover:underline">
                                    첫 분석 시작하기
                                </Link>
                            </div>
                        )}
                    </div>
                </BentoCard>
            </main>
        </div>
    );
}
