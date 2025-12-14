'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// 동호회 팀 대시보드 (동호회 플랜 전용)
export default function TeamPage() {
    const [userRole, setUserRole] = useState('user');
    const [activeTab, setActiveTab] = useState<'ranking' | 'analysis' | 'tournament'>('ranking');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'user');
    }, []);

    const isClub = userRole.startsWith('club');
    const isClubPro = userRole === 'club_pro' || userRole === 'club_enterprise';

    // 더미 데이터
    const members = [
        { rank: 1, name: '김프로', avgScore: 92, swings: 45, improvement: '+12%' },
        { rank: 2, name: '이골퍼', avgScore: 88, swings: 38, improvement: '+8%' },
        { rank: 3, name: '박드라', avgScore: 85, swings: 52, improvement: '+15%' },
        { rank: 4, name: '최아이', avgScore: 82, swings: 29, improvement: '+5%' },
        { rank: 5, name: '정퍼터', avgScore: 79, swings: 41, improvement: '+10%' },
    ];

    const teamStats = {
        totalMembers: 15,
        totalSwings: 342,
        avgScore: 81,
        improvement: '+9%'
    };

    if (!isClub) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h1 className="text-3xl font-bold mb-4">🔒 동호회 전용 기능</h1>
                        <p className="text-gray-400 mb-6">팀 대시보드는 동호회 플랜에서 이용 가능합니다.</p>
                        <Link href="/pricing" className="inline-block bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold">
                            동호회 플랜 보기 →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <h1 className="text-3xl font-bold mb-2 text-blue-400">👥 팀 대시보드</h1>
                <p className="text-gray-400 mb-8">동호회 멤버들의 성과를 한눈에 확인하세요.</p>

                {/* 팀 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-blue-400">{teamStats.totalMembers}</p>
                        <p className="text-sm text-gray-400">멤버 수</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-green-400">{teamStats.totalSwings}</p>
                        <p className="text-sm text-gray-400">총 스윙 분석</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-yellow-400">{teamStats.avgScore}</p>
                        <p className="text-sm text-gray-400">팀 평균 점수</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-purple-400">{teamStats.improvement}</p>
                        <p className="text-sm text-gray-400">월간 향상도</p>
                    </div>
                </div>

                {/* 탭 */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('ranking')}
                        className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'ranking' ? 'bg-blue-600' : 'bg-gray-800'}`}
                    >
                        🏆 멤버 랭킹
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'analysis' ? 'bg-blue-600' : 'bg-gray-800'}`}
                    >
                        📊 단체 분석
                    </button>
                    {isClubPro && (
                        <button
                            onClick={() => setActiveTab('tournament')}
                            className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'tournament' ? 'bg-blue-600' : 'bg-gray-800'}`}
                        >
                            🏌️ 대회 개최
                        </button>
                    )}
                </div>

                {/* 랭킹 탭 */}
                {activeTab === 'ranking' && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-4 text-left">순위</th>
                                    <th className="p-4 text-left">이름</th>
                                    <th className="p-4 text-left">평균 점수</th>
                                    <th className="p-4 text-left">분석 횟수</th>
                                    <th className="p-4 text-left">향상도</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(m => (
                                    <tr key={m.rank} className="border-t border-gray-800">
                                        <td className="p-4">
                                            <span className={`${m.rank <= 3 ? 'text-2xl' : ''}`}>
                                                {m.rank === 1 ? '🥇' : m.rank === 2 ? '🥈' : m.rank === 3 ? '🥉' : m.rank}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold">{m.name}</td>
                                        <td className="p-4 text-blue-400">{m.avgScore}</td>
                                        <td className="p-4">{m.swings}회</td>
                                        <td className="p-4 text-green-400">{m.improvement}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 단체 분석 탭 */}
                {activeTab === 'analysis' && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        <h3 className="font-bold text-lg mb-4">📊 팀 분석 리포트</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <h4 className="text-blue-400 font-bold mb-2">강점</h4>
                                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                                    <li>팀 전체적으로 그립이 안정적</li>
                                    <li>백스윙 템포가 우수</li>
                                    <li>꾸준한 연습량 유지</li>
                                </ul>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <h4 className="text-red-400 font-bold mb-2">개선 필요</h4>
                                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                                    <li>다운스윙 체중 이동 부족</li>
                                    <li>임팩트 시 헤드업 발생</li>
                                    <li>피니시 밸런스 불안정</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-700">
                            <p className="text-green-400 font-bold">💡 추천 팀 연습</p>
                            <p className="text-gray-300 mt-1">체중 이동 드릴을 팀 전체가 함께 연습하면 효과적입니다.</p>
                        </div>
                    </div>
                )}

                {/* 대회 개최 탭 (club_pro 이상) */}
                {activeTab === 'tournament' && isClubPro && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        <h3 className="font-bold text-lg mb-4">🏌️ 동호회 대회 개최</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2">대회명</label>
                                <input type="text" placeholder="2024 겨울 동호회 대회" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3" />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">대회 날짜</label>
                                <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3" />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">참가 조건</label>
                                <select className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                                    <option>모든 멤버</option>
                                    <option>상위 10명</option>
                                    <option>평균 점수 80 이상</option>
                                </select>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold">
                                대회 생성하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
