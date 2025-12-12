'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const plans = [
    {
        name: '무료 체험',
        price: '0',
        period: '14일',
        features: [
            '스윙 분석 3회',
            'AI 코치 기본 상담',
            '기본 통계 확인',
        ],
        cta: '무료로 시작하기',
        highlighted: false
    },
    {
        name: '프로',
        price: '29,900',
        period: '월',
        features: [
            '무제한 스윙 분석',
            'AI 코치 무제한 상담',
            '상세 통계 및 리포트',
            '맞춤 훈련 프로그램',
            '영상 저장 (100GB)',
        ],
        cta: '프로 플랜 시작',
        highlighted: true
    },
    {
        name: '엘리트',
        price: '59,900',
        period: '월',
        features: [
            '프로 플랜 모든 기능',
            '1:1 프로 레슨 연결',
            '대회 준비 코칭',
            '우선 고객 지원',
            '영상 저장 무제한',
        ],
        cta: '엘리트 플랜 시작',
        highlighted: false
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">요금제</h1>
                    <p className="text-gray-400 text-lg">당신에게 맞는 플랜을 선택하세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl p-8 ${plan.highlighted
                                    ? 'bg-gradient-to-b from-green-900/50 to-gray-900 border-2 border-green-500 scale-105'
                                    : 'bg-gray-900 border border-gray-800'
                                }`}
                        >
                            {plan.highlighted && (
                                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                    가장 인기
                                </span>
                            )}
                            <h2 className="text-2xl font-bold mt-4">{plan.name}</h2>
                            <div className="mt-4 mb-6">
                                <span className="text-4xl font-black">₩{plan.price}</span>
                                <span className="text-gray-400">/{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/register"
                                className={`block w-full text-center py-3 rounded-xl font-bold transition ${plan.highlighted
                                        ? 'bg-green-600 hover:bg-green-500 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Payment Info */}
                <div className="mt-16 bg-gray-900 rounded-2xl p-8 border border-gray-800">
                    <h3 className="text-xl font-bold mb-4 text-green-400">💳 결제 안내</h3>
                    <p className="text-gray-300 mb-4">
                        현재 무통장 입금 방식으로 결제가 진행됩니다. 아래 계좌로 입금 후 관리자 승인이 완료되면 서비스를 이용하실 수 있습니다.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="font-bold text-lg">카카오뱅크 7777034553512</p>
                        <p className="text-gray-400">예금주: 박두리</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        * 입금 시 입금자명을 회원가입 시 사용한 이름과 동일하게 해주세요.
                    </p>
                </div>
            </div>
        </div>
    );
}
