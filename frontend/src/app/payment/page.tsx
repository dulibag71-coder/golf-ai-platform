'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

// 일반인용 플랜
const individualPlans = [
    { name: '프로', price: 29900, type: 'individual' },
    { name: '엘리트', price: 59900, type: 'individual' }
];

// 동호회용 플랜
const clubPlans = [
    { name: '동호회 스타터', price: 99000, type: 'club', members: '최대 20명' },
    { name: '동호회 프로', price: 199000, type: 'club', members: '최대 50명' }
];

export default function PaymentPage() {
    const [tab, setTab] = useState<'individual' | 'club'>('individual');
    const plans = tab === 'individual' ? individualPlans : clubPlans;
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);
    const [senderName, setSenderName] = useState('');
    const [clubName, setClubName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // 탭 변경 시 플랜 초기화
    const handleTabChange = (newTab: 'individual' | 'club') => {
        setTab(newTab);
        const newPlans = newTab === 'individual' ? individualPlans : clubPlans;
        setSelectedPlan(newPlans[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!senderName.trim()) {
            setError('입금자명을 입력해주세요.');
            return;
        }
        if (tab === 'club' && !clubName.trim()) {
            setError('동호회명을 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.post('/payments/request', {
                amount: selectedPlan.price,
                senderName: senderName.trim(),
                planName: selectedPlan.name,
                clubName: tab === 'club' ? clubName.trim() : null
            }, token || '');

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || '결제 요청 실패');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="max-w-xl mx-auto px-4 pt-24 text-center">
                    <div className="bg-green-900/30 border border-green-500 rounded-2xl p-8">
                        <h1 className="text-3xl font-bold text-green-400 mb-4">✅ 결제 요청 완료!</h1>
                        <p className="text-gray-300 mb-6">
                            관리자 확인 후 서비스가 활성화됩니다.<br />
                            보통 1시간 이내에 처리됩니다.
                        </p>
                        <div className="bg-gray-800 p-4 rounded-xl text-left">
                            <p><strong>플랜:</strong> {selectedPlan.name}</p>
                            <p><strong>금액:</strong> ₩{selectedPlan.price.toLocaleString()}</p>
                            <p><strong>입금자명:</strong> {senderName}</p>
                            {clubName && <p><strong>동호회명:</strong> {clubName}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-xl mx-auto px-4 pt-24">
                <h1 className="text-3xl font-bold mb-6 text-center">💳 결제 요청</h1>

                {/* 탭 선택 */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-900 rounded-xl p-1">
                        <button
                            onClick={() => handleTabChange('individual')}
                            className={`px-6 py-3 rounded-lg font-bold transition ${tab === 'individual' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            🏌️ 일반인용
                        </button>
                        <button
                            onClick={() => handleTabChange('club')}
                            className={`px-6 py-3 rounded-lg font-bold transition ${tab === 'club' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            👥 동호회용
                        </button>
                    </div>
                </div>

                {/* Bank Info */}
                <div className={`${tab === 'individual' ? 'bg-green-900/30 border-green-500' : 'bg-blue-900/30 border-blue-500'} border rounded-xl p-6 mb-8`}>
                    <h2 className={`text-lg font-bold ${tab === 'individual' ? 'text-green-400' : 'text-blue-400'} mb-3`}>입금 계좌</h2>
                    <p className="text-2xl font-bold">카카오뱅크 7777034553512</p>
                    <p className="text-gray-400">예금주: 박두리</p>
                    <p className="text-sm text-gray-500 mt-2">📞 문의: 010-8632-3819</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Plan Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">플랜 선택</label>
                        <div className="grid grid-cols-2 gap-4">
                            {plans.map((plan) => (
                                <button
                                    key={plan.name}
                                    type="button"
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`p-4 rounded-xl border-2 transition ${selectedPlan.name === plan.name
                                        ? tab === 'individual' ? 'border-green-500 bg-green-900/30' : 'border-blue-500 bg-blue-900/30'
                                        : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                                        }`}
                                >
                                    <p className="font-bold">{plan.name}</p>
                                    {'members' in plan && <p className="text-xs text-blue-400">{(plan as any).members}</p>}
                                    <p className={tab === 'individual' ? 'text-green-400' : 'text-blue-400'}>
                                        ₩{plan.price.toLocaleString()}/월
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Club Name (동호회용만) */}
                    {tab === 'club' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">동호회명</label>
                            <input
                                type="text"
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                placeholder="동호회 이름"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    )}

                    {/* Sender Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">입금자명</label>
                        <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="입금 시 사용한 이름"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${tab === 'individual' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} disabled:bg-gray-600 text-white font-bold py-4 rounded-xl transition`}
                    >
                        {loading ? '처리 중...' : '결제 요청하기'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    위 계좌로 입금 후 결제 요청 버튼을 눌러주세요.<br />
                    관리자 확인 후 서비스가 활성화됩니다.
                </p>
            </div>
        </div>
    );
}
