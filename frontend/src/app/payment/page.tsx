'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Terminal, AlertCircle, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import BentoCard from '@/components/ui/BentoCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const individualPlans = [
    { name: '프로 코어', price: 29900, type: 'individual' },
    { name: '엘리트 커맨드', price: 59900, type: 'individual' }
];

const clubPlans = [
    { name: '팀 스타터', price: 99000, type: 'club', members: '최대 20명' },
    { name: '얼라이언스 프로', price: 199000, type: 'club', members: '최대 50명' }
];

export default function PaymentPage() {
    const [tab, setTab] = useState<'individual' | 'club'>('individual');
    const plans = tab === 'individual' ? individualPlans : clubPlans;
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);
    const [senderName, setSenderName] = useState('');
    const [clubName, setClubName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleTabChange = (newTab: 'individual' | 'club') => {
        setTab(newTab);
        const newPlans = newTab === 'individual' ? individualPlans : clubPlans;
        setSelectedPlan(newPlans[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!senderName.trim()) {
            setError('SENDER_NAME_REQUIRED');
            return;
        }
        if (tab === 'club' && !clubName.trim()) {
            setError('SQUAD_NAME_REQUIRED');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.post('/payments/request', {
                amount: selectedPlan.price,
                senderName: senderName.trim(),
                planName: selectedPlan.name,
                clubName: tab === 'club' ? clubName.trim() : null
            }, token || '');

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'TRANSACTION_PROTOCOL_ERROR');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white font-sans">
                <Navbar />
                <main className="max-w-2xl mx-auto px-6 pt-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-accent/5 border border-accent/20 rounded-3xl p-12 backdrop-blur-xl"
                    >
                        <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={40} className="text-accent" />
                        </div>
                        <h1 className="font-display text-3xl font-black tracking-tighter tech-glow mb-4 uppercase italic">프로토콜 <span className="text-accent">초기화됨</span></h1>
                        <p className="text-muted text-sm font-mono uppercase tracking-widest mb-10 opacity-70">
                            거래 요청이 기록되었습니다. 수동 확인 후 서비스 배포가 시작됩니다.
                        </p>

                        <div className="bg-black/40 border border-white/10 p-8 rounded-2xl text-left font-mono space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] text-muted uppercase">배포 플랜</span>
                                <span className="text-xs">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] text-muted uppercase">할당량 금액</span>
                                <span className="text-xs text-accent">₩{selectedPlan.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-[10px] text-muted uppercase">담당자</span>
                                <span className="text-xs">{senderName}</span>
                            </div>
                            {clubName && (
                                <div className="flex justify-between">
                                    <span className="text-[10px] text-muted uppercase">팀 개체</span>
                                    <span className="text-xs">{clubName}</span>
                                </div>
                            )}
                        </div>

                        <Link href="/dashboard">
                            <AnimatedButton className="w-full mt-10">
                                커맨드 기지로 복귀
                            </AnimatedButton>
                        </Link>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30 overflow-x-hidden">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-32 pb-16">
                <header className="text-center mb-16">
                    <h1 className="font-display text-5xl font-black tracking-tighter tech-glow mb-4 italic">결제 <span className="text-accent">프로토콜</span></h1>
                    <p className="text-muted text-[10px] font-mono uppercase tracking-[0.3em]">수동 결제 인프라</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Input Selection */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Protocol Switcher */}
                        <div className="flex justify-center">
                            <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                                <button
                                    onClick={() => handleTabChange('individual')}
                                    className={cn(
                                        "px-8 py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all",
                                        tab === 'individual' ? "bg-accent text-black" : "text-muted hover:text-white"
                                    )}
                                >
                                    개인용
                                </button>
                                <button
                                    onClick={() => handleTabChange('club')}
                                    className={cn(
                                        "px-8 py-3 rounded-xl font-bold text-[10px] tracking-widest transition-all",
                                        tab === 'club' ? "bg-blue-600 text-white" : "text-muted hover:text-white"
                                    )}
                                >
                                    팀 / 클럽
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Plan Matrix */}
                            <div className="space-y-4">
                                <label className="font-mono text-[10px] uppercase tracking-widest text-muted">승인할 플랜</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {plans.map((plan) => (
                                        <button
                                            key={plan.name}
                                            type="button"
                                            onClick={() => setSelectedPlan(plan)}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 transition-all duration-300 text-left relative group overflow-hidden",
                                                selectedPlan.name === plan.name
                                                    ? tab === 'individual' ? 'border-accent bg-accent/5' : 'border-blue-500 bg-blue-500/5'
                                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                            )}
                                        >
                                            <div className="relative z-10">
                                                <p className="font-display font-black text-sm tracking-tighter uppercase mb-1 italic group-hover:text-white transition-colors">{plan.name}</p>
                                                <p className={cn(
                                                    "font-display text-2xl font-black italic tracking-tighter",
                                                    selectedPlan.name === plan.name
                                                        ? tab === 'individual' ? 'text-accent tech-glow' : 'text-blue-500 tech-glow'
                                                        : 'text-white/50 group-hover:text-white'
                                                )}>
                                                    ₩{plan.price.toLocaleString()}
                                                </p>
                                                {'members' in plan && <p className="text-[9px] text-blue-400 font-mono mt-1 opacity-70">{(plan as any).members}</p>}
                                            </div>
                                            {selectedPlan.name === plan.name && (
                                                <div className={cn(
                                                    "absolute -bottom-2 -right-2 opacity-10",
                                                    tab === 'individual' ? 'text-accent' : 'text-blue-500'
                                                )}>
                                                    <CreditCard size={64} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {tab === 'club' && (
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] uppercase tracking-widest text-muted">팀 명칭 식별</label>
                                        <input
                                            type="text"
                                            value={clubName}
                                            onChange={(e) => setClubName(e.target.value)}
                                            placeholder="ENTITY_NAME"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500 font-mono text-sm tracking-widest uppercase"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted">담당자 식별</label>
                                    <input
                                        type="text"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        placeholder="SENDER_NAME"
                                        className={cn(
                                            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none font-mono text-sm tracking-widest uppercase",
                                            tab === 'individual' ? 'focus:border-accent' : 'focus:border-blue-500'
                                        )}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono text-xs">
                                    <AlertCircle size={16} />
                                    <span>
                                        {error === 'SENDER_NAME_REQUIRED' ? '담당자 이름을 입력해주세요.' :
                                            error === 'SQUAD_NAME_REQUIRED' ? '팀 이름을 입력해주세요.' :
                                                error.includes('fetch') ? '서버 연결에 실패했습니다. 다시 시도해주세요.' :
                                                    '결제 요청 중 오류가 발생했습니다.'}
                                    </span>
                                </div>
                            )}

                            <AnimatedButton
                                type="submit"
                                disabled={loading}
                                variant="primary"
                                className="w-full text-sm font-black tracking-[0.2em] py-5"
                            >
                                {loading ? '실행 중...' : '프로토콜 시작'}
                            </AnimatedButton>
                        </form>
                    </div>

                    {/* Right: Transfer Protocol Details */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-6">
                            <BentoCard icon={<Terminal className="text-accent" />} title="결제 정보" subtitle="수동 엔드포인트">
                                <div className="mt-4 space-y-6">
                                    <div className="p-5 bg-black/60 border border-white/5 rounded-2xl group flex justify-between items-center transition-all hover:border-accent/30 cursor-pointer">
                                        <div className="font-mono uppercase">
                                            <p className="text-[10px] text-muted mb-1">대상 계좌</p>
                                            <p className="text-sm font-bold tracking-wider">7777034553512</p>
                                            <p className="text-[10px] text-muted opacity-50">카카오뱅크 | 박두리</p>
                                        </div>
                                        <Copy size={16} className="text-muted group-hover:text-accent" />
                                    </div>

                                    <div className="h-[1px] bg-white/5 w-full" />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-accent" />
                                            <span className="font-mono text-[10px] uppercase tracking-widest">결제 전 확인 사항</span>
                                        </div>
                                        <p className="text-[10px] text-muted uppercase tracking-widest leading-relaxed">
                                            1. Transfer the exact quota amount.<br />
                                            2. Ensure sender ID matches your name.<br />
                                            3. Initialize protocol within 24 hours of transfer.
                                        </p>
                                    </div>
                                </div>
                            </BentoCard>

                            <div className="p-6 bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-3xl flex items-center justify-between group cursor-pointer">
                                <div className="font-mono">
                                    <h3 className="text-[10px] uppercase text-blue-400 mb-1">비상 업링크</h3>
                                    <p className="font-display text-2xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">010-8632-3819</p>
                                </div>
                                <ExternalLink size={20} className="text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
