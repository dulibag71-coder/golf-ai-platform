'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Users, CreditCard, Activity, Terminal, ChevronRight,
    CheckCircle, Clock, AlertTriangle, Zap, Server, Database,
    Search, Filter, Download, ExternalLink, RefreshCw, Cpu
} from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { cn } from '@/lib/utils';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';

const ADMIN_PASSWORD = '130824';

interface Payment {
    id: number;
    user_id: number;
    email?: string;
    amount: number;
    sender_name: string;
    plan_name?: string;
    status: string;
    created_at: string;
}

interface User {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    subscription_status?: string;
    subscription_expires_at?: string;
}

interface Stats {
    totalUsers: number;
    totalSwings: number;
    pendingPayments: number;
    revenue: number;
    distribution?: { name: string; value: number }[];
}

interface LogEntry {
    id: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalSwings: 0,
        pendingPayments: 0,
        revenue: 0,
        distribution: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users' | 'analytics'>('overview');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const chartData = [
        { name: 'Mon', users: 400, swings: 2400, revenue: 120000 },
        { name: 'Tue', users: 520, swings: 3100, revenue: 190000 },
        { name: 'Wed', users: 480, swings: 2800, revenue: 150000 },
        { name: 'Thu', users: 610, swings: 3900, revenue: 280000 },
        { name: 'Fri', users: 750, swings: 4800, revenue: 350000 },
        { name: 'Sat', users: 920, swings: 6100, revenue: 420000 },
        { name: 'Sun', users: 840, swings: 5200, revenue: 380000 },
    ];

    // 시스템 로그 자동 생성 (시뮬레이션)
    useEffect(() => {
        if (!isAuthenticated) return;

        const messages = [
            "USER_AUTH_INITIALIZED: SESSION_ID_9921",
            "DATABASE_SYNC_COMPLETE: SHARD_01_OK",
            "NEURAL_ENGINE_UPLINK: LATENCY_12MS",
            "SCANNER_ARRAY_ACTIVE: MONITORING_GRID",
            "ENCRYPTION_LAYER_SET: AES_256_ACTIVE",
            "PAYMENT_GATEWAY_PING: STABLE",
            "LOAD_BALANCER_SYNC: NODE_ALPHA_READY"
        ];

        const interval = setInterval(() => {
            const newLog: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString(),
                type: Math.random() > 0.8 ? 'warning' : 'info',
                message: messages[Math.floor(Math.random() * messages.length)]
            };
            setLogs(prev => [...prev.slice(-19), newLog]);
        }, 3000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // 관리자 비밀번호 인증 확인
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const adminAuth = sessionStorage.getItem('adminAuth');
            if (adminAuth === 'true') {
                setIsAuthenticated(true);
            }
        }
    }, []);

    // 데이터 로딩 및 폴링 (10초 주기로 최신 정보 동기화)
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const [paymentsRes, usersRes, statsRes] = await Promise.all([
                    fetch('/api/admin/payments', { headers }).then(r => r.json()),
                    fetch('/api/admin/users', { headers }).then(r => r.json()),
                    fetch('/api/admin/stats', { headers }).then(r => r.json())
                ]);

                // 실시간 결제 감지 로그 추가
                if (paymentsRes.length > payments.length && payments.length > 0) {
                    const newPayment = paymentsRes[0];
                    setLogs(prev => [...prev, {
                        id: Date.now().toString(),
                        timestamp: new Date().toLocaleTimeString(),
                        type: 'warning',
                        message: `NEW_PAYMENT_DETECTED: ${newPayment.sender_name} (₩${newPayment.amount.toLocaleString()})`
                    }]);
                }

                setPayments(paymentsRes);
                setUsers(usersRes);
                setStats(statsRes);
            } catch (error) {
                console.error('Core data sync error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        const pollInterval = setInterval(loadData, 10000);
        return () => clearInterval(pollInterval);
    }, [isAuthenticated, payments.length]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuth', 'true');
            setIsAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('인가되지 않은 접근 코드입니다.');
        }
    };

    const handleApprove = async (paymentId: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ paymentId })
            });

            if (res.ok) {
                setPayments(payments.filter(p => p.id !== paymentId));
                setStats(prev => ({ ...prev, pendingPayments: prev.pendingPayments - 1 }));
            }
        } catch (e) {
            console.error('Approval failed:', e);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 animate-scan" />

                <Navbar />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl mx-auto flex items-center justify-center mb-6 relative group">
                                <Shield className="text-accent group-hover:scale-110 transition-transform" size={32} />
                                <div className="absolute inset-0 border-2 border-accent rounded-2xl animate-ping opacity-20" />
                            </div>
                            <h2 className="font-display text-3xl font-black tracking-tighter italic uppercase tech-glow">Admin <span className="text-accent">Auth</span></h2>
                            <p className="text-muted font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Neural Link Verification Required</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                                    <Terminal size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ACCESS_CODE_REQUIRED"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-center tracking-[0.5em]"
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                </div>
                            </div>

                            {passwordError && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-[10px] font-mono uppercase tracking-widest"
                                >
                                    <AlertTriangle size={14} />
                                    {passwordError}
                                </motion.div>
                            )}

                            <AnimatedButton type="submit" className="w-full h-14 relative group overflow-hidden">
                                <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-widest text-xs italic uppercase">
                                    Initialize Control Panel <ChevronRight size={18} />
                                </span>
                            </AnimatedButton>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-muted uppercase tracking-widest opacity-40">
                            <div>ENC_AES_256</div>
                            <div>LOC_KR_SEOUL</div>
                            <div>SEC_L5_ACTIVE</div>
                        </div>
                    </div>

                    <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-muted hover:text-accent transition-colors font-mono text-[10px] uppercase tracking-widest">
                        <ChevronRight className="rotate-180" size={14} /> Return to Grid
                    </Link>
                </motion.div>

                {/* Decorative Elements */}
                <div className="fixed bottom-10 left-10 text-white/5 font-mono text-[120px] font-black pointer-events-none -rotate-12 italic uppercase select-none">ADMIN</div>
                <div className="fixed top-10 right-10 text-white/5 font-mono text-[120px] font-black pointer-events-none rotate-12 italic uppercase select-none tracking-tighter">SECURE</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30 overflow-x-hidden relative">
            {/* Background Grid & Glows */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_70%)] pointer-events-none" />
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 relative z-10">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                                System Administrator Access
                            </div>
                            <div className="px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent rounded-full animate-ping" />
                                Uplink: Operational
                            </div>
                        </motion.div>
                        <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter tech-glow italic uppercase leading-none">
                            COMMAND <span className="text-accent underline decoration-accent/30 underline-offset-8">DASHBOARD</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
                        {(['overview', 'payments', 'users', 'analytics'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all flex items-center gap-2",
                                    activeTab === tab
                                        ? "bg-accent text-black shadow-[0_0_25px_rgba(0,242,255,0.4)] scale-105"
                                        : "text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tab === 'overview' && <Activity size={12} />}
                                {tab === 'payments' && <CreditCard size={12} />}
                                {tab === 'users' && <Users size={12} />}
                                {tab === 'analytics' && <Zap size={12} />}

                                {tab === 'overview' ? '개요' : tab === 'payments' ? '결제 관리' : tab === 'users' ? '유저 관리' : '데이터 분석'}

                                {tab === 'payments' && stats.pendingPayments > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px] animate-pulse">
                                        {stats.pendingPayments}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <BentoCard
                                    icon={<Users className="text-blue-400" />}
                                    title="유저 현황"
                                    subtitle="전체 등록 개체"
                                    className="group hover:border-blue-500/50 transition-all duration-500"
                                >
                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <span className="text-5xl font-display font-black italic tracking-tighter">{stats.totalUsers}</span>
                                            <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Entities</span>
                                        </div>
                                        <div className="h-10 w-20 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <Area type="monotone" dataKey="users" stroke="#60a5fa" fill="url(#colorUsers)" fillOpacity={0.1} />
                                                    <defs>
                                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </BentoCard>

                                <BentoCard
                                    icon={<Activity className="text-green-400" />}
                                    title="분석 활동"
                                    subtitle="총 로깅 데이터"
                                    className="group hover:border-green-500/50 transition-all duration-500"
                                >
                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <span className="text-5xl font-display font-black italic tracking-tighter text-green-400 tech-glow">{stats.totalSwings}</span>
                                            <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Ops</span>
                                        </div>
                                        <Activity className="text-green-500/20 group-hover:text-green-500 animate-pulse transition-colors" size={40} />
                                    </div>
                                </BentoCard>

                                <BentoCard
                                    icon={<CreditCard className="text-yellow-400" />}
                                    title="대기 트랜잭션"
                                    subtitle="검증 필요 항목"
                                    className="group hover:border-yellow-500/50 transition-all duration-500"
                                >
                                    <div className="mt-4 flex items-end justify-between">
                                        <div>
                                            <span className="text-5xl font-display font-black italic tracking-tighter text-yellow-400">{stats.pendingPayments}</span>
                                            <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Pending</span>
                                        </div>
                                        <AlertTriangle className="text-yellow-500/20 group-hover:text-yellow-500 animate-bounce transition-colors" size={40} />
                                    </div>
                                </BentoCard>

                                <BentoCard
                                    icon={<Terminal className="text-purple-400" />}
                                    title="프로토콜 수익"
                                    subtitle="누적 결제 할당량"
                                    className="group hover:border-purple-500/50 transition-all duration-500"
                                >
                                    <div className="mt-4">
                                        <span className="text-3xl font-display font-black italic tracking-tighter text-purple-400 tech-glow">₩{stats.revenue.toLocaleString()}</span>
                                        <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: '65%' }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </BentoCard>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-display text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                            <Clock className="text-accent" size={20} />
                                            RECENT <span className="text-accent">TRANSFERS</span>
                                        </h2>
                                        <Link href="#" onClick={() => setActiveTab('payments')} className="text-[10px] font-mono text-muted hover:text-accent tracking-widest transition-colors uppercase">View All →</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {payments.slice(0, 5).map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group/item hover:border-accent/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover/item:rotate-12 transition-transform">
                                                        <Zap size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-black text-sm tracking-tighter uppercase italic">{p.sender_name}</p>
                                                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">₩{p.amount.toLocaleString()} | {p.plan_name}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleApprove(p.id)}
                                                    className="px-4 py-2 bg-accent text-black rounded-xl text-[9px] font-black tracking-widest uppercase hover:shadow-[0_0_15px_rgba(0,242,255,0.5)] transition-all"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))}
                                        {payments.length === 0 && (
                                            <div className="text-center py-12">
                                                <CheckCircle size={32} className="mx-auto text-muted/20 mb-3" />
                                                <p className="text-muted font-mono text-[10px] uppercase tracking-widest">No Pending Operations</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-display text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                            <Server className="text-blue-400" size={20} />
                                            NEWLY <span className="text-blue-400">INITIALIZED</span>
                                        </h2>
                                        <Link href="#" onClick={() => setActiveTab('users')} className="text-[10px] font-mono text-muted hover:text-blue-400 tracking-widest transition-colors uppercase">View All →</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {users.slice(0, 5).map(u => (
                                            <div key={u.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400">
                                                        <Users size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-xs text-white break-all max-w-[150px] md:max-w-none">{u.email}</p>
                                                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">{new Date(u.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[8px] font-black tracking-widest uppercase",
                                                    u.role === 'admin' ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-muted"
                                                )}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <BentoCard title="유저 성장 추이" subtitle="Daily Registration Curve" className="lg:col-span-2 p-8">
                                    <div className="h-[300px] w-full mt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorUsersFull" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '12px', fontSize: '10px' }}
                                                    itemStyle={{ color: '#00f2ff' }}
                                                />
                                                <Area type="monotone" dataKey="users" stroke="#00f2ff" fillOpacity={1} fill="url(#colorUsersFull)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </BentoCard>

                                <BentoCard title="플랜 분포" subtitle="Subscription Segments" className="p-8">
                                    <div className="h-[300px] w-full mt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.distribution && stats.distribution.length > 0 ? stats.distribution : [
                                                { name: 'USER', value: 45 },
                                                { name: 'PRO', value: 30 },
                                                { name: 'ELITE', value: 15 },
                                                { name: 'CLUB', value: 10 }
                                            ]}>
                                                <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {(stats.distribution || [0, 1, 2, 3]).map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={['#ffffff20', '#00f2ff', '#a855f7', '#fbbf24', '#f87171'][index % 5]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </BentoCard>
                            </div>

                            <BentoCard title="시스템 활동 데이터" subtitle="AI Pulse Monitoring" className="p-8">
                                <div className="h-[200px] w-full mt-6 text-accent">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <Line type="stepAfter" dataKey="swings" stroke="#00f2ff" strokeWidth={2} dot={false} />
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </BentoCard>
                        </motion.div>
                    )}

                    {(activeTab === 'payments' || activeTab === 'users') && (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
                        >
                            <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="font-display text-2xl font-black italic tracking-tighter uppercase">
                                    {activeTab === 'payments' ? 'PENDING' : 'USER'} <span className={activeTab === 'payments' ? "text-accent" : "text-blue-400"}>
                                        {activeTab === 'payments' ? 'SETTLEMENTS' : 'MANIFEST'}
                                    </span>
                                </h1>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                        <input
                                            type="text"
                                            placeholder="SEARCH_QUERY..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-mono focus:outline-none focus:border-accent w-full md:w-64"
                                        />
                                    </div>
                                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                        <Filter size={14} className="text-muted" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[10px]">
                                    <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-muted">
                                        <tr>
                                            {activeTab === 'payments' ? (
                                                <>
                                                    <th className="p-6">Entity_ID</th>
                                                    <th className="p-6">Sender_Ident</th>
                                                    <th className="p-6">Target_Plan</th>
                                                    <th className="p-6">Quota_Amount</th>
                                                    <th className="p-6">Status</th>
                                                    <th className="p-6 text-right">Action</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="p-6">Entity_ID</th>
                                                    <th className="p-6">Communication_Uplink</th>
                                                    <th className="p-6">Role_Tier</th>
                                                    <th className="p-6">Subscription</th>
                                                    <th className="p-6">Registry_Date</th>
                                                    <th className="p-6 text-right">Status</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {activeTab === 'payments' ? (
                                            payments.filter(p =>
                                                p.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                p.id.toString().includes(searchQuery) ||
                                                p.plan_name?.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).map((p) => (
                                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="p-6 text-white">{p.id}</td>
                                                    <td className="p-6">
                                                        <p className="font-bold text-white uppercase">{p.sender_name}</p>
                                                        <p className="text-muted opacity-50">{p.email || 'NO_EMAIL'}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md border border-green-500/20 uppercase">
                                                            {p.plan_name || 'PRO_PROTOCOL'}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-accent">₩{p.amount.toLocaleString()}</td>
                                                    <td className="p-6 text-yellow-400">PENDING_VRF</td>
                                                    <td className="p-6 text-right">
                                                        <button
                                                            onClick={() => handleApprove(p.id)}
                                                            className="px-4 py-2 bg-accent text-black rounded-lg font-black tracking-widest uppercase hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all"
                                                        >
                                                            APPROVE
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            users.filter(u =>
                                                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                u.id.toString().includes(searchQuery) ||
                                                u.role.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).map((u) => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-6 text-white">{u.id}</td>
                                                    <td className="p-6 text-blue-400">{u.email}</td>
                                                    <td className="p-6">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-md border uppercase",
                                                            u.role === 'admin' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                                                u.role === 'pro' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                                    "bg-white/5 text-muted border-white/10"
                                                        )}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-md uppercase",
                                                            u.subscription_status === 'active' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                                        )}>
                                                            {u.subscription_status || 'INACTIVE'}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                                                    <td className="p-6 text-right">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {((activeTab === 'payments' && payments.length === 0) || (activeTab === 'users' && users.length === 0)) && (
                                    <div className="p-20 text-center">
                                        <CheckCircle size={48} className="mx-auto text-accent/20 mb-4" />
                                        <p className="font-mono text-xs text-muted uppercase tracking-[0.2em]">Synchronized</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Terminal (Sticky Bottom) */}
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 h-48 overflow-hidden z-20 group"
                >
                    <div className="max-w-7xl mx-auto flex h-full gap-8">
                        <div className="hidden lg:flex flex-col justify-center gap-4 w-48 border-r border-white/5">
                            <div className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase">
                                <Cpu size={14} />
                                Core_Load: 12%
                            </div>
                            <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] uppercase">
                                <Database size={14} />
                                DB_Cluster: Healthy
                            </div>
                            <div className="flex items-center gap-2 text-green-400 font-mono text-[10px] uppercase">
                                <RefreshCw size={14} className="animate-spin-slow" />
                                Auto_Sync: ON
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto font-mono text-[10px] text-muted space-y-1 scrollbar-hide">
                            <div className="flex items-center gap-2 text-accent/50 mb-2">
                                <Terminal size={12} />
                                <span>CENTRAL_SYSTEM_UPLINK_v4.2.0</span>
                            </div>
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-4 opacity-70 hover:opacity-100 transition-opacity">
                                    <span className="text-white/30">[{log.timestamp}]</span>
                                    <span className={cn(
                                        "uppercase font-bold w-16",
                                        log.type === 'warning' ? "text-yellow-500" : "text-blue-400"
                                    )}>
                                        :: {log.type}
                                    </span>
                                    <span className="text-white/80">{log.message}</span>
                                </div>
                            ))}
                            <div ref={terminalEndRef} />
                        </div>

                        <div className="hidden md:flex flex-col items-end justify-between py-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-mono hover:bg-white/10 transition-all uppercase tracking-widest">
                                <Download size={12} /> Export_Log
                            </button>
                            <div className="text-[9px] font-mono text-muted uppercase tracking-[0.3em] opacity-40">
                                PROVIEW_AI_ADMIN_SUBSYSTEM
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
