'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Upload, Play, Pause, RotateCcw, Zap, Target, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface AnalysisResult {
    overallScore: number;
    swingSpeed: number;
    impactAngle: number;
    followThrough: number;
    balance: number;
    tempo: number;
    recommendations: string[];
    biometrics: {
        hipRotation: number;
        shoulderTurn: number;
        weightTransfer: number;
        clubPath: string;
        faceAngle: string;
    };
}

export default function SwingAnalysisPage() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!videoFile) return;

        setIsAnalyzing(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('video', videoFile);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/swing/analyze', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData,
            });

            if (!response.ok) {
                throw new Error('분석 중 오류가 발생했습니다.');
            }

            const result = await response.json();
            setAnalysisResult(result);
        } catch (err: any) {
            setError(err.message || '분석에 실패했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const resetAnalysis = () => {
        setVideoFile(null);
        setVideoUrl('');
        setAnalysisResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const ScoreGauge = ({ value, label, color = 'accent' }: { value: number; label: string; color?: string }) => (
        <div className="flex flex-col items-center">
            <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <circle
                        cx="48" cy="48" r="40"
                        stroke={color === 'accent' ? 'rgb(0,242,255)' : color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${value * 2.51} 251`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl font-black italic">{value}</span>
                </div>
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted">{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                        AI Swing Analysis Protocol
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                        스윙 <span className="text-accent">분석</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Video Upload Section */}
                    <BentoCard className="p-6">
                        <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                            <Upload size={18} className="text-accent" />
                            영상 업로드
                        </h2>

                        {!videoUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all group"
                            >
                                <Upload size={48} className="mx-auto mb-4 text-muted group-hover:text-accent transition-colors" />
                                <p className="text-muted font-mono text-sm uppercase">클릭하여 스윙 영상 업로드</p>
                                <p className="text-[10px] text-muted/50 mt-2">MP4, MOV 지원 (최대 50MB)</p>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden bg-black">
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    className="w-full h-64 object-contain"
                                    onEnded={() => setIsPlaying(false)}
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    <button
                                        onClick={togglePlay}
                                        className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-accent/20 transition-colors"
                                    >
                                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                    </button>
                                    <button
                                        onClick={resetAnalysis}
                                        className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {videoUrl && !analysisResult && (
                            <AnimatedButton
                                variant="primary"
                                className="w-full mt-6"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        AI 분석 중...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Zap size={16} />
                                        AI 분석 시작
                                    </span>
                                )}
                            </AnimatedButton>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                <AlertCircle size={18} className="text-red-500" />
                                <span className="text-sm text-red-400">{error}</span>
                            </div>
                        )}
                    </BentoCard>

                    {/* Analysis Results */}
                    <AnimatePresence>
                        {analysisResult ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Overall Score */}
                                <BentoCard className="p-6">
                                    <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                                        <Target size={18} className="text-accent" />
                                        종합 점수
                                    </h2>
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <svg className="h-40 w-40 -rotate-90">
                                                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                                                <circle
                                                    cx="80" cy="80" r="70"
                                                    stroke="rgb(0,242,255)"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeDasharray={`${analysisResult.overallScore * 4.4} 440`}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-display text-5xl font-black italic text-accent tech-glow">{analysisResult.overallScore}</span>
                                                <span className="text-[10px] font-mono uppercase text-muted">/ 100</span>
                                            </div>
                                        </div>
                                    </div>
                                </BentoCard>

                                {/* Biometrics */}
                                <BentoCard className="p-6">
                                    <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                                        <Activity size={18} className="text-purple-400" />
                                        생체 데이터 분석
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        <ScoreGauge value={analysisResult.swingSpeed} label="스윙 속도" />
                                        <ScoreGauge value={analysisResult.impactAngle} label="임팩트 각도" color="rgb(168,85,247)" />
                                        <ScoreGauge value={analysisResult.balance} label="밸런스" color="rgb(34,197,94)" />
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <span className="text-[10px] font-mono uppercase text-muted">힙 로테이션</span>
                                            <p className="font-display text-xl font-black italic mt-1">{analysisResult.biometrics.hipRotation}°</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <span className="text-[10px] font-mono uppercase text-muted">어깨 회전</span>
                                            <p className="font-display text-xl font-black italic mt-1">{analysisResult.biometrics.shoulderTurn}°</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <span className="text-[10px] font-mono uppercase text-muted">클럽 패스</span>
                                            <p className="font-display text-lg font-black italic mt-1">{analysisResult.biometrics.clubPath}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4">
                                            <span className="text-[10px] font-mono uppercase text-muted">페이스 앵글</span>
                                            <p className="font-display text-lg font-black italic mt-1">{analysisResult.biometrics.faceAngle}</p>
                                        </div>
                                    </div>
                                </BentoCard>

                                {/* Recommendations */}
                                <BentoCard className="p-6">
                                    <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-green-400" />
                                        AI 코칭 조언
                                    </h2>
                                    <ul className="space-y-3">
                                        {analysisResult.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                                                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-[10px] font-bold text-accent">{idx + 1}</span>
                                                </div>
                                                <span className="text-sm text-muted">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </BentoCard>
                            </motion.div>
                        ) : (
                            <BentoCard className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                                <Zap size={48} className="text-muted/30 mb-4" />
                                <p className="text-muted font-mono text-sm text-center">
                                    영상을 업로드하면<br />AI가 스윙을 분석합니다
                                </p>
                            </BentoCard>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
