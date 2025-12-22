'use client';
import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedButton from './ui/AnimatedButton';
import { Lock, CreditCard, ArrowRight } from 'lucide-react';

interface FeatureGateProps {
    children: ReactNode;
    requiredRoles?: string[];  // Roles that can access this feature
    featureName?: string;
}

// Role hierarchy and feature access
const ROLE_ACCESS: Record<string, string[]> = {
    'user': ['swing-analysis', 'performance', 'training'],
    'pro': ['swing-analysis', 'performance', 'training', 'coaching', 'tournament'],
    'elite': ['swing-analysis', 'performance', 'training', 'coaching', 'veo-3d', 'tournament'],
    'club_starter': ['swing-analysis', 'performance', 'training', 'team-dashboard', 'leaderboard'],
    'club_pro': ['swing-analysis', 'performance', 'training', 'coaching', 'team-dashboard', 'leaderboard', 'batch-analysis', 'monthly-report'],
    'club_enterprise': ['swing-analysis', 'performance', 'training', 'coaching', 'veo-3d', 'tournament', 'team-dashboard', 'leaderboard', 'batch-analysis', 'monthly-report'],
    'admin': ['all']
};

export default function FeatureGate({ children, requiredRoles = [], featureName }: FeatureGateProps) {
    const [userRole, setUserRole] = useState<string>('user');
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Get user from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const role = user.role || 'user';
            setUserRole(role);

            // Check access
            if (requiredRoles.length === 0) {
                // No specific role required
                setHasAccess(true);
            } else if (role === 'admin') {
                // Admin has access to everything
                setHasAccess(true);
            } else if (requiredRoles.includes(role)) {
                setHasAccess(true);
            } else {
                // Check if user's role has access to this feature
                const accessibleFeatures = ROLE_ACCESS[role] || [];
                if (featureName && accessibleFeatures.includes(featureName)) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            }

            setIsLoading(false);
        }
    }, [requiredRoles, featureName]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            </div>
        );
    }

    // No access - show upgrade prompt
    if (!hasAccess) {
        const upgradePlan = userRole === 'user' ? '프로' : userRole.startsWith('club') ? '클럽 프로' : '엘리트';

        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
                        <div className="h-20 w-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                            <Lock size={40} className="text-yellow-400" />
                        </div>

                        <h1 className="font-display text-3xl font-black tracking-tighter tech-glow mb-3 uppercase italic">
                            접근 <span className="text-yellow-400">제한됨</span>
                        </h1>

                        <p className="text-muted text-sm mb-8">
                            이 기능은 <span className="text-yellow-400 font-bold">{upgradePlan}</span> 이상의 요금제에서 사용할 수 있습니다.
                        </p>

                        <div className="space-y-4">
                            <Link href="/pricing">
                                <AnimatedButton variant="primary" className="w-full py-4">
                                    <CreditCard size={18} className="mr-2" />
                                    요금제 업그레이드
                                </AnimatedButton>
                            </Link>

                            <Link href="/payment">
                                <AnimatedButton variant="outline" className="w-full py-4">
                                    결제 진행하기
                                    <ArrowRight size={18} className="ml-2" />
                                </AnimatedButton>
                            </Link>
                        </div>

                        <p className="text-[10px] font-mono text-muted mt-8 uppercase tracking-widest">
                            현재 역할: {userRole}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Has access - render children
    return <>{children}</>;
}
