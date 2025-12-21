'use client';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import {
    Activity,
    Upload,
    Zap,
    Target,
    BarChart3,
    Cpu,
    Maximize2,
    TrendingUp,
    Layers,
    Brain,
    AlertCircle,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const PLAN_LIMITS: Record<string, { swingLimit: number; aiCoach: boolean; report: boolean; training: boolean; storage: string }> = {
    'user': { swingLimit: 3, aiCoach: false, report: false, training: false, storage: '0GB' },
    'pro': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '100GB' },
    'elite': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '무제한' },
    'club_starter': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '500GB' },
    'club_pro': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '2TB' },
    'club_enterprise': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '무제한' }
};

// Mock history data for Performance Chronicle
const performanceData = [
    { date: '12/15', score: 68 },
    { date: '12/16', score: 72 },
    { date: '12/17', score: 70 },
    { date: '12/18', score: 75 },
    { date: '12/19', score: 82 },
    { date: '12/20', score: 78 },
    { date: '12/21', score: 85 },
];

export default function Dashboard() {
    const [token, setToken] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('user');
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [swingCount, setSwingCount] = useState(0);
    const [activeSection, setActiveSection] = useState<'biometrics' | 'chronicle' | 'comparison'>('biometrics');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const t = localStorage.getItem('token');
            if (!t) {
                window.location.href = '/login';
                return;
            }
            setToken(t);

            const fetchUserInfo = async () => {
                try {
                    const userData = await api.get('/auth/me', t);
                    if (userData && userData.role) {
                        setUserRole(userData.role);
                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                        user.role = userData.role;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                } catch (e) {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    setUserRole(user.role || 'user');
                }
            };
            fetchUserInfo();
        }
    }, []);

    const limits = PLAN_LIMITS[userRole] || PLAN_LIMITS['user'];
    const canAnalyze = limits.swingLimit === -1 || swingCount < limits.swingLimit;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !token) return;
        if (!canAnalyze) return;

        setAnalyzing(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('video', file);

            // Simulating high-tech delay for "neural processing"
            await new Promise(r => setTimeout(r, 2000));

            const uploadRes = await api.post('/swing/upload', formData, token, true);
            const videoId = uploadRes.videoId;

            const analysisRes = await api.post('/swing/analyze', {
                videoId,
                keypoints: { dummy: 'data' }
            }, token);

            setResult(analysisRes.result);
            setSwingCount(prev => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const comparisonData = useMemo(() => {
        if (!result) return [];
        return [
            { subject: 'Consistency', A: result.score_consistency, B: 95, fullMark: 100 },
            { subject: 'Stability', A: result.score_stability, B: 92, fullMark: 100 },
            { subject: 'Impact', A: result.score_impact, B: 98, fullMark: 100 },
            { subject: 'Posture', A: (result.score_total + 10) / 1.2, B: 90, fullMark: 100 },
            { subject: 'Tempo', A: 85, B: 88, fullMark: 100 },
        ];
    }, [result]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30 overflow-x-hidden">
            <Navbar />

            <main className="max-w-[1600px] mx-auto px-6 pt-24 pb-16">
                {/* Header Status Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded bg-accent/10 flex items-center justify-center border border-accent/20 relative group-hover:border-accent/50 transition-colors">
                            <div className="absolute inset-0 bg-accent/5 animate-pulse rounded" />
                            <Cpu size={24} className="text-accent relative z-10" />
                        </div>
                        <div>
                            <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted mb-1 opacity-70">SYSTEM_INSTANCE / V2.1</h2>
                            <p className="font-display font-black text-lg flex items-center gap-2 uppercase tracking-tighter italic">
                                인텔리전스 <span className="text-accent tech-glow">커맨드</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping ml-1" />
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div>
                            <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted text-right mb-1 opacity-70">OPERATIONAL_MODE</h2>
                            <p className="font-display font-bold text-sm text-right text-accent uppercase tracking-widest tech-glow">
                                {userRole === 'user' ? '게스트_프로토콜' : `${userRole.replace('_', '_').toUpperCase()}_코어`}
                            </p>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                        <div>
                            <h2 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted text-right mb-1 opacity-70">RESOURCE_QUOTA</h2>
                            <p className="font-display font-bold text-sm text-right tracking-widest text-white/90">
                                {limits.swingLimit === -1 ? '무제한 액세스' : `${swingCount} / ${limits.swingLimit} 스캔 작업`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: Upload & Input Control */}
                    <div className="lg:col-span-4 space-y-6">
                        <BentoCard icon={<Upload className="text-accent" />} title="데이터 수집" subtitle="스윙 텔레메트리 업로드">
                            <div className="mt-4">
                                <label className="block group cursor-pointer">
                                    <div className={cn(
                                        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300",
                                        file ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/30 hover:bg-white/5"
                                    )}>
                                        <input type="file" onChange={handleFileChange} className="hidden" accept="video/*" />
                                        <Layers size={32} className={cn("mb-4 transition-colors", file ? "text-accent" : "text-muted")} />
                                        <p className="font-mono text-[10px] uppercase tracking-widest mb-1">
                                            {file ? file.name : "비디오 파일 선택"}
                                        </p>
                                        <p className="text-[10px] text-muted opacity-50 uppercase">MP4, MOV | MAX 100MB</p>
                                    </div>
                                </label>

                                <AnimatedButton
                                    onClick={handleUpload}
                                    disabled={!file || analyzing || !canAnalyze}
                                    className="w-full mt-6 py-4"
                                >
                                    {analyzing ? (
                                        <span className="flex items-center gap-2 justify-center">
                                            <RefreshCw size={16} className="animate-spin" /> 신경망 스캔 실행 중...
                                        </span>
                                    ) : !canAnalyze ? (
                                        "프로토콜 업그레이드 필요"
                                    ) : (
                                        <>분석 시작 <Zap size={14} className="inline ml-2 fill-current" /></>
                                    )}
                                </AnimatedButton>
                            </div>
                        </BentoCard>

                        {/* Practice Regimen Generator */}
                        <BentoCard icon={<Brain className="text-accent" />} title="AI 전략" subtitle="연습 프로그램">
                            <div className="mt-2 space-y-4">
                                {result ? (
                                    <>
                                        <p className="text-xs text-muted leading-relaxed italic">
                                            "Based on stability deficits, prioritize single-leg drills to recalibrate balance metrics."
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            <div className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-colors">
                                                <span className="font-mono text-[10px] uppercase tracking-widest">밸런스 프로토콜 #01</span>
                                                <ChevronRight size={14} className="text-muted group-hover:text-accent" />
                                            </div>
                                            <div className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/30 transition-colors">
                                                <span className="font-mono text-[10px] uppercase tracking-widest">임팩트 재교정</span>
                                                <ChevronRight size={14} className="text-muted group-hover:text-accent" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-[10px] text-muted uppercase tracking-widest mt-4">텔레메트리 분석 대기 중...</p>
                                )}
                            </div>
                        </BentoCard>

                        {/* Veo 3.1 3D Preview Prompt */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bento-card bg-gradient-to-br from-accent/20 to-purple-500/10 border-accent/20 p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Maximize2 size={40} className="text-accent" />
                            </div>
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">실험적 기능</h3>
                            <h2 className="text-xl font-bold tracking-tighter mb-4">VEO 3.1 3D 생성</h2>
                            범용 3D 재구성 프로토콜. 정적 비디오 데이터에서 고충실도 시네마틱 리플레이를 생성합니다.
                            <AnimatedButton variant="outline" size="sm" className="w-full text-[10px]">
                                3D 재구성 요청
                            </AnimatedButton>
                        </motion.div>
                    </div>

                    {/* RIGHT: Main Analytics Readout */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Analysis Display / Visualization Area */}
                            <div className="md:col-span-2 min-h-[500px] bg-white/5 border border-white/10 rounded-2xl relative flex flex-col overflow-hidden">
                                {/* Tab Navigation */}
                                <div className="flex border-b border-white/10 overflow-hidden rounded-t-2xl">
                                    <button
                                        onClick={() => setActiveSection('biometrics')}
                                        className={cn(
                                            "flex-1 py-5 font-mono text-[9px] uppercase tracking-[0.3em] transition-all relative group",
                                            activeSection === 'biometrics' ? "bg-accent/10 text-white" : "text-muted hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Activity size={14} className={cn("inline mr-2", activeSection === 'biometrics' ? "text-accent tech-glow" : "opacity-50")} />
                                        Biometric_Readout
                                        {activeSection === 'biometrics' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_var(--accent-glow)]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('chronicle')}
                                        className={cn(
                                            "flex-1 py-5 font-mono text-[9px] uppercase tracking-[0.3em] transition-all relative group",
                                            activeSection === 'chronicle' ? "bg-accent/10 text-white" : "text-muted hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <BarChart3 size={14} className={cn("inline mr-2", activeSection === 'chronicle' ? "text-accent tech-glow" : "opacity-50")} />
                                        Perf_Chronicle
                                        {activeSection === 'chronicle' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_var(--accent-glow)]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('comparison')}
                                        className={cn(
                                            "flex-1 py-5 font-mono text-[9px] uppercase tracking-[0.3em] transition-all relative group",
                                            activeSection === 'comparison' ? "bg-accent/10 text-white" : "text-muted hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Target size={14} className={cn("inline mr-2", activeSection === 'comparison' ? "text-accent tech-glow" : "opacity-50")} />
                                        Pro_Comparison
                                        {activeSection === 'comparison' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_var(--accent-glow)]" />}
                                    </button>
                                </div>

                                <div className="flex-1 p-8 relative flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {analyzing ? (
                                            <motion.div
                                                key="scanning"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex flex-col items-center gap-6"
                                            >
                                                <div className="relative">
                                                    <div className="h-32 w-32 border-2 border-accent/20 rounded-full animate-ping" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Cpu size={48} className="text-accent animate-pulse" />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-2">신경망 동기화 중</h3>
                                                    <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-accent"
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : !result && activeSection === 'biometrics' ? (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="text-center space-y-4"
                                            >
                                                <Activity size={48} className="mx-auto text-muted opacity-20" />
                                                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">텔레메트리 패킷 대기 중</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={activeSection}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="w-full h-full"
                                            >
                                                {activeSection === 'biometrics' && result && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full content-center">
                                                        <TelemetryItem label="종합 평가" value={result.score_total} color="accent" />
                                                        <TelemetryItem label="운동 안정성" value={result.score_stability} />
                                                        <TelemetryItem label="임팩트 벡터" value={result.score_impact} />
                                                        <TelemetryItem label="신경망 일관성" value={result.score_consistency} />

                                                        {/* Digital Scan Log */}
                                                        <div className="col-span-2 md:col-span-4 mt-8 p-6 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <div className="h-6 w-6 rounded bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                                                    <AlertCircle size={14} className="text-red-500 animate-pulse" />
                                                                </div>
                                                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-red-500 tech-glow">CRITICAL_DIAGNOSIS_LOG</span>
                                                            </div>
                                                            <ul className="space-y-4">
                                                                {result.diagnosis_problems?.map((p: string, i: number) => (
                                                                    <li key={i} className="flex gap-5 items-start group/item">
                                                                        <span className="font-mono text-[9px] text-muted mt-1 opacity-30 group-hover/item:opacity-100 transition-opacity">0x0{i + 1}</span>
                                                                        <span className="font-display text-sm uppercase tracking-tight text-white/80 group-hover/item:text-white transition-colors">{p}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeSection === 'chronicle' && (
                                                    <div className="h-full w-full py-4">
                                                        <div className="flex justify-between items-center mb-8">
                                                            <h3 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted">성장 벡터 분석</h3>
                                                            <div className="flex items-center gap-2 text-accent text-xs font-display font-bold italic tech-glow">
                                                                <TrendingUp size={14} /> +12.4% 교정됨
                                                            </div>
                                                        </div>
                                                        <ResponsiveContainer width="100%" height="80%">
                                                            <LineChart data={performanceData}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                                <XAxis
                                                                    dataKey="date"
                                                                    stroke="#ffffff20"
                                                                    fontSize={10}
                                                                    tickLine={false}
                                                                    axisLine={false}
                                                                    fontFamily="JetBrains Mono"
                                                                />
                                                                <YAxis
                                                                    stroke="#ffffff20"
                                                                    fontSize={10}
                                                                    tickLine={false}
                                                                    axisLine={false}
                                                                    domain={[0, 100]}
                                                                    fontFamily="JetBrains Mono"
                                                                />
                                                                <Tooltip
                                                                    contentStyle={{ background: '#050505', border: '1px solid #39FF1430', borderRadius: '12px', fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#fff' }}
                                                                    cursor={{ stroke: '#39FF1420' }}
                                                                />
                                                                <Line
                                                                    type="monotone"
                                                                    dataKey="score"
                                                                    stroke="#39FF14"
                                                                    strokeWidth={3}
                                                                    dot={{ fill: '#39FF14', r: 4, strokeWidth: 2, stroke: '#050505' }}
                                                                    activeDot={{ r: 6, stroke: '#39FF14', strokeWidth: 2, fill: '#050505' }}
                                                                />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                )}

                                                {activeSection === 'comparison' && result && (
                                                    <div className="h-full w-full flex flex-col md:flex-row items-center gap-8">
                                                        <div className="flex-1 w-full h-[350px]">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                                                                    <PolarGrid stroke="#ffffff05" />
                                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                                                    <Radar
                                                                        name="Subject"
                                                                        dataKey="A"
                                                                        stroke="#39FF14"
                                                                        fill="#39FF14"
                                                                        fillOpacity={0.2}
                                                                    />
                                                                    <Radar
                                                                        name="Elite Pro"
                                                                        dataKey="B"
                                                                        stroke="#ffffff20"
                                                                        fill="#ffffff10"
                                                                        fillOpacity={0.05}
                                                                    />
                                                                    <Tooltip
                                                                        contentStyle={{ background: '#050505', border: '1px solid #39FF1430', borderRadius: '12px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                                                                    />
                                                                </RadarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                        <div className="w-full md:w-72 space-y-6">
                                                            <div className="p-6 border border-white/10 rounded-2xl bg-white/5 relative overflow-hidden group/card">
                                                                <div className="absolute top-0 right-0 w-8 h-8 opacity-10 group-hover/card:opacity-30 transition-opacity">
                                                                    <Zap size={32} className="text-accent" />
                                                                </div>
                                                                <h4 className="font-mono text-[9px] uppercase text-muted mb-3 tracking-[0.2em]">신경망_벤치마크</h4>
                                                                <p className="font-display font-black text-xl italic tracking-tighter mb-4">일치율: <span className="text-accent tech-glow">74.2%</span></p>
                                                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: "74.2%" }}
                                                                        className="h-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className="font-mono text-[9px] text-muted uppercase tracking-[0.2em] leading-loose opacity-50">
                                                                BENCHMARK_대상:<br />
                                                                <span className="text-white opacity-100">JIN YOUNG KO (LPGA_SIG_01)</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {!result && (activeSection === 'comparison' || activeSection === 'biometrics') && (
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="text-center opacity-30 select-none">
                                                            <Brain size={64} className="mx-auto mb-4" />
                                                            <p className="font-mono text-xs uppercase tracking-widest leading-relaxed">시스템 대기 중<br />미션 데이터 로드</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function TelemetryItem({ label, value, color = "white" }: { label: string, value: number, color?: "white" | "accent" }) {
    return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center text-center group transition-all hover:border-accent/30 hover:bg-accent/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-30 transition-opacity">
                <BarChart3 size={40} className="text-white" />
            </div>
            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted mb-4 group-hover:text-white transition-colors relative z-10">
                {label}
            </h4>
            <div className="relative inline-block mx-auto mb-2 z-10">
                <span className={cn(
                    "font-display text-5xl font-black italic tracking-tighter leading-none",
                    color === "accent" ? "text-accent tech-glow" : "text-white group-hover:text-accent group-hover:tech-glow transition-all"
                )}>
                    {value}
                </span>
                <span className="absolute -top-1 -right-6 font-mono text-[8px] text-muted opacity-50 uppercase tracking-tighter">pts_</span>
            </div>
            <div className="mt-4 flex gap-1 justify-center z-10">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1 w-1.5 rounded-full transition-all duration-300",
                            i < (value / 100) * 15
                                ? (color === "accent" ? "bg-accent shadow-[0_0_5px_var(--accent-glow)]" : "bg-white group-hover:bg-accent group-hover:shadow-[0_0_5px_var(--accent-glow)]")
                                : "bg-white/10"
                        )}
                        style={{ transitionDelay: `${i * 20}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
