'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Tournament {
    id: number;
    tournament_name: string;
    tournament_date: string;
    program_type: string;
    status: string;
}

interface TrainingProgress {
    id: number;
    program_id: string;
    program_name: string;
    week_number: number;
    total_weeks: number;
    tasks_completed: number;
    total_tasks: number;
}

export default function TournamentCoachPage() {
    const [userRole, setUserRole] = useState('user');
    const [activeProgram, setActiveProgram] = useState<string | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
    const [tournamentName, setTournamentName] = useState('');
    const [tournamentDate, setTournamentDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [startingProgram, setStartingProgram] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchData = async () => {
                try {
                    const userData = await api.get('/auth/me', token);
                    if (userData?.role) setUserRole(userData.role);

                    const tournamentsData = await api.get('/tournament', token);
                    if (tournamentsData) setTournaments(tournamentsData);

                    const trainingData = await api.get('/training', token);
                    if (trainingData) setTrainingProgress(trainingData);
                } catch {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    setUserRole(user.role || 'user');
                }
            };
            fetchData();
        }
    }, []);

    const isPaid = userRole !== 'user';

    const programs = [
        { id: 'mental', title: '멘탈 트레이닝', icon: '🧠', description: '대회 압박감 극복, 집중력 향상', weeks: 4 },
        { id: 'strategy', title: '코스 전략', icon: '🗺️', description: '코스 공략법, 클럽 선택 전략', weeks: 3 },
        { id: 'physical', title: '피지컬 컨디셔닝', icon: '💪', description: '체력 관리, 부상 예방', weeks: 6 },
        { id: 'scoring', title: '스코어링 집중', icon: '🎯', description: '숏게임, 퍼팅 마스터', weeks: 4 }
    ];

    const handleRegisterTournament = async () => {
        if (!tournamentName || !tournamentDate) {
            alert('대회명과 날짜를 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/tournament', {
                tournamentName,
                tournamentDate,
                programType: activeProgram || 'general'
            }, token || '');

            alert('대회가 등록되었습니다!');
            setTournamentName('');
            setTournamentDate('');

            const tournamentsData = await api.get('/tournament', token || '');
            if (tournamentsData) setTournaments(tournamentsData);
        } catch (error) {
            alert('등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartProgram = async () => {
        if (!activeProgram) return;

        const program = programs.find(p => p.id === activeProgram);
        if (!program) return;

        setStartingProgram(true);
        try {
            const token = localStorage.getItem('token');
            const result = await api.post('/training', {
                programId: program.id,
                programName: program.title,
                weeks: program.weeks
            }, token || '');

            alert(result.message || '프로그램이 시작되었습니다! 이메일로 커리큘럼이 발송됩니다.');

            const trainingData = await api.get('/training', token || '');
            if (trainingData) setTrainingProgress(trainingData);
        } catch (error) {
            alert('프로그램 시작에 실패했습니다.');
        } finally {
            setStartingProgram(false);
        }
    };

    const updateProgress = async (progressId: number, newTasksCompleted: number, weekNumber: number) => {
        try {
            const token = localStorage.getItem('token');
            await api.put('/training', {
                progressId,
                tasksCompleted: newTasksCompleted,
                weekNumber
            }, token || '');

            const trainingData = await api.get('/training', token || '');
            if (trainingData) setTrainingProgress(trainingData);
        } catch (error) {
            console.error('Progress update failed');
        }
    };

    if (!isPaid) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h1 className="text-3xl font-bold mb-4">🔒 유료 플랜 전용</h1>
                        <p className="text-gray-400 mb-6">대회 준비 코칭은 프로 플랜 이상에서 이용 가능합니다.</p>
                        <Link href="/pricing" className="inline-block bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold">
                            플랜 업그레이드 →
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

                {/* 진행 중인 훈련 */}
                {trainingProgress.length > 0 && (
                    <div className="bg-purple-900/20 border border-purple-500 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-bold mb-4">📊 진행 중인 훈련</h3>
                        <div className="space-y-4">
                            {trainingProgress.map(tp => (
                                <div key={tp.id} className="bg-gray-800 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">{tp.program_name}</span>
                                        <span className="text-sm text-gray-400">{tp.week_number}/{tp.total_weeks}주차</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-purple-600 h-3 rounded-full transition-all"
                                            style={{ width: `${(tp.tasks_completed / tp.total_tasks) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-400">완료: {tp.tasks_completed}/{tp.total_tasks}</span>
                                        <button
                                            onClick={() => updateProgress(tp.id, tp.tasks_completed + 1, tp.week_number)}
                                            className="text-sm bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded"
                                        >
                                            +1 완료
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 프로그램 선택 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {programs.map(prog => {
                        const isActive = trainingProgress.some(tp => tp.program_id === prog.id);
                        return (
                            <button
                                key={prog.id}
                                onClick={() => setActiveProgram(activeProgram === prog.id ? null : prog.id)}
                                disabled={isActive}
                                className={`p-6 rounded-2xl text-left transition ${isActive ? 'bg-green-900/30 border border-green-500' :
                                        activeProgram === prog.id ? 'bg-purple-900/30 border-2 border-purple-500' :
                                            'bg-gray-900 border border-gray-800 hover:border-gray-600'
                                    } ${isActive ? 'opacity-70' : ''}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{prog.icon}</span>
                                    <h3 className="text-xl font-bold">{prog.title}</h3>
                                    {isActive && <span className="text-xs bg-green-600 px-2 py-1 rounded">진행 중</span>}
                                </div>
                                <p className="text-gray-400 text-sm">{prog.description}</p>
                                <p className="text-purple-400 text-sm mt-2">{prog.weeks}주 프로그램</p>
                            </button>
                        );
                    })}
                </div>

                {activeProgram && !trainingProgress.some(tp => tp.program_id === activeProgram) && (
                    <button
                        onClick={handleStartProgram}
                        disabled={startingProgram}
                        className="w-full mb-8 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 py-4 rounded-xl font-bold"
                    >
                        {startingProgram ? '시작 중...' : `${programs.find(p => p.id === activeProgram)?.title} 프로그램 시작하기`}
                    </button>
                )}

                {/* 대회 등록 */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
                    <h3 className="text-lg font-bold mb-4">📅 목표 대회 등록</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                            placeholder="대회명 (예: 2024 아마추어 선수권)"
                            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                        />
                        <input
                            type="date"
                            value={tournamentDate}
                            onChange={(e) => setTournamentDate(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                        />
                    </div>
                    <button
                        onClick={handleRegisterTournament}
                        disabled={loading}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold"
                    >
                        {loading ? '등록 중...' : '대회 등록'}
                    </button>
                </div>

                {/* 등록된 대회 */}
                {tournaments.length > 0 && (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        <h3 className="text-lg font-bold mb-4">🎯 나의 목표 대회</h3>
                        <ul className="space-y-3">
                            {tournaments.map(t => {
                                const dDay = Math.ceil((new Date(t.tournament_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                return (
                                    <li key={t.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{t.tournament_name}</p>
                                            <p className="text-sm text-gray-400">{new Date(t.tournament_date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${dDay > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                                            {dDay > 0 ? `D-${dDay}` : '종료'}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
