'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';

interface UserProfile {
    email: string;
    name: string;
    role: string;
    subscription_expires_at: string | null;
    created_at: string;
    totalSwings: number;
}

interface SwingHistory {
    id: number;
    score: number;
    created_at: string;
    details: any;
}

// 플랜별 표시명
const ROLE_NAMES: Record<string, string> = {
    'user': '무료',
    'pro': '프로',
    'elite': '엘리트',
    'club_starter': '동호회 스타터',
    'club_pro': '동호회 프로',
    'club_enterprise': '동호회 엔터프라이즈'
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [history, setHistory] = useState<SwingHistory[]>([]);
    const [tab, setTab] = useState<'info' | 'history' | 'progress'>('info');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const [profileRes, historyRes] = await Promise.all([
                    api.get('/auth/me', token).catch(() => null),
                    api.get('/swing/history', token).catch(() => [])
                ]);

                if (profileRes) {
                    setProfile(profileRes);
                } else {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    setProfile({
                        email: user.email || '',
                        name: user.name || '',
                        role: user.role || 'user',
                        subscription_expires_at: null,
                        created_at: new Date().toISOString(),
                        totalSwings: 0
                    });
                }
                setHistory(historyRes || []);
            } catch (error) {
                console.error('Profile load error:', error);
            }
            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    const isExpired = profile?.subscription_expires_at
        ? new Date(profile.subscription_expires_at) < new Date()
        : false;
    const isPaid = profile?.role !== 'user';

    // 점수 평균 계산
    const avgScore = history.length > 0
        ? Math.round(history.reduce((sum, h) => sum + (h.score || 0), 0) / history.length)
        : 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                {/* 프로필 헤더 */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold">
                            {profile?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{profile?.name || profile?.email}</h1>
                            <p className="text-gray-400">{profile?.email}</p>
                            <div className="mt-2 flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${profile?.role === 'elite' ? 'bg-purple-600' :
                                        profile?.role?.startsWith('club') ? 'bg-blue-600' :
                                            profile?.role === 'pro' ? 'bg-green-600' : 'bg-gray-600'
                                    }`}>
                                    {ROLE_NAMES[profile?.role || 'user']}
                                </span>
                                {isPaid && (
                                    <span className={`text-sm ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                                        {isExpired ? '만료됨' : `${new Date(profile?.subscription_expires_at!).toLocaleDateString()}까지`}
                                    </span>
                                )}
                            </div>
                        </div>
                        {(!isPaid || isExpired) && (
                            <Link href="/pricing" className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold">
                                {isExpired ? '갱신하기' : '업그레이드'}
                            </Link>
                        )}
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
                        <p className="text-3xl font-bold text-green-400">{history.length}</p>
                        <p className="text-sm text-gray-400">총 분석</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
                        <p className="text-3xl font-bold text-blue-400">{avgScore}</p>
                        <p className="text-sm text-gray-400">평균 점수</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
                        <p className="text-3xl font-bold text-yellow-400">{history.length > 0 ? Math.max(...history.map(h => h.score || 0)) : 0}</p>
                        <p className="text-sm text-gray-400">최고 점수</p>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex gap-2 mb-6">
                    {['info', 'history', 'progress'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-4 py-2 rounded-lg font-bold transition ${tab === t ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                        >
                            {t === 'info' ? '내 정보' : t === 'history' ? '분석 기록' : '진행 상황'}
                        </button>
                    ))}
                </div>

                {/* 탭 콘텐츠 */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    {tab === 'info' && (
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-800">
                                <span className="text-gray-400">이메일</span>
                                <span>{profile?.email}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-800">
                                <span className="text-gray-400">플랜</span>
                                <span>{ROLE_NAMES[profile?.role || 'user']}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-800">
                                <span className="text-gray-400">가입일</span>
                                <span>{new Date(profile?.created_at || '').toLocaleDateString()}</span>
                            </div>
                            {profile?.subscription_expires_at && (
                                <div className="flex justify-between py-3 border-b border-gray-800">
                                    <span className="text-gray-400">구독 만료일</span>
                                    <span className={isExpired ? 'text-red-400' : 'text-green-400'}>
                                        {new Date(profile.subscription_expires_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'history' && (
                        <div>
                            {history.length > 0 ? (
                                <ul className="space-y-3">
                                    {history.map((h) => (
                                        <li key={h.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">스윙 분석 #{h.id}</p>
                                                <p className="text-sm text-gray-400">{new Date(h.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-bold ${h.score >= 80 ? 'text-green-400' : h.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {h.score}점
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 py-8">분석 기록이 없습니다</p>
                            )}
                        </div>
                    )}

                    {tab === 'progress' && (
                        <div>
                            {history.length >= 2 ? (
                                <div>
                                    <h3 className="font-bold mb-4">📈 점수 추이</h3>
                                    <div className="h-48 flex items-end gap-2">
                                        {history.slice(-10).map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-green-600 rounded-t"
                                                    style={{ height: `${(h.score / 100) * 150}px` }}
                                                />
                                                <span className="text-xs text-gray-400 mt-1">{h.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 p-4 bg-gray-800 rounded-xl">
                                        <p className="text-green-400 font-bold">
                                            {history[history.length - 1].score > history[0].score
                                                ? `🎉 ${history[history.length - 1].score - history[0].score}점 향상!`
                                                : '꾸준히 연습하세요!'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">2회 이상 분석 후 진행 상황을 확인할 수 있습니다</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
