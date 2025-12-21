'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Play, RotateCcw, Download, Sparkles, Loader2, Eye, Settings2, Zap } from 'lucide-react';

interface SwingData {
    angle: number;
    speed: number;
    trajectory: string;
}

export default function Veo3DPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [swingType, setSwingType] = useState<'driver' | 'iron' | 'putter'>('driver');
    const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'top'>('side');
    const [showSettings, setShowSettings] = useState(false);
    const [swingData, setSwingData] = useState<SwingData>({
        angle: 45,
        speed: 100,
        trajectory: 'draw'
    });

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate Veo 3.1 generation (in production, this would call the actual API)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // For demo purposes, we'll use a placeholder
        setGeneratedVideo('/api/veo/demo-swing');
        setIsGenerating(false);
    };

    const swingTypes = [
        { id: 'driver', name: '드라이버', icon: '🏌️' },
        { id: 'iron', name: '아이언', icon: '⛳' },
        { id: 'putter', name: '퍼터', icon: '🎯' },
    ];

    const viewAngles = [
        { id: 'front', name: '정면' },
        { id: 'side', name: '측면' },
        { id: 'top', name: '상단' },
    ];

    const trajectories = [
        { id: 'straight', name: '스트레이트' },
        { id: 'draw', name: '드로우' },
        { id: 'fade', name: '페이드' },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                        <Sparkles size={12} />
                        Veo 3.1 Technology
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                        3D 스윙 <span className="text-green-400">시뮬레이션</span>
                    </h1>
                    <p className="mt-4 text-muted font-mono text-sm max-w-xl mx-auto">
                        AI 기반 3D 모델링으로 이상적인 스윙 동작을 시각화합니다
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings Panel */}
                    <BentoCard className="p-6">
                        <h2 className="font-display text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                            <Settings2 size={18} className="text-green-400" />
                            시뮬레이션 설정
                        </h2>

                        {/* Swing Type */}
                        <div className="mb-6">
                            <label className="text-[10px] font-mono uppercase text-muted mb-3 block">클럽 선택</label>
                            <div className="grid grid-cols-3 gap-2">
                                {swingTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSwingType(type.id as any)}
                                        className={`p-3 rounded-xl border transition-all text-center ${swingType === type.id
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{type.icon}</span>
                                        <span className="text-xs font-mono">{type.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* View Angle */}
                        <div className="mb-6">
                            <label className="text-[10px] font-mono uppercase text-muted mb-3 block">시점</label>
                            <div className="flex gap-2">
                                {viewAngles.map((angle) => (
                                    <button
                                        key={angle.id}
                                        onClick={() => setViewAngle(angle.id as any)}
                                        className={`flex-1 py-2 rounded-lg border transition-all text-xs font-mono ${viewAngle === angle.id
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-white/10 text-muted hover:text-white'
                                            }`}
                                    >
                                        {angle.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trajectory */}
                        <div className="mb-6">
                            <label className="text-[10px] font-mono uppercase text-muted mb-3 block">구질</label>
                            <div className="flex gap-2">
                                {trajectories.map((traj) => (
                                    <button
                                        key={traj.id}
                                        onClick={() => setSwingData({ ...swingData, trajectory: traj.id })}
                                        className={`flex-1 py-2 rounded-lg border transition-all text-xs font-mono ${swingData.trajectory === traj.id
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-white/10 text-muted hover:text-white'
                                            }`}
                                    >
                                        {traj.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Swing Angle */}
                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-mono uppercase text-muted">스윙 각도</label>
                                <span className="text-sm font-bold text-green-400">{swingData.angle}°</span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="60"
                                value={swingData.angle}
                                onChange={(e) => setSwingData({ ...swingData, angle: parseInt(e.target.value) })}
                                className="w-full accent-green-500"
                            />
                        </div>

                        {/* Swing Speed */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] font-mono uppercase text-muted">스윙 속도</label>
                                <span className="text-sm font-bold text-green-400">{swingData.speed}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="120"
                                value={swingData.speed}
                                onChange={(e) => setSwingData({ ...swingData, speed: parseInt(e.target.value) })}
                                className="w-full accent-green-500"
                            />
                        </div>

                        <AnimatedButton
                            variant="primary"
                            className="w-full bg-green-500 hover:bg-green-600"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    생성 중...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Zap size={16} />
                                    3D 생성
                                </span>
                            )}
                        </AnimatedButton>
                    </BentoCard>

                    {/* 3D Viewer */}
                    <BentoCard className="lg:col-span-2 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-lg font-black uppercase italic flex items-center gap-2">
                                <Eye size={18} className="text-green-400" />
                                3D 뷰어
                            </h2>
                            {generatedVideo && (
                                <div className="flex gap-2">
                                    <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <RotateCcw size={16} />
                                    </button>
                                    <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <Download size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-black border border-white/10">
                            {isGenerating ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin" />
                                        <Sparkles size={32} className="absolute inset-0 m-auto text-green-400" />
                                    </div>
                                    <p className="mt-6 font-mono text-sm text-green-400">Veo 3.1 렌더링 중...</p>
                                    <p className="mt-2 font-mono text-xs text-muted">AI가 3D 스윙 동작을 생성하고 있습니다</p>
                                </div>
                            ) : generatedVideo ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                                    {/* 3D Animation Placeholder */}
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <motion.div
                                                    className="text-8xl"
                                                    animate={{
                                                        rotateY: [0, 45, 0, -45, 0],
                                                        y: [0, -10, 0, -10, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                >
                                                    🏌️
                                                </motion.div>
                                            </div>
                                            <p className="font-display text-xl font-black italic text-green-400">3D 시뮬레이션 완료</p>
                                            <p className="text-xs text-muted mt-2">
                                                {swingType === 'driver' ? '드라이버' : swingType === 'iron' ? '아이언' : '퍼터'} |
                                                {swingData.trajectory === 'straight' ? ' 스트레이트' : swingData.trajectory === 'draw' ? ' 드로우' : ' 페이드'} |
                                                {' '}{swingData.speed}% 스피드
                                            </p>
                                        </div>

                                        {/* Play overlay */}
                                        <button className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center hover:bg-green-500/30 transition-colors">
                                            <Play size={32} className="text-green-400 ml-1" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Sparkles size={48} className="text-muted/30 mb-4" />
                                    <p className="font-mono text-sm text-muted">설정을 선택하고 3D 생성을 시작하세요</p>
                                </div>
                            )}
                        </div>

                        {/* Info Cards */}
                        {generatedVideo && (
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-[10px] font-mono uppercase text-muted">스윙 각도</p>
                                    <p className="font-display text-2xl font-black italic text-green-400 mt-1">{swingData.angle}°</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-[10px] font-mono uppercase text-muted">예상 비거리</p>
                                    <p className="font-display text-2xl font-black italic text-green-400 mt-1">{Math.round(swingData.speed * 2.5)}m</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-[10px] font-mono uppercase text-muted">구질</p>
                                    <p className="font-display text-2xl font-black italic text-green-400 mt-1">
                                        {swingData.trajectory === 'straight' ? '직구' : swingData.trajectory === 'draw' ? '드로우' : '페이드'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </BentoCard>
                </div>
            </main>
        </div>
    );
}
