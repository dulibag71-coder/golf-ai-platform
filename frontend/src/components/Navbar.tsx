'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('user');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUserRole(user.role || 'user');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // 유료 플랜 여부
    const isPaid = userRole !== 'user';
    const isClub = userRole.startsWith('club');

    return (
        <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            Golfing
                        </Link>
                        <div className="hidden md:flex ml-10 items-baseline space-x-1">
                            <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                분석
                            </Link>
                            <Link href="/coach" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                AI 코치
                            </Link>
                            {isPaid && (
                                <>
                                    <Link href="/lesson" className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                                        1:1 레슨
                                    </Link>
                                    <Link href="/tournament" className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium">
                                        대회 코칭
                                    </Link>
                                </>
                            )}
                            {isClub && (
                                <Link href="/team" className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium">
                                    팀 대시보드
                                </Link>
                            )}
                            <Link href="/pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                요금제
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            {token ? (
                                <>
                                    {isPaid && (
                                        <span className={`text-xs px-2 py-1 rounded ${userRole === 'elite' ? 'bg-purple-600' :
                                            isClub ? 'bg-blue-600' : 'bg-green-600'
                                            }`}>
                                            {userRole === 'elite' ? '엘리트' :
                                                userRole === 'club_starter' ? '동호회' :
                                                    userRole === 'club_pro' ? '동호회 프로' :
                                                        userRole === 'pro' ? '프로' : ''}
                                        </span>
                                    )}
                                    <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        로그아웃
                                    </button>
                                    <Link href="/profile" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium transition">
                                        내 프로필
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        로그인
                                    </Link>
                                    <Link href="/register" className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-bold transition">
                                        시작하기
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {/* 모바일 메뉴 버튼 */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* 모바일 메뉴 */}
                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link href="/dashboard" className="block text-gray-300 hover:text-white px-3 py-2">분석</Link>
                        <Link href="/coach" className="block text-gray-300 hover:text-white px-3 py-2">AI 코치</Link>
                        {isPaid && <Link href="/lesson" className="block text-purple-400 px-3 py-2">1:1 레슨</Link>}
                        {isPaid && <Link href="/tournament" className="block text-purple-400 px-3 py-2">대회 코칭</Link>}
                        {isClub && <Link href="/team" className="block text-blue-400 px-3 py-2">팀 대시보드</Link>}
                        <Link href="/pricing" className="block text-gray-300 hover:text-white px-3 py-2">요금제</Link>
                        {token ? (
                            <>
                                <Link href="/profile" className="block text-green-400 px-3 py-2">내 프로필</Link>
                                <button onClick={handleLogout} className="block text-gray-300 px-3 py-2">로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block text-gray-300 px-3 py-2">로그인</Link>
                                <Link href="/register" className="block text-white bg-green-600 mx-3 py-2 rounded-lg text-center">시작하기</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
