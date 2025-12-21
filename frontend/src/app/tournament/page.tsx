'use client';
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Trophy, Target, Calendar, Activity, ChevronRight, Plus, Brain, Map, Activity as Physical, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Tournament {
    id: number;
    tournament_name: string;
    tournament_date: string;
    program_type: string;
    status: string;
}

interface TrainingProgress {
    id: number;
    program_id: string;
    program_name: string;
    week_number: number;
    total_weeks: number;
    tasks_completed: number;
    total_tasks: number;
}

const programs = [
    { id: 'mental', title: '멘탈 트레이닝', icon: <Brain />, description: '대회 압박감 극복, 집중력 향상', weeks: 4 },
    { id: 'strategy', title: '코스 전략', icon: <Map />, description: '코스 공략법, 클럽 선택 전략', weeks: 3 },
    { id: 'physical', title: '피지컬 컨디셔닝', icon: <Physical />, description: '체력 관리, 부상 예방', weeks: 6 },
    { id: 'scoring', title: '스코어링 집중', icon: <Target />, description: '숏게임, 퍼팅 마스터', weeks: 4 }
];

export default function TournamentCoachPage() {
    const queryClient = useQueryClient();
    const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
    const [tournamentName, setTournamentName] = useState('');
    const [tournamentDate, setTournamentDate] = useState('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Queries
    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => api.get('/auth/me', token || ''),
        enabled: !!token
    });

    const { data: tournaments = [], isLoading: loadingTournaments } = useQuery({
        queryKey: ['tournaments'],
        queryFn: () => api.get('/tournament', token || ''),
        enabled: !!token
    });

    const { data: trainingProgress = [], isLoading: loadingTraining } = useQuery({
        queryKey: ['training'],
        queryFn: () => api.get('/training', token || ''),
        enabled: !!token
    });

    // Mutations
    const registerTournament = useMutation({
        mutationFn: (data: any) => api.post('/tournament', data, token || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tournaments'] });
            setTournamentName('');
            setTournamentDate('');
        }
    });

    const startProgram = useMutation({
        mutationFn: (data: any) => api.post('/training', data, token || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['training'] });
        }
    });

    const updateProgress = useMutation({
        mutationFn: (data: any) => api.put('/training', data, token || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['training'] });
        }
    });

    const userRole = user?.role || 'user';
    const isPaid = userRole !== 'user';

    const latestTournament = useMemo(() => {
        if (!tournaments.length) return null;
        return [...tournaments].sort((a, b) => new Date(a.tournament_date).getTime() - new Date(b.tournament_date).getTime())[0];
    }, [tournaments]);

    const dDay = latestTournament ? Math.ceil((new Date(latestTournament.tournament_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

    if (!isPaid) {
        return (
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="max-w-xl mx-auto px-6 pt-32 text-center">
                    <BentoCard icon={<Trophy />} title="ACCESS DENIED" subtitle="유료 플랜 전용">
                        <p className="text-muted text-sm mt-4 mb-8">대회 준비 코칭은 프로 플랜 이상에서 이용 가능합니다.</p>
                        <Link href="/pricing">
                            <AnimatedButton className="w-full">플랜 업그레이드 →</AnimatedButton>
                        </Link>
                    </BentoCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold tracking-tighter tech-glow mb-2"
                    >
                        MISSION CONTROL
                    </motion.h1>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                        <Activity size={12} className="text-accent animate-pulse" /> TOURNAMENT COACHING SYSTEM ACTIVE
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Main Tournament Status */}
                    <BentoCard
                        className="md:col-span-2 md:row-span-2"
                        icon={<Trophy className="text-accent" />}
                        title="CURRENT OBJECTIVE"
                        subtitle={latestTournament?.tournament_name || "등록된 대회 없음"}
                    >
                        {latestTournament ? (
                            <div className="mt-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-black italic tech-glow">D-{dDay}</span>
                                    <span className="text-muted uppercase font-mono text-xs">REMAINING DAYS</span>
                                </div>
                                <p className="text-muted mt-4 font-mono text-xs flex items-center gap-2">
                                    <Calendar size={14} /> TARGET DATE: {new Date(latestTournament.tournament_date).toLocaleDateString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted mt-4 text-sm">목표 대회를 등록하고 훈련을 시작하세요.</p>
                        )}
                    </BentoCard>

                    {/* Progress Overview */}
                    <BentoCard
                        className="md:col-span-2"
                        icon={<Percent className="text-accent" />}
                        title="SYSTEM PROGRESS"
                    >
                        {trainingProgress.length > 0 ? (
                            <div className="space-y-6 mt-4">
                                {trainingProgress.map((tp: TrainingProgress) => (
                                    <div key={tp.id} className="group/item">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-mono uppercase text-muted group-hover/item:text-white transition-colors">
                                                {tp.program_name}
                                            </span>
                                            <span className="text-[10px] font-mono text-accent">
                                                {Math.round((tp.tasks_completed / tp.total_tasks) * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-accent"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(tp.tasks_completed / tp.total_tasks) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted text-sm mt-4">활성화된 훈련 프로그램이 없습니다.</p>
                        )}
                    </BentoCard>

                    {/* Quick Stats */}
                    <BentoCard className="md:col-span-1" icon={<Activity />} title="STATUS">
                        <div className="mt-2">
                            <span className="text-2xl font-bold block">OPERATIONAL</span>
                            <span className="text-[10px] text-accent font-mono">LATENCY: 24ms</span>
                        </div>
                    </BentoCard>
                    <BentoCard className="md:col-span-1" icon={<Target />} title="RANKING">
                        <div className="mt-2">
                            <span className="text-2xl font-bold block">ELITE</span>
                            <span className="text-[10px] text-accent font-mono">TOP 5% IN REGION</span>
                        </div>
                    </BentoCard>

                    {/* Training Programs */}
                    <div className="md:col-span-4 mt-8">
                        <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-6 flex items-center gap-4">
                            AVAILABLE MODULES <div className="h-[1px] flex-1 bg-white/10" />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {programs.map(prog => {
                                const isActive = trainingProgress.some((tp: TrainingProgress) => tp.program_id === prog.id);
                                return (
                                    <button
                                        key={prog.id}
                                        onClick={() => setActiveProgramId(activeProgramId === prog.id ? null : prog.id)}
                                        disabled={isActive}
                                        className={cn(
                                            "bento-card text-left p-6 transition-all",
                                            isActive && "opacity-50 grayscale border-white/5",
                                            activeProgramId === prog.id && "border-accent ring-1 ring-accent"
                                        )}
                                    >
                                        <div className="text-2xl mb-4 text-accent">{prog.icon}</div>
                                        <h3 className="font-bold text-sm mb-1">{prog.title}</h3>
                                        <p className="text-[10px] text-muted uppercase tracking-tighter mb-4">{prog.weeks} WEEK PROGRAM</p>
                                        {isActive ? (
                                            <span className="text-[10px] font-mono text-accent">ALREADY INITIALIZED</span>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[10px] font-mono text-muted group-hover:text-white transition-colors">
                                                INITIALIZE <ChevronRight size={12} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {activeProgramId && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex justify-end"
                            >
                                <AnimatedButton
                                    onClick={() => startProgram.mutate({
                                        programId: activeProgramId,
                                        programName: programs.find(p => p.id === activeProgramId)?.title || '',
                                        weeks: programs.find(p => p.id === activeProgramId)?.weeks || 0
                                    })}
                                    disabled={startProgram.isPending}
                                >
                                    {startProgram.isPending ? 'INITIALIZING...' : 'START MODULE'}
                                </AnimatedButton>
                            </motion.div>
                        )}
                    </div>

                    {/* Tournament Registration & List Side-by-Side */}
                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <BentoCard title="REGISTER MISSION" icon={<Plus />}>
                            <div className="space-y-4 mt-4">
                                <input
                                    type="text"
                                    value={tournamentName}
                                    onChange={(e) => setTournamentName(e.target.value)}
                                    placeholder="MISSION NAME"
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 font-mono text-xs focus:border-accent focus:outline-none transition-colors"
                                />
                                <input
                                    type="date"
                                    value={tournamentDate}
                                    onChange={(e) => setTournamentDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 font-mono text-xs focus:border-accent focus:outline-none transition-colors"
                                />
                                <AnimatedButton
                                    className="w-full"
                                    onClick={() => registerTournament.mutate({
                                        tournamentName,
                                        tournamentDate,
                                        programType: 'general'
                                    })}
                                    disabled={!tournamentName || !tournamentDate || registerTournament.isPending}
                                >
                                    LOG MISSION
                                </AnimatedButton>
                            </div>
                        </BentoCard>

                        <BentoCard title="MISSION ARCHIVE" icon={<Activity />}>
                            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tournaments.map((t: Tournament) => (
                                    <div key={t.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded hover:border-white/20 transition-colors group">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs uppercase group-hover:text-accent transition-colors">{t.tournament_name}</span>
                                            <span className="text-[10px] text-muted">{new Date(t.tournament_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-[10px] font-mono px-2 py-0.5 border border-white/10 rounded">
                                            {Math.ceil((new Date(t.tournament_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) > 0 ? 'PENDING' : 'COMPLETE'}
                                        </div>
                                    </div>
                                ))}
                                {tournaments.length === 0 && <p className="text-muted text-xs font-mono">NO MISSIONS LOGGED</p>}
                            </div>
                        </BentoCard>
                    </div>
                </div>
            </main>
        </div>
    );
}
