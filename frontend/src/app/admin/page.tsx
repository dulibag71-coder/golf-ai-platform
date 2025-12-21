'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, CreditCard, Activity, Terminal, ChevronRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { cn } from '@/lib/utils';

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
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSwings: 0, pendingPayments: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');

    // 관리자 비밀번호 인증 확인
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const adminAuth = sessionStorage.getItem('adminAuth');
            if (adminAuth === 'true') {
                setIsAuthenticated(true);
            }
        }
    }, []);

    // 데이터 로딩 (인증 후에만 실행)
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadData = async () => {
            // Mock data fallback
            const mockPayments: Payment[] = [
                { id: 1, user_id: 1, email: 'user1@test.com', amount: 29900, sender_name: '박두리', plan_name: '프로 코어', status: 'pending', created_at: new Date().toISOString() },
                { id: 2, user_id: 2, email: 'user2@test.com', amount: 59900, sender_name: '김테스트', plan_name: '엘리트 커맨드', status: 'pending', created_at: new Date().toISOString() },
            ];
            const mockUsers: User[] = [
                { id: 1, email: 'admin@golf.ai', role: 'admin', is_active: true, created_at: '2024-01-01' },
                { id: 2, email: 'user1@test.com', role: 'pro', is_active: true, created_at: '2024-12-15', subscription_status: 'active' },
                { id: 3, email: 'user2@test.com', role: 'user', is_active: true, created_at: '2024-12-20' },
            ];
            const mockStats = { totalUsers: 3, totalSwings: 156, pendingPayments: 2, revenue: 89800 };

            try {
                const token = localStorage.getItem('token');

                const [paymentsRes, usersRes, statsRes] = await Promise.all([
                    fetch('/api/admin/payments', {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    }).then(r => r.ok ? r.json() : mockPayments).catch(() => mockPayments),
                    fetch('/api/admin/users', {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    }).then(r => r.ok ? r.json() : mockUsers).catch(() => mockUsers),
                    fetch('/api/admin/stats', {
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    }).then(r => r.ok ? r.json() : mockStats).catch(() => mockStats)
                ]);

                // Use API data if available, otherwise use mock
                setPayments(paymentsRes.length > 0 ? paymentsRes : mockPayments);
                setUsers(usersRes.length > 0 ? usersRes : mockUsers);
                setStats({
                    totalUsers: statsRes.totalUsers || mockStats.totalUsers,
                    totalSwings: statsRes.totalSwings || mockStats.totalSwings,
                    pendingPayments: statsRes.pendingPayments || mockStats.pendingPayments,
                    revenue: statsRes.revenue || mockStats.revenue
                });
            } catch (error) {
                console.error('Data load error:', error);
                // Use mock data on error
                setPayments(mockPayments);
                setUsers(mockUsers);
                setStats(mockStats);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isAuthenticated]);

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
            <div className="min-h-screen bg-black flex items-center justify-center font-sans selection:bg-accent/30 p-6">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={120} />
                        </div>

                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-block px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                                Secure Authorization
                            </div>
                            <h1 className="font-display text-3xl font-black tracking-tighter tech-glow mb-2 uppercase italic">ADMIN <span className="text-accent">TERMINAL</span></h1>
                            <p className="text-muted text-[10px] font-mono uppercase tracking-widest opacity-60">Master Command Uplink Required</p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Access Key</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="KEY_CODE"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-accent font-mono text-sm tracking-[0.5em] text-center"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-red-500 font-mono text-[10px] uppercase mt-2">Error: {passwordError}</p>
                                )}
                            </div>

                            <AnimatedButton type="submit" variant="primary" className="w-full py-4 font-black tracking-[0.2em] text-xs">
                                INITIALIZE UPLINK
                            </AnimatedButton>
                        </form>

                        <Link href="/" className="block text-center text-muted hover:text-white mt-8 font-mono text-[10px] uppercase tracking-widest transition-colors">
                            ← Return to Grid
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30 overflow-x-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-16">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-block px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                        >
                            System Administrator Access
                        </motion.div>
                        <h1 className="font-display text-5xl font-black tracking-tighter tech-glow italic uppercase">COMMAND <span className="text-accent">DASHBOARD</span></h1>
                    </div>

                    <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                        {(['overview', 'payments', 'users'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all",
                                    activeTab === tab ? "bg-accent text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]" : "text-muted hover:text-white"
                                )}
                            >
                                {tab === 'overview' ? '개요' : tab === 'payments' ? '결제 관리' : '유저 관리'}
                                {tab === 'payments' && stats.pendingPayments > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[8px]">{stats.pendingPayments}</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                <BentoCard icon={<Users className="text-blue-400" />} title="유저 현황" subtitle="전체 등록 개체">
                                    <div className="mt-4">
                                        <span className="text-4xl font-display font-black italic tracking-tighter">{stats.totalUsers}</span>
                                        <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Entities</span>
                                    </div>
                                </BentoCard>
                                <BentoCard icon={<Activity className="text-green-400" />} title="분석 활동" subtitle="총 로깅 데이터">
                                    <div className="mt-4">
                                        <span className="text-4xl font-display font-black italic tracking-tighter text-green-400 tech-glow">{stats.totalSwings}</span>
                                        <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Ops</span>
                                    </div>
                                </BentoCard>
                                <BentoCard icon={<CreditCard className="text-yellow-400" />} title="대기 트랜잭션" subtitle="검증 필요 항목">
                                    <div className="mt-4">
                                        <span className="text-4xl font-display font-black italic tracking-tighter text-yellow-400">{stats.pendingPayments}</span>
                                        <span className="text-[10px] text-muted font-mono ml-2 uppercase tracking-widest">Pending</span>
                                    </div>
                                </BentoCard>
                                <BentoCard icon={<Terminal className="text-purple-400" />} title="월간 프로토콜 수익" subtitle="누적 결제 할당량">
                                    <div className="mt-4">
                                        <span className="text-3xl font-display font-black italic tracking-tighter text-purple-400 tech-glow">₩{stats.revenue.toLocaleString()}</span>
                                    </div>
                                </BentoCard>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-display text-xl font-black italic tracking-tighter uppercase">RECENT <span className="text-accent">TRANSFERS</span></h2>
                                        <Link href="#" onClick={() => setActiveTab('payments')} className="text-[10px] font-mono text-muted hover:text-accent tracking-widest transition-colors uppercase">View All →</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {payments.slice(0, 5).map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group/item hover:border-accent/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                                        <Clock size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-black text-sm tracking-tighter uppercase italic">{p.sender_name}</p>
                                                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest">₩{p.amount.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleApprove(p.id)}
                                                    className="px-4 py-2 bg-accent text-black rounded-xl text-[9px] font-black tracking-widest uppercase hover:scale-105 transition-transform"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))}
                                        {payments.length === 0 && <p className="text-center py-12 text-muted font-mono text-[10px] uppercase tracking-widest">No Pending Operations</p>}
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="font-display text-xl font-black italic tracking-tighter uppercase">NEWLY <span className="text-blue-400">INITIALIZED</span></h2>
                                        <Link href="#" onClick={() => setActiveTab('users')} className="text-[10px] font-mono text-muted hover:text-blue-400 tracking-widest transition-colors uppercase">View All →</Link>
                                    </div>
                                    <div className="space-y-4">
                                        {users.slice(0, 5).map(u => (
                                            <div key={u.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
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

                    {activeTab === 'payments' && (
                        <motion.div
                            key="payments"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10">
                                <h1 className="font-display text-2xl font-black italic tracking-tighter uppercase">PENDING <span className="text-accent">SETTLEMENTS</span></h1>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[10px]">
                                    <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-muted">
                                        <tr>
                                            <th className="p-6">Entity_ID</th>
                                            <th className="p-6">Sender_Ident</th>
                                            <th className="p-6">Target_Plan</th>
                                            <th className="p-6">Quota_Amount</th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {payments.map((p) => (
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
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => handleApprove(p.id)}
                                                        className="px-4 py-2 bg-accent text-black rounded-lg font-black tracking-widest uppercase hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all"
                                                    >
                                                        APPROVE
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {payments.length === 0 && (
                                    <div className="p-20 text-center">
                                        <CheckCircle size={48} className="mx-auto text-accent/20 mb-4" />
                                        <p className="font-mono text-xs text-muted uppercase tracking-[0.2em]">All Settlements Synchronized</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/10">
                                <h1 className="font-display text-2xl font-black italic tracking-tighter uppercase">USER <span className="text-blue-400">MANIFEST</span></h1>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[10px]">
                                    <thead className="bg-white/5 border-b border-white/10 uppercase tracking-widest text-muted">
                                        <tr>
                                            <th className="p-6">Entity_ID</th>
                                            <th className="p-6">Communication_Uplink</th>
                                            <th className="p-6">Role_Tier</th>
                                            <th className="p-6">Subscription_Status</th>
                                            <th className="p-6">Registry_Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map((u) => (
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
