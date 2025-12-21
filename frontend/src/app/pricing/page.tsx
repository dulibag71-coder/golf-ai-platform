'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Zap, Users, Globe, Terminal, ChevronRight } from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { cn } from '@/lib/utils';

const individualPlans = [
    {
        name: '게스트 프로토콜',
        price: '0',
        period: '14일',
        features: ['기간 내 3회 스윙 분석', '기본 AI 진단', '단일 기기 동기화'],
        cta: '트라이얼 시작',
        highlighted: false,
        icon: <Terminal className="text-muted" size={20} />
    },
    {
        name: '프로 코어',
        price: '29,900',
        period: '월',
        features: ['무제한 스윙 분석', '전체 생체 데이터 판독', '성능 연대기 기록', '자동 맞춤형 연습 프로그램'],
        cta: '프로 활성화',
        highlighted: true,
        icon: <Zap className="text-accent" size={20} />
    },
    {
        name: '엘리트 커맨드',
        price: '59,900',
        period: '월',
        features: ['1:1 프로 원격 리플레이', 'Veo 3.1 3D 생성', '대회 미션 준비', 'VIP 기술 지원'],
        cta: '엘리트 배포',
        highlighted: false,
        icon: <Shield className="text-purple-400" size={20} />
    }
];

const clubPlans = [
    {
        name: '팀 스타터',
        price: '99,000',
        period: '월',
        members: '최대 20명의 팀원',
        features: ['팀 대시보드', '글로벌 랭킹', '일괄 분석', '월간 운영 보고서'],
        cta: '팀 생성하기',
        highlighted: false,
        icon: <Users className="text-blue-400" size={20} />
    },
    {
        name: '얼라이언스 프로',
        price: '199,000',
        period: '월',
        members: '최대 50명의 팀원',
        features: ['앱 내 토너먼트', '실시간 리더보드', '얼라이언스 비교 분석', '매니징 서비스'],
        cta: '얼라이언스 업그레이드',
        highlighted: true,
        icon: <Globe className="text-accent" size={20} />
    },
    {
        name: '엔터프라이즈 그리드',
        price: '문의',
        period: '커스텀',
        members: '무제한 팀원',
        features: ['커스텀 프로토콜 개발', 'API 액세스', '전용 그리드 서버', '24/7 우선 지원'],
        cta: '본부 문의',
        highlighted: false,
        icon: <Terminal className="text-white" size={20} />
    }
];

export default function PricingPage() {
    const [tab, setTab] = useState<'individual' | 'club'>('individual');
    const plans = tab === 'individual' ? individualPlans : clubPlans;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-accent/30 overflow-x-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-16">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                    >
                        Operations Scalability
                    </motion.div>
                    <h1 className="font-display text-5xl font-black tracking-tighter tech-glow mb-6 italic">미션 레벨 <span className="text-accent">선택</span></h1>
                    <p className="text-muted text-sm font-mono uppercase tracking-widest max-w-2xl mx-auto opacity-70">
                        Choose the computational power and analytical depth required for your professional development.
                    </p>

                    {/* Protocol Toggle */}
                    <div className="mt-12 inline-flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                        <button
                            onClick={() => setTab('individual')}
                            className={cn(
                                "px-8 py-3 rounded-xl font-bold text-xs tracking-widest transition-all",
                                tab === 'individual' ? "bg-accent text-black" : "text-muted hover:text-white"
                            )}
                        >
                            개인용
                        </button>
                        <button
                            onClick={() => setTab('club')}
                            className={cn(
                                "px-8 py-3 rounded-xl font-bold text-xs tracking-widest transition-all",
                                tab === 'club' ? "bg-blue-600 text-white" : "text-muted hover:text-white"
                            )}
                        >
                            팀 / 클럽용
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={`${tab}-${plan.name}`}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative"
                            >
                                <div className={cn(
                                    "h-full rounded-2xl p-8 transition-all duration-500 flex flex-col group",
                                    plan.highlighted
                                        ? `bg-white/10 border-2 ${tab === 'individual' ? 'border-accent shadow-[0_0_30px_-10px_rgba(0,242,255,0.3)]' : 'border-blue-500 shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]'} scale-105 z-10`
                                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                                )}>
                                    {plan.highlighted && (
                                        <div className={cn(
                                            "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                                            tab === 'individual' ? 'bg-accent text-black' : 'bg-blue-500 text-white'
                                        )}>
                                            최적의 선택
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                            {plan.icon}
                                        </div>
                                        <h2 className="font-display text-xl font-black tracking-tighter mb-1 uppercase italic">{plan.name}</h2>
                                        {'members' in plan && (
                                            <p className="text-[10px] text-blue-400 font-mono tracking-widest">{(plan as any).members}</p>
                                        )}
                                    </div>

                                    <div className="mb-10">
                                        {plan.price === 'CONTACT' ? (
                                            <span className="font-display text-3xl font-black italic tracking-tighter text-accent tech-glow">견적 문의</span>
                                        ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-display text-4xl font-black tracking-tighter italic text-white group-hover:text-accent group-hover:tech-glow transition-all">₩{plan.price}</span>
                                                <span className="text-muted text-[10px] font-mono uppercase tracking-widest">/{plan.period}</span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-3 group/item">
                                                <div className={cn(
                                                    "mt-1 rounded-full p-[2px]",
                                                    tab === 'individual' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-500'
                                                )}>
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                                <span className="text-xs text-muted font-mono uppercase tracking-wider group-hover/item:text-white transition-colors">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href={plan.price === '0' ? '/register' : plan.price === 'CONTACT' ? '/team' : '/payment'}>
                                        <AnimatedButton
                                            variant={plan.highlighted ? "primary" : "outline"}
                                            className="w-full text-[10px] tracking-[0.2em] font-black h-12"
                                        >
                                            {plan.cta}
                                        </AnimatedButton>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Secure Protocol Terminal */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                                <div className="h-2 w-2 rounded-full bg-green-500/50" />
                            </div>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-muted">TRANSACTION_PROTOCOL.SH</span>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">입금 엔드포인트</h3>
                                <div className="bg-black/40 p-5 rounded-xl border border-white/5 font-mono">
                                    <p className="text-sm text-white mb-1">KAKAO_BANK_7777034553512</p>
                                    <p className="text-[10px] text-muted uppercase">수취인: 박두리 (PARK_DU_RI)</p>
                                </div>
                                <p className="text-[10px] text-muted mt-4 uppercase tracking-widest leading-relaxed">
                                    장부 확인 후 서비스 권한이 부여됩니다.
                                    확인 지연 시간: 약 1시간.
                                </p>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all opacity-0 group-hover:opacity-100" />
                                <div className="relative h-full bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-mono text-[10px] uppercase tracking-widest text-blue-400 mb-2">지원 업링크</h3>
                                        <p className="font-display text-2xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">010-8632-3819</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-[9px] font-mono text-muted uppercase">팀/법인 문의 환영</span>
                                        <ChevronRight size={16} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
