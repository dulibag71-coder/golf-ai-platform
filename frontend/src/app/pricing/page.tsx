'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';

// 일반인용 플랜
const individualPlans = [
    {
        name: '무료 체험',
        price: '0',
        period: '14일',
        features: ['스윙 분석 3회', 'AI 코치 기본 상담', '기본 통계 확인'],
        cta: '무료로 시작하기',
        highlighted: false
    },
    {
        name: '프로',
        price: '29,900',
        period: '월',
        features: ['무제한 스윙 분석', 'AI 코치 무제한', '상세 리포트', '맞춤 훈련', '영상 저장 100GB'],
        cta: '프로 시작',
        highlighted: true
    },
    {
        name: '엘리트',
        price: '59,900',
        period: '월',
        features: ['프로 모든 기능', '1:1 프로 레슨', '대회 준비 코칭', '우선 지원', '무제한 저장'],
        cta: '엘리트 시작',
        highlighted: false
    }
];

// 동호회용 플랜
const clubPlans = [
    {
        name: '동호회 스타터',
        price: '99,000',
        period: '월',
        members: '최대 20명',
        features: ['팀 대시보드', '멤버 랭킹', '단체 분석', '월간 리포트', '전용 고객지원'],
        cta: '스타터 시작',
        highlighted: false
    },
    {
        name: '동호회 프로',
        price: '199,000',
        period: '월',
        members: '최대 50명',
        features: ['스타터 모든 기능', '대회 개최 기능', '실시간 랭킹', '팀 비교 분석', '전담 매니저'],
        cta: '프로 시작',
        highlighted: true
    },
    {
        name: '동호회 엔터프라이즈',
        price: '문의',
        period: '',
        members: '무제한',
        features: ['프로 모든 기능', '맞춤 기능 개발', 'API 연동', '전용 서버', 'VIP 지원'],
        cta: '문의하기',
        highlighted: false
    }
];

export default function PricingPage() {
    const [tab, setTab] = useState<'individual' | 'club'>('individual');
    const plans = tab === 'individual' ? individualPlans : clubPlans;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">요금제</h1>
                    <p className="text-gray-400 text-lg mb-8">당신에게 맞는 플랜을 선택하세요</p>

                    {/* 탭 선택 */}
                    <div className="inline-flex bg-gray-900 rounded-xl p-1">
                        <button
                            onClick={() => setTab('individual')}
                            className={`px-6 py-3 rounded-lg font-bold transition ${tab === 'individual' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            🏌️ 일반인용
                        </button>
                        <button
                            onClick={() => setTab('club')}
                            className={`px-6 py-3 rounded-lg font-bold transition ${tab === 'club' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            👥 동호회용
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-8 ${plan.highlighted
                                ? `bg-gradient-to-b ${tab === 'individual' ? 'from-green-900/50' : 'from-blue-900/50'} to-gray-900 border-2 ${tab === 'individual' ? 'border-green-500' : 'border-blue-500'} scale-105`
                                : 'bg-gray-900 border border-gray-800'
                                }`}
                        >
                            {plan.highlighted && (
                                <span className={`${tab === 'individual' ? 'bg-green-500' : 'bg-blue-500'} text-black text-xs font-bold px-3 py-1 rounded-full`}>
                                    가장 인기
                                </span>
                            )}
                            <h2 className="text-2xl font-bold mt-4">{plan.name}</h2>
                            {'members' in plan && (
                                <p className="text-blue-400 text-sm mt-1">{plan.members}</p>
                            )}
                            <div className="mt-4 mb-6">
                                {plan.price === '문의' ? (
                                    <span className="text-3xl font-black">문의</span>
                                ) : (
                                    <>
                                        <span className="text-4xl font-black">₩{plan.price}</span>
                                        <span className="text-gray-400">/{plan.period}</span>
                                    </>
                                )}
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2">
                                        <svg className={`w-5 h-5 ${tab === 'individual' ? 'text-green-400' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={plan.price === '0' ? '/register' : plan.price === '문의' ? '/contact' : '/payment'}
                                className={`block w-full text-center py-3 rounded-xl font-bold transition ${plan.highlighted
                                    ? `${tab === 'individual' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`
                                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 결제 안내 */}
                <div className="mt-16 bg-gray-900 rounded-2xl p-8 border border-gray-800">
                    <h3 className="text-xl font-bold mb-4 text-green-400">💳 결제 안내</h3>
                    <p className="text-gray-300 mb-4">
                        무통장 입금 후 관리자 승인이 완료되면 서비스를 이용하실 수 있습니다.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="font-bold text-lg">카카오뱅크 7777034553512</p>
                        <p className="text-gray-400">예금주: 박두리</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
