'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// 대회 준비 코칭 페이지 (엘리트 전용)
export default function TournamentCoachPage() {
    const [userRole, setUserRole] = useState('user');
    const [activeProgram, setActiveProgram] = useState<string | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'user');
    }, []);

    const isElite = userRole === 'elite' || userRole === 'club_pro' || userRole === 'club_enterprise';

    const programs = [
        {
            id: 'mental',
            title: '멘탈 트레이닝',
            icon: '🧠',
            description: '대회 압박감 극복, 집중력 향상',
            weeks: 4,
            sessions: [
                '1주차: 호흡법과 루틴 만들기',
                '2주차: 시각화 트레이닝',
                '3주차: 압박 상황 시뮬레이션',
                '4주차: 실전 멘탈 적용'
            ]
        },
        {
            id: 'strategy',
            title: '코스 전략',
            icon: '🗺️',
            description: '코스 공략법, 클럽 선택 전략',
            weeks: 3,
            sessions: [
                '1주차: 코스 분석 방법',
                '2주차: 상황별 클럽 선택',
                '3주차: 리스크 관리'
            ]
        },
        {
            id: 'physical',
            title: '피지컬 컨디셔닝',
            icon: '💪',
            description: '체력 관리, 부상 예방',
            weeks: 6,
            sessions: [
                '1-2주차: 유연성 향상',
                '3-4주차: 코어 강화',
                '5-6주차: 지구력 트레이닝'
            ]
        },
        {
            id: 'scoring',
            title: '스코어링 집중',
            icon: '🎯',
            description: '숏게임, 퍼팅 마스터',
            weeks: 4,
            sessions: [
                '1주차: 100야드 이내 공략',
                '2주차: 벙커/러프 탈출',
                '3주차: 퍼팅 읽기',
                '4주차: 클러치 퍼팅'
            ]
        }
    ];

    if (!isElite) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h1 className="text-3xl font-bold mb-4">🔒 엘리트 전용 기능</h1>
                        <p className="text-gray-400 mb-6">대회 준비 코칭은 엘리트 플랜 이상에서 이용 가능합니다.</p>
                        <Link href="/pricing" className="inline-block bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl font-bold">
                            엘리트로 업그레이드 →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                <h1 className="text-3xl font-bold mb-2 text-purple-400">🏆 대회 준비 코칭</h1>
                <p className="text-gray-400 mb-8">목표 대회에 맞춘 전문 트레이닝 프로그램</p>

                {/* 프로그램 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {programs.map(prog => (
                        <button
                            key={prog.id}
                            onClick={() => setActiveProgram(activeProgram === prog.id ? null : prog.id)}
                            className={`p-6 rounded-2xl text-left transition ${activeProgram === prog.id
                                    ? 'bg-purple-900/30 border-2 border-purple-500'
                                    : 'bg-gray-900 border border-gray-800 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{prog.icon}</span>
                                <h3 className="text-xl font-bold">{prog.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm">{prog.description}</p>
                            <p className="text-purple-400 text-sm mt-2">{prog.weeks}주 프로그램</p>
                        </button>
                    ))}
                </div>

                {/* 선택된 프로그램 상세 */}
                {activeProgram && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        {(() => {
                            const prog = programs.find(p => p.id === activeProgram)!;
                            return (
                                <>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <span>{prog.icon}</span> {prog.title} 커리큘럼
                                    </h3>
                                    <ul className="space-y-3">
                                        {prog.sessions.map((session, idx) => (
                                            <li key={idx} className="flex items-start gap-3 bg-gray-800 p-4 rounded-xl">
                                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">{idx + 1}</span>
                                                <span>{session}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full mt-6 bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold">
                                        이 프로그램 시작하기
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* 대회 일정 등록 */}
                <div className="mt-8 bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-bold mb-4">📅 목표 대회 등록</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="대회명 (예: 2024 아마추어 선수권)"
                            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                        />
                        <input
                            type="date"
                            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                        />
                    </div>
                    <button className="mt-4 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold">
                        대회 등록
                    </button>
                </div>
            </div>
        </div>
    );
}
