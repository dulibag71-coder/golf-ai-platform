'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function Dashboard() {
    const [token, setToken] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const t = localStorage.getItem('token');
            if (!t) window.location.href = '/login';
            else setToken(t);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !token) return;
        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('video', file);

            // 1. Upload
            const uploadRes = await api.post('/swing/upload', formData, token, true);
            const videoId = uploadRes.videoId;

            // 2. Request Analysis
            const analysisRes = await api.post('/swing/analyze', {
                videoId,
                keypoints: { dummy: 'data' }
            }, token);

            setResult(analysisRes.result);
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
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                            disabled={!file || analyzing}
                            className={`mt-6 w-full py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 transition ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {analyzing ? 'AI 분석 중...' : '스윙 분석 시작'}
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
                                        {result.diagnosis_problems.map((p: string, i: number) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <h3 className="font-bold text-blue-400 mb-2">AI 코치 피드백</h3>
                                    <p className="text-gray-300">"{result.diagnosis_good_point}. 하지만, 주의가 필요합니다: {result.injury_risk_warning}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-500">
                                영상을 선택하여 분석을 시작하세요
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
        <div className="bg-black/40 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-black mt-1 ${color}`}>{score}</p>
        </div>
    );
}
