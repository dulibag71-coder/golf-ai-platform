'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Booking {
    id: number;
    lesson_type: string;
    lesson_date: string;
    lesson_time: string;
    status: string;
}

export default function LessonPage() {
    const [userRole, setUserRole] = useState('user');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [lessonType, setLessonType] = useState('스윙 교정');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchData = async () => {
                try {
                    const userData = await api.get('/auth/me', token);
                    if (userData?.role) setUserRole(userData.role);

                    const bookingsData = await api.get('/lesson', token);
                    if (bookingsData) setBookings(bookingsData);
                } catch {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    setUserRole(user.role || 'user');
                }
            };
            fetchData();
        }
    }, []);

    const isPaid = userRole !== 'user';
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const lessonTypes = ['스윙 교정', '드라이버 비거리', '아이언 정확도', '숏게임', '퍼팅', '코스 전략'];

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) {
            alert('날짜와 시간을 선택해주세요.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/lesson', {
                lessonType,
                lessonDate: selectedDate,
                lessonTime: selectedTime
            }, token || '');

            setSubmitted(true);

            // 예약 목록 새로고침
            const bookingsData = await api.get('/lesson', token || '');
            if (bookingsData) setBookings(bookingsData);
        } catch (error) {
            alert('예약에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!isPaid) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                        <h1 className="text-3xl font-bold mb-4">🔒 유료 플랜 전용</h1>
                        <p className="text-gray-400 mb-6">1:1 프로 레슨은 프로 플랜 이상에서 이용 가능합니다.</p>
                        <Link href="/pricing" className="inline-block bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold">
                            플랜 업그레이드 →
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
                        <p className="text-gray-400 mt-4">예약 시간에 맞춰 온라인 레슨 링크가 발송됩니다.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-6 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl">
                            추가 예약하기
                        </button>
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
                <p className="text-gray-400 mb-6">전문 프로 코치와 1:1 온라인 레슨을 예약하세요.</p>

                {/* 탭 */}
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setActiveTab('book')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'book' ? 'bg-purple-600' : 'bg-gray-800'}`}>
                        새 예약
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'history' ? 'bg-purple-600' : 'bg-gray-800'}`}>
                        예약 내역 ({bookings.length})
                    </button>
                </div>

                {activeTab === 'book' ? (
                    <div className="space-y-6">
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <h2 className="font-bold mb-4">레슨 주제 선택</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {lessonTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setLessonType(type)}
                                        className={`p-3 rounded-xl text-sm font-bold transition ${lessonType === type ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

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

                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <h2 className="font-bold mb-4">시간 선택</h2>
                            <div className="grid grid-cols-4 gap-3">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-3 rounded-xl text-sm font-bold transition ${selectedTime === time ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 py-4 rounded-xl font-bold text-lg"
                        >
                            {loading ? '예약 중...' : '레슨 예약하기'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                        {bookings.length > 0 ? (
                            <ul className="space-y-4">
                                {bookings.map(b => (
                                    <li key={b.id} className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{b.lesson_type}</p>
                                            <p className="text-sm text-gray-400">{new Date(b.lesson_date).toLocaleDateString()} {b.lesson_time}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${b.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                                            {b.status === 'confirmed' ? '확정' : '대기'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-8">예약 내역이 없습니다</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
