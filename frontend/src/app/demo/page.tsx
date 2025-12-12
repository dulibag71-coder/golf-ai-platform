'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DemoPage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runDemo = () => {
        setAnalyzing(true);
        setResult(null);

        setTimeout(() => {
            setResult({
                score_total: 82,
                score_stability: 78,
                score_impact: 85,
                score_consistency: 80,
                diagnosis_problems: ['약간의 얼리 익스텐션', '체중 이동 타이밍 개선 필요'],
                diagnosis_good_point: '백스윙 회전이 매우 좋습니다!',
                injury_risk_warning: '현재 자세는 부상 위험이 낮습니다.'
            });
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Golfing AI 데모</h1>
                    <p className="text-gray-400 text-lg">실제 분석 결과를 미리 체험해보세요</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Demo Video Area */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                            {/* Simulated skeleton overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 200 300" className="w-48 h-72 text-green-400 opacity-50">
                                    {/* Simple stick figure for demo */}
                                    <circle cx="100" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <line x1="100" y1="60" x2="100" y2="150" stroke="currentColor" strokeWidth="2" />
                                    <line x1="100" y1="80" x2="60" y2="120" stroke="currentColor" strokeWidth="2" />
                                    <line x1="100" y1="80" x2="140" y2="100" stroke="currentColor" strokeWidth="2" />
                                    <line x1="100" y1="150" x2="70" y2="220" stroke="currentColor" strokeWidth="2" />
                                    <line x1="100" y1="150" x2="130" y2="220" stroke="currentColor" strokeWidth="2" />
                                    {/* Club */}
                                    <line x1="140" y1="100" x2="170" y2="60" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <p className="text-gray-500 z-10">샘플 스윙 영상</p>
                        </div>
                        <div className="p-6">
                            <button
                                onClick={runDemo}
                                disabled={analyzing}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition ${analyzing
                                        ? 'bg-gray-700 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-500'
                                    }`}
                            >
                                {analyzing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        AI 분석 중...
                                    </span>
                                ) : (
                                    '데모 분석 실행'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        <h2 className="text-xl font-bold mb-6">분석 결과</h2>

                        {result ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <ScoreCard label="총점" score={result.score_total} />
                                    <ScoreCard label="안정성" score={result.score_stability} />
                                    <ScoreCard label="임팩트" score={result.score_impact} />
                                    <ScoreCard label="일관성" score={result.score_consistency} />
                                </div>

                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <h3 className="font-bold text-green-400 mb-2">✓ 잘하고 있는 점</h3>
                                    <p className="text-gray-300">{result.diagnosis_good_point}</p>
                                </div>

                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <h3 className="font-bold text-yellow-400 mb-2">⚠ 개선이 필요한 점</h3>
                                    <ul className="list-disc pl-5 text-gray-300">
                                        {result.diagnosis_problems.map((p: string, i: number) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <h3 className="font-bold text-blue-400 mb-2">🏥 부상 위험도</h3>
                                    <p className="text-gray-300">{result.injury_risk_warning}</p>
                                </div>

                                <Link
                                    href="/register"
                                    className="block w-full text-center py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
                                >
                                    지금 시작하기 →
                                </Link>
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-gray-500">
                                "데모 분석 실행" 버튼을 클릭하면<br />AI 분석 결과를 확인할 수 있습니다
                            </div>
                        )}
                    </div>
                </div>
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
        <div className="bg-gray-800 p-4 rounded-xl text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-black mt-1 ${color}`}>{score}</p>
        </div>
    );
}
