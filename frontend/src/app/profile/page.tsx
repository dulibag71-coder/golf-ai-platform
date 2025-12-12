'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface UserProfile {
    email: string;
    handicap: number;
    goal: string;
    mainClub: string;
    level: number;
    totalSwings: number;
    averageScore: number;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        email: '',
        handicap: 20,
        goal: '핸디캡 10 달성',
        mainClub: '드라이버',
        level: 3,
        totalSwings: 47,
        averageScore: 78
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setProfile(prev => ({ ...prev, email: user.email || 'user@example.com' }));
        }
    }, []);

    const handleSave = () => {
        // In production, save to backend
        alert('프로필이 저장되었습니다!');
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
                <h1 className="text-3xl font-bold mb-8">내 프로필</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1 bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold">
                            {profile.email.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-xl font-bold">{profile.email}</h2>
                        <p className="text-green-400 mt-1">레벨 {profile.level}</p>
                        <div className="mt-4 bg-gray-800 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">다음 레벨까지 40%</p>
                    </div>

                    {/* Stats & Info */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats */}
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <h3 className="font-bold text-lg mb-4">통계</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-2xl font-bold text-green-400">{profile.totalSwings}</p>
                                    <p className="text-sm text-gray-400">총 스윙 분석</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-2xl font-bold text-blue-400">{profile.averageScore}</p>
                                    <p className="text-sm text-gray-400">평균 점수</p>
                                </div>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <p className="text-2xl font-bold text-yellow-400">{profile.handicap}</p>
                                    <p className="text-sm text-gray-400">현재 핸디캡</p>
                                </div>
                            </div>
                        </div>

                        {/* Editable Info */}
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">골프 정보</h3>
                                {!editing ? (
                                    <button onClick={() => setEditing(true)} className="text-green-400 hover:text-green-300 text-sm">
                                        수정하기
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="text-green-400 hover:text-green-300 text-sm font-bold">
                                        저장하기
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">핸디캡</label>
                                    {editing ? (
                                        <input
                                            type="number"
                                            value={profile.handicap}
                                            onChange={(e) => setProfile({ ...profile, handicap: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                        />
                                    ) : (
                                        <p className="text-white">{profile.handicap}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">목표</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={profile.goal}
                                            onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                        />
                                    ) : (
                                        <p className="text-white">{profile.goal}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">주력 클럽</label>
                                    {editing ? (
                                        <select
                                            value={profile.mainClub}
                                            onChange={(e) => setProfile({ ...profile, mainClub: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option>드라이버</option>
                                            <option>아이언</option>
                                            <option>웨지</option>
                                            <option>퍼터</option>
                                        </select>
                                    ) : (
                                        <p className="text-white">{profile.mainClub}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
