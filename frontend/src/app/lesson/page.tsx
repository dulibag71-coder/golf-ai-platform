'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// 1:1 프로 레슨 예약 시스템 (엘리트 전용)
export default function LessonPage() {
    const [userRole, setUserRole] = useState('user');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [lessonType, setLessonType] = useState('스윙 교정');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'user');
    }, []);

    const isElite = userRole === 'elite' || userRole === 'club_pro' || userRole === 'club_enterprise';

    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const lessonTypes = ['스윙 교정', '드라이버 비거리', '아이언 정확도', '숏게임', '퍼팅', '코스 전략'];

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            alert('날짜와 시간을 선택해주세요.');
            return;
        }
        setSubmitted(true);
    };

    if (!isElite) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h1 className="text-3xl font-bold mb-4">🔒 엘리트 전용 기능</h1>
                        <p className="text-gray-400 mb-6">1:1 프로 레슨은 엘리트 플랜 이상에서 이용 가능합니다.</p>
                        <Link href="/pricing" className="inline-block bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded-xl font-bold">
                            엘리트로 업그레이드 →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-green-900/30 border border-green-500 rounded-2xl p-8">
                        <h1 className="text-3xl font-bold text-green-400 mb-4">✅ 레슨 예약 완료!</h1>
                        <div className="bg-gray-800 p-4 rounded-xl text-left mt-6">
                            <p><strong>레슨 유형:</strong> {lessonType}</p>
                            <p><strong>날짜:</strong> {selectedDate}</p>
                            <p><strong>시간:</strong> {selectedTime}</p>
                        </div>
                        <p className="text-gray-400 mt-4">프로 코치가 확인 후 연락드립니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
                <h1 className="text-3xl font-bold mb-2 text-purple-400">👨‍🏫 1:1 프로 레슨</h1>
                <p className="text-gray-400 mb-8">전문 프로 코치와 1:1 온라인 레슨을 예약하세요.</p>

                <div className="space-y-6">
                    {/* 레슨 유형 */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h2 className="font-bold mb-4">레슨 주제 선택</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {lessonTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setLessonType(type)}
                                    className={`p-3 rounded-xl text-sm font-bold transition ${lessonType === type ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 날짜 선택 */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h2 className="font-bold mb-4">날짜 선택</h2>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
                        />
                    </div>

                    {/* 시간 선택 */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <h2 className="font-bold mb-4">시간 선택</h2>
                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`p-3 rounded-xl text-sm font-bold transition ${selectedTime === time ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold text-lg"
                    >
                        레슨 예약하기
                    </button>
                </div>
            </div>
        </div>
    );
}
