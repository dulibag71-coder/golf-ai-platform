'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import Link from 'next/link';

// 플랜별 기능 제한
const PLAN_LIMITS: Record<string, { swingLimit: number; aiCoach: boolean; report: boolean; training: boolean; storage: string }> = {
    'user': { swingLimit: 3, aiCoach: false, report: false, training: false, storage: '0GB' },
    'pro': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '100GB' },
    'elite': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '무제한' },
    'club_starter': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '500GB' },
    'club_pro': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '2TB' },
    'club_enterprise': { swingLimit: -1, aiCoach: true, report: true, training: true, storage: '무제한' }
};

export default function Dashboard() {
    const [token, setToken] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('user');
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [swingCount, setSwingCount] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const t = localStorage.getItem('token');
            if (!t) window.location.href = '/login';
            else {
                setToken(t);
                // 사용자 정보에서 role 가져오기
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setUserRole(user.role || 'user');
            }
        }
    }, []);

    const limits = PLAN_LIMITS[userRole] || PLAN_LIMITS['user'];
    const canAnalyze = limits.swingLimit === -1 || swingCount < limits.swingLimit;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !token) return;

        if (!canAnalyze) {
            alert('무료 플랜의 분석 횟수를 초과했습니다. 프로 플랜으로 업그레이드하세요!');
            return;
        }

        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('video', file);

            const uploadRes = await api.post('/swing/upload', formData, token, true);
            const videoId = uploadRes.videoId;

            const analysisRes = await api.post('/swing/analyze', {
                videoId,
                keypoints: { dummy: 'data' }
            }, token);

            setResult(analysisRes.result);
            setSwingCount(prev => prev + 1);
        } catch (error) {
            alert('분석에 실패했습니다.');
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
                {/* 플랜 상태 배너 */}
                <div className={`mb-6 p-4 rounded-xl ${userRole === 'user' ? 'bg-gray-800 border border-gray-700' : 'bg-green-900/30 border border-green-500'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className={`text-xs px-2 py-1 rounded ${userRole === 'elite' ? 'bg-purple-600' :
                                    userRole.startsWith('club') ? 'bg-blue-600' :
                                        userRole === 'pro' ? 'bg-green-600' : 'bg-gray-600'
                                }`}>
                                {userRole === 'elite' ? '엘리트' :
                                    userRole === 'club_starter' ? '동호회 스타터' :
                                        userRole === 'club_pro' ? '동호회 프로' :
                                            userRole === 'club_enterprise' ? '동호회 엔터프라이즈' :
                                                userRole === 'pro' ? '프로' : '무료'}
                            </span>
                            <span className="ml-3 text-gray-400 text-sm">
                                {limits.swingLimit === -1 ? '무제한 분석' : `분석 ${swingCount}/${limits.swingLimit}회`}
                            </span>
                        </div>
                        {userRole === 'user' && (
                            <Link href="/pricing" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-bold">
                                업그레이드
                            </Link>
                        )}
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-8">Golfing 대시보드</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-4 text-green-400">새로운 스윙 분석</h2>
                        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer">
                            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500" accept="video/*" />
                            <p className="mt-4 text-gray-400 text-sm">스윙 영상을 업로드하세요 (MP4, MOV)</p>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={!file || analyzing || !canAnalyze}
                            className={`mt-6 w-full py-3 rounded-xl font-bold transition ${!canAnalyze ? 'bg-gray-600 cursor-not-allowed' :
                                    analyzing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
                                }`}
                        >
                            {!canAnalyze ? '플랜 업그레이드 필요' : analyzing ? 'AI 분석 중...' : '스윙 분석 시작'}
                        </button>
                    </div>

                    {/* Analysis Result Section */}
                    <div className="lg:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-4">분석 결과</h2>

                        {result ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <ScoreCard label="총점" score={result.score_total} />
                                    <ScoreCard label="안정성" score={result.score_stability} />
                                    <ScoreCard label="템포" score={result.score_impact} />
                                    <ScoreCard label="일관성" score={result.score_consistency} />
                                </div>

                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <h3 className="font-bold text-red-400 mb-2">발견된 문제점 (TOP 3)</h3>
                                    <ul className="list-disc pl-5 text-gray-300">
                                        {result.diagnosis_problems?.map((p: string, i: number) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 상세 리포트 - 프로 이상만 */}
                                {limits.report && (
                                    <div className="bg-gray-800 p-4 rounded-xl">
                                        <h3 className="font-bold text-blue-400 mb-2">AI 코치 피드백</h3>
                                        <p className="text-gray-300">"{result.diagnosis_good_point}. 하지만, 주의가 필요합니다: {result.injury_risk_warning}"</p>
                                    </div>
                                )}

                                {/* 맞춤 훈련 - 프로 이상만 */}
                                {limits.training && (
                                    <div className="bg-green-900/20 p-4 rounded-xl border border-green-700">
                                        <h3 className="font-bold text-green-400 mb-2">🏋️ 맞춤 훈련 프로그램</h3>
                                        <p className="text-gray-300 text-sm">분석 결과를 바탕으로 개인화된 훈련 프로그램이 제공됩니다.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                영상을 선택하여 분석을 시작하세요
                            </div>
                        )}
                    </div>
                </div>

                {/* 플랜별 기능 안내 (무료 사용자만) */}
                {userRole === 'user' && (
                    <div className="mt-8 bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-bold mb-4">🔒 프로 플랜으로 업그레이드하면</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <p className="text-2xl mb-2">♾️</p>
                                <p className="text-sm text-gray-400">무제한 분석</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <p className="text-2xl mb-2">🤖</p>
                                <p className="text-sm text-gray-400">AI 코치</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <p className="text-2xl mb-2">📊</p>
                                <p className="text-sm text-gray-400">상세 리포트</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-xl">
                                <p className="text-2xl mb-2">🏋️</p>
                                <p className="text-sm text-gray-400">맞춤 훈련</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Link href="/pricing" className="inline-block bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold">
                                플랜 보기 →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ScoreCard({ label, score }: { label: string, score: number }) {
    let color = 'text-gray-100';
    if (score >= 90) color = 'text-green-400';
    else if (score >= 70) color = 'text-yellow-400';
    else color = 'text-red-400';

    return (
        <div className="bg-black/40 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-black mt-1 ${color}`}>{score}</p>
        </div>
    );
}
