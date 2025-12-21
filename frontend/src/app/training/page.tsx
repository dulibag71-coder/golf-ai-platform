'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BentoCard from '@/components/ui/BentoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Dumbbell, Target, Clock, CheckCircle, Play, ChevronRight, Flame, Calendar, RefreshCw } from 'lucide-react';

interface TrainingProgram {
    id: string;
    name: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    exercises: Exercise[];
    focus: string[];
}

interface Exercise {
    id: string;
    name: string;
    description: string;
    reps: string;
    videoUrl?: string;
    completed?: boolean;
}

const trainingPrograms: TrainingProgram[] = [
    {
        id: 'swing-basics',
        name: '스윙 기초 마스터',
        description: '올바른 그립과 스탠스부터 시작하는 기초 프로그램',
        duration: '30분',
        difficulty: 'beginner',
        focus: ['그립', '스탠스', '백스윙'],
        exercises: [
            { id: '1', name: '그립 연습', description: '올바른 그립 자세를 10회 반복', reps: '10회' },
            { id: '2', name: '스탠스 체크', description: '거울 앞에서 스탠스 확인', reps: '5분' },
            { id: '3', name: '하프 스윙', description: '허리 높이까지만 스윙 연습', reps: '20회' },
            { id: '4', name: '풀 스윙', description: '천천히 풀 스윙 연습', reps: '15회' },
        ]
    },
    {
        id: 'power-drive',
        name: '파워 드라이브 부스트',
        description: '비거리 향상을 위한 파워 트레이닝',
        duration: '45분',
        difficulty: 'intermediate',
        focus: ['힙 로테이션', '코어 강화', '팔로우스루'],
        exercises: [
            { id: '1', name: '힙 로테이션 드릴', description: '하체 회전력 강화 운동', reps: '15회 x 3세트' },
            { id: '2', name: '메디신볼 스윙', description: '코어 파워 강화', reps: '12회 x 3세트' },
            { id: '3', name: '스피드 스윙', description: '최대 속도로 스윙 연습', reps: '10회' },
            { id: '4', name: '저항 밴드 스윙', description: '밴드를 이용한 저항 훈련', reps: '15회 x 2세트' },
        ]
    },
    {
        id: 'accuracy-pro',
        name: '정확도 프로 트레이닝',
        description: '목표를 정확히 맞추는 정밀 훈련',
        duration: '40분',
        difficulty: 'advanced',
        focus: ['조준', '템포', '일관성'],
        exercises: [
            { id: '1', name: '타겟 에이밍', description: '작은 목표물을 조준하며 스윙', reps: '20회' },
            { id: '2', name: '메트로놈 스윙', description: '일정한 템포로 스윙 유지', reps: '15회' },
            { id: '3', name: '눈감고 스윙', description: '근육 기억력 강화', reps: '10회' },
            { id: '4', name: '연속 스윙', description: '같은 자세로 10회 연속', reps: '10회 x 3세트' },
        ]
    },
];

export default function TrainingPage() {
    const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
    const [isTraining, setIsTraining] = useState(false);
    const [weeklyGoal, setWeeklyGoal] = useState({ completed: 3, total: 5 });
    const [streak, setStreak] = useState(7);

    const toggleExerciseComplete = (exerciseId: string) => {
        const newCompleted = new Set(completedExercises);
        if (newCompleted.has(exerciseId)) {
            newCompleted.delete(exerciseId);
        } else {
            newCompleted.add(exerciseId);
        }
        setCompletedExercises(newCompleted);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-400/10';
            case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
            case 'advanced': return 'text-red-400 bg-red-400/10';
            default: return 'text-muted bg-white/10';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '초급';
            case 'intermediate': return '중급';
            case 'advanced': return '고급';
            default: return difficulty;
        }
    };

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
                        AI Training Protocol
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter tech-glow italic">
                        맞춤형 <span className="text-accent">훈련</span> 프로그램
                    </h1>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <BentoCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                                <Flame size={28} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono uppercase text-muted">연속 훈련</p>
                                <p className="font-display text-3xl font-black italic">{streak}일</p>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <Calendar size={28} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono uppercase text-muted">주간 목표</p>
                                <p className="font-display text-3xl font-black italic">{weeklyGoal.completed}/{weeklyGoal.total}</p>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full transition-all"
                                style={{ width: `${(weeklyGoal.completed / weeklyGoal.total) * 100}%` }}
                            />
                        </div>
                    </BentoCard>

                    <BentoCard className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                <Target size={28} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-mono uppercase text-muted">프로그램 완료</p>
                                <p className="font-display text-3xl font-black italic">12</p>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {!selectedProgram ? (
                    /* Program Selection */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {trainingPrograms.map((program, idx) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <BentoCard
                                    className="p-6 cursor-pointer hover:border-accent/50 transition-all group h-full flex flex-col"
                                    onClick={() => setSelectedProgram(program)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <Dumbbell size={24} className="text-accent" />
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${getDifficultyColor(program.difficulty)}`}>
                                            {getDifficultyText(program.difficulty)}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-xl font-black italic mb-2 group-hover:text-accent transition-colors">
                                        {program.name}
                                    </h3>
                                    <p className="text-sm text-muted mb-4 flex-1">{program.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {program.focus.map((f, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono uppercase">
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-muted">
                                            <Clock size={14} />
                                            <span className="text-xs">{program.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted">
                                            <span className="text-xs">{program.exercises.length} 운동</span>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </BentoCard>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Training Session */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <BentoCard className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedProgram(null);
                                            setCompletedExercises(new Set());
                                            setIsTraining(false);
                                        }}
                                        className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                    <div>
                                        <h2 className="font-display text-2xl font-black italic">{selectedProgram.name}</h2>
                                        <p className="text-sm text-muted">{selectedProgram.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-mono uppercase text-muted">진행률</p>
                                    <p className="font-display text-2xl font-black italic text-accent">
                                        {completedExercises.size}/{selectedProgram.exercises.length}
                                    </p>
                                </div>
                            </div>

                            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
                                <motion.div
                                    className="h-full bg-accent rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(completedExercises.size / selectedProgram.exercises.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="space-y-4">
                                {selectedProgram.exercises.map((exercise, idx) => (
                                    <motion.div
                                        key={exercise.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-4 rounded-xl border transition-all ${completedExercises.has(exercise.id)
                                                ? 'bg-accent/10 border-accent/30'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleExerciseComplete(exercise.id)}
                                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${completedExercises.has(exercise.id)
                                                        ? 'bg-accent text-black'
                                                        : 'bg-white/10 hover:bg-accent/20'
                                                    }`}
                                            >
                                                {completedExercises.has(exercise.id) ? (
                                                    <CheckCircle size={20} />
                                                ) : (
                                                    <span className="font-bold">{idx + 1}</span>
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${completedExercises.has(exercise.id) ? 'line-through text-muted' : ''}`}>
                                                    {exercise.name}
                                                </h4>
                                                <p className="text-sm text-muted">{exercise.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono">
                                                    {exercise.reps}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {completedExercises.size === selectedProgram.exercises.length && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-xl text-center"
                                >
                                    <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
                                    <h3 className="font-display text-2xl font-black italic mb-2">훈련 완료!</h3>
                                    <p className="text-muted mb-4">오늘의 프로그램을 성공적으로 마쳤습니다.</p>
                                    <AnimatedButton
                                        variant="primary"
                                        onClick={() => {
                                            setSelectedProgram(null);
                                            setCompletedExercises(new Set());
                                        }}
                                    >
                                        다른 프로그램 선택
                                    </AnimatedButton>
                                </motion.div>
                            )}
                        </BentoCard>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
