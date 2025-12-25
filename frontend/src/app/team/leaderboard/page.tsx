'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import { Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, Minus, Filter, Search, Globe } from 'lucide-react';
import FeatureGate from '@/components/FeatureGate';

interface LeaderboardEntry {
    rank: number;
    id: string;
    name: string;
    team?: string;
    avgScore: number;
    totalAnalyses: number;
    improvement: number;
    country: string;
    avatar: string;
}

export default function LeaderboardPage() {
    const [scope, setScope] = useState<'global' | 'team' | 'friends'>('global');
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
    const [searchQuery, setSearchQuery] = useState('');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboard?scope=${scope}`);
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboardData(data);
                }
            } catch (error) {
                console.error('Leaderboard load error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [scope]);

    const filteredData = leaderboardData.filter(entry =>
        entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
            case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
            case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-500/30';
            default: return 'bg-white/5 border-white/10';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown size={24} className="text-yellow-400" />;
            case 2: return <Medal size={24} className="text-gray-300" />;
            case 3: return <Award size={24} className="text-orange-400" />;
            default: return <span className="font-display text-lg font-black">{rank}</span>;
        }
    };

    const getImprovementDisplay = (improvement: number) => {
        if (improvement > 0) {
            return (
                <span className="flex items-center gap-1 text-green-400">
                    <TrendingUp size={14} />
                    +{improvement}%
                </span>
            );
        } else if (improvement < 0) {
            return (
                <span className="flex items-center gap-1 text-red-400">
                    <TrendingDown size={14} />
                    {improvement}%
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-muted">
                <Minus size={14} />
                0%
            </span>
        );
    };

    const getFlagEmoji = (countryCode: string) => {
        const flags: Record<string, string> = {
            'KR': '🇰🇷',
            'US': '🇺🇸',
            'GB': '🇬🇧',
            'ES': '🇪🇸',
            'JP': '🇯🇵',
        };
        return flags[countryCode] || '🌍';
    };

    return (
        <FeatureGate featureName="leaderboard">
            <div className="min-h-screen bg-black text-white font-sans">
                <Navbar />

                <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
                    {/* ... rest of the main content ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                            <Globe size={12} />
                            Global Leaderboard
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                            글로벌 <span className="text-yellow-400">랭킹</span>
                        </h1>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Scope Toggle */}
                        <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                            {(['global', 'team', 'friends'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setScope(s)}
                                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase transition-all ${scope === s
                                        ? 'bg-yellow-500 text-black font-bold'
                                        : 'text-muted hover:text-white'
                                        }`}
                                >
                                    {s === 'global' ? '전체' : s === 'team' ? '팀' : '친구'}
                                </button>
                            ))}
                        </div>

                        {/* Time Range */}
                        <div className="inline-flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                            {(['week', 'month', 'all'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase transition-all ${timeRange === t
                                        ? 'bg-white/10 text-white font-bold'
                                        : 'text-muted hover:text-white'
                                        }`}
                                >
                                    {t === 'week' ? '주간' : t === 'month' ? '월간' : '전체'}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                placeholder="이름 또는 팀 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50"
                            />
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <BentoCard className="p-6">
                        <div className="space-y-3">
                            {filteredData.map((entry, idx) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:scale-[1.01] ${getRankStyle(entry.rank)}`}
                                >
                                    {/* Rank & User Info */}
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${entry.rank <= 3 ? '' : 'bg-white/5'
                                            }`}>
                                            {getRankIcon(entry.rank)}
                                        </div>

                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl">
                                            {entry.avatar}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{getFlagEmoji(entry.country)}</span>
                                                <p className="font-bold">{entry.name}</p>
                                            </div>
                                            {entry.team && (
                                                <p className="text-xs text-muted">{entry.team}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-8">
                                        <div className="text-center hidden md:block">
                                            <p className="text-[10px] font-mono uppercase text-muted">분석 수</p>
                                            <p className="font-bold">{entry.totalAnalyses}</p>
                                        </div>

                                        <div className="text-center hidden md:block">
                                            <p className="text-[10px] font-mono uppercase text-muted">성장률</p>
                                            <p className="text-sm font-mono">{getImprovementDisplay(entry.improvement)}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className={`font-display text-2xl font-black italic ${entry.rank === 1 ? 'text-yellow-400' :
                                                entry.rank === 2 ? 'text-gray-300' :
                                                    entry.rank === 3 ? 'text-orange-400' :
                                                        'text-accent'
                                                }`}>
                                                {entry.avgScore}
                                            </p>
                                            <p className="text-[10px] font-mono uppercase text-muted">평균 점수</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* My Rank Card */}
                    <BentoCard className="mt-6 p-6 bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center font-display text-xl font-black">
                                    42
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase text-muted">내 순위</p>
                                    <p className="font-display text-2xl font-black italic">42위</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-display text-3xl font-black italic text-accent">78</p>
                                <p className="text-xs text-muted">상위 15% 유지 중</p>
                            </div>
                        </div>
                    </BentoCard>
                </main>
            </div>
        </FeatureGate>
    );
}
