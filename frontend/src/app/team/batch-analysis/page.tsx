'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Upload, FileVideo, Trash2, Play, CheckCircle, Loader2, AlertCircle, BarChart3, Download } from 'lucide-react';
import FeatureGate from '@/components/FeatureGate';

interface VideoFile {
    id: string;
    file: File;
    name: string;
    status: 'pending' | 'analyzing' | 'complete' | 'error';
    result?: {
        overallScore: number;
        swingSpeed: number;
        impactAngle: number;
    };
}

export default function BatchAnalysisPage() {
    const [videos, setVideos] = useState<VideoFile[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newVideos: VideoFile[] = files.map((file, idx) => ({
            id: `${Date.now()}-${idx}`,
            file,
            name: file.name,
            status: 'pending'
        }));
        setVideos(prev => [...prev, ...newVideos]);
    };

    const removeVideo = (id: string) => {
        setVideos(prev => prev.filter(v => v.id !== id));
    };

    const startBatchAnalysis = async () => {
        setIsAnalyzing(true);
        setCompletedCount(0);

        for (let i = 0; i < videos.length; i++) {
            setVideos(prev => prev.map(v =>
                v.id === videos[i].id ? { ...v, status: 'analyzing' } : v
            ));

            try {
                const formData = new FormData();
                formData.append('video', videos[i].file);

                const response = await fetch('/api/swing/analyze', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                setVideos(prev => prev.map(v =>
                    v.id === videos[i].id
                        ? {
                            ...v,
                            status: 'complete',
                            result: {
                                overallScore: result.overallScore || 75,
                                swingSpeed: result.swingSpeed || 80,
                                impactAngle: result.impactAngle || 85
                            }
                        }
                        : v
                ));
                setCompletedCount(prev => prev + 1);
            } catch (error) {
                setVideos(prev => prev.map(v =>
                    v.id === videos[i].id ? { ...v, status: 'error' } : v
                ));
            }
        }

        setIsAnalyzing(false);
    };

    const downloadReport = () => {
        const report = videos
            .filter(v => v.status === 'complete')
            .map(v => ({
                name: v.name,
                ...v.result
            }));

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'batch-analysis-report.json';
        a.click();
    };

    const averageScore = videos.filter(v => v.result).length > 0
        ? Math.round(
            videos.filter(v => v.result).reduce((acc, v) => acc + (v.result?.overallScore || 0), 0) /
            videos.filter(v => v.result).length
        )
        : 0;

    return (
        <FeatureGate featureName="batch-analysis">
            <div className="min-h-screen bg-black text-white font-sans">
                <Navbar />

                <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
                    {/* ... rest of the main content ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-block px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                            Batch Analysis System
                        </div>
                        <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                            일괄 <span className="text-purple-400">분석</span>
                        </h1>
                        <p className="mt-4 text-muted text-sm max-w-xl mx-auto">
                            여러 스윙 영상을 한 번에 업로드하여 일괄 분석합니다
                        </p>
                    </motion.div>

                    {/* Stats */}
                    {videos.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <BentoCard className="p-4 text-center">
                                <p className="text-[10px] font-mono uppercase text-muted">총 영상</p>
                                <p className="font-display text-2xl font-black italic">{videos.length}</p>
                            </BentoCard>
                            <BentoCard className="p-4 text-center">
                                <p className="text-[10px] font-mono uppercase text-muted">완료</p>
                                <p className="font-display text-2xl font-black italic text-green-400">{completedCount}</p>
                            </BentoCard>
                            <BentoCard className="p-4 text-center">
                                <p className="text-[10px] font-mono uppercase text-muted">대기중</p>
                                <p className="font-display text-2xl font-black italic">{videos.filter(v => v.status === 'pending').length}</p>
                            </BentoCard>
                            <BentoCard className="p-4 text-center">
                                <p className="text-[10px] font-mono uppercase text-muted">평균 점수</p>
                                <p className="font-display text-2xl font-black italic text-accent">{averageScore || '-'}</p>
                            </BentoCard>
                        </div>
                    )}

                    <BentoCard className="p-6">
                        {/* Upload Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group mb-6"
                        >
                            <Upload size={40} className="mx-auto mb-3 text-muted group-hover:text-purple-400 transition-colors" />
                            <p className="font-mono text-sm text-muted">클릭하여 영상 여러 개 선택</p>
                            <p className="text-[10px] text-muted/50 mt-1">MP4, MOV 지원 (영상당 최대 50MB)</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleFilesChange}
                            className="hidden"
                        />

                        {/* Video List */}
                        {videos.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {videos.map((video, idx) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${video.status === 'complete' ? 'bg-green-500/10 border-green-500/30' :
                                            video.status === 'analyzing' ? 'bg-purple-500/10 border-purple-500/30' :
                                                video.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                                                    'bg-white/5 border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${video.status === 'complete' ? 'bg-green-500/20' :
                                                video.status === 'analyzing' ? 'bg-purple-500/20' :
                                                    video.status === 'error' ? 'bg-red-500/20' :
                                                        'bg-white/10'
                                                }`}>
                                                {video.status === 'pending' && <FileVideo size={20} className="text-muted" />}
                                                {video.status === 'analyzing' && <Loader2 size={20} className="text-purple-400 animate-spin" />}
                                                {video.status === 'complete' && <CheckCircle size={20} className="text-green-400" />}
                                                {video.status === 'error' && <AlertCircle size={20} className="text-red-400" />}
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm truncate max-w-[200px]">{video.name}</p>
                                                <p className="text-[10px] text-muted uppercase">
                                                    {video.status === 'pending' && '대기중'}
                                                    {video.status === 'analyzing' && '분석중...'}
                                                    {video.status === 'complete' && '완료'}
                                                    {video.status === 'error' && '오류'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {video.result && (
                                                <div className="flex gap-6 mr-4">
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-muted uppercase">점수</p>
                                                        <p className="font-display text-lg font-black italic text-accent">{video.result.overallScore}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-muted uppercase">속도</p>
                                                        <p className="font-display text-lg font-black italic">{video.result.swingSpeed}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] text-muted uppercase">각도</p>
                                                        <p className="font-display text-lg font-black italic">{video.result.impactAngle}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {video.status === 'pending' && (
                                                <button
                                                    onClick={() => removeVideo(video.id)}
                                                    className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 size={14} className="text-muted hover:text-red-400" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        {videos.length > 0 && (
                            <div className="flex gap-4">
                                <AnimatedButton
                                    variant="primary"
                                    className="flex-1"
                                    onClick={startBatchAnalysis}
                                    disabled={isAnalyzing || videos.filter(v => v.status === 'pending').length === 0}
                                >
                                    {isAnalyzing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            분석 중 ({completedCount}/{videos.length})
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <BarChart3 size={16} />
                                            일괄 분석 시작
                                        </span>
                                    )}
                                </AnimatedButton>

                                {completedCount > 0 && (
                                    <AnimatedButton variant="outline" onClick={downloadReport}>
                                        <Download size={16} className="mr-2" />
                                        리포트 다운로드
                                    </AnimatedButton>
                                )}
                            </div>
                        )}
                    </BentoCard>
                </main>
            </div>
        </FeatureGate>
    );
}
