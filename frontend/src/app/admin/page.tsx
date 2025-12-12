'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

const ADMIN_PASSWORD = '130824';

interface Payment {
    id: number;
    user_id: number;
    email?: string;
    amount: number;
    sender_name: string;
    status: string;
    created_at: string;
}

interface User {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface Stats {
    totalUsers: number;
    totalSwings: number;
    pendingPayments: number;
    revenue: number;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSwings: 0, pendingPayments: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'users'>('overview');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    // 관리자 비밀번호 인증 확인
    useEffect(() => {
        const adminAuth = sessionStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // 데이터 로딩 (인증 후에만 실행)
    useEffect(() => {
        if (!isAuthenticated) return;

        // 관리자 비밀번호로 인증되면 바로 데이터 로드
        const loadData = async () => {
            try {
                const [paymentsData, usersData, statsData] = await Promise.all([
                    api.get('/admin/payments').catch(() => []),
                    api.get('/admin/users').catch(() => []),
                    api.get('/admin/stats').catch(() => ({ totalUsers: 0, pendingPayments: 0, revenue: 0, totalSwings: 0 }))
                ]);
                setPayments(paymentsData || []);
                setUsers(usersData || []);
                setStats({
                    totalUsers: statsData.totalUsers || 0,
                    totalSwings: statsData.totalSwings || 0,
                    pendingPayments: statsData.pendingPayments || 0,
                    revenue: statsData.revenue || 0
                });
            } catch (error) {
                console.log('API 연결 대기중...');
            }
            setLoading(false);
        };

        loadData();
    }, [isAuthenticated]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuth', 'true');
            setIsAuthenticated(true);
            setPasswordError('');
        } else {
            setPasswordError('비밀번호가 올바르지 않습니다.');
        }
    };

    // 비밀번호 입력 화면
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">🔐 관리자 인증</h1>
                        <p className="text-gray-400">관리자 비밀번호를 입력하세요</p>
                    </div>
                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-green-500"
                            autoFocus
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mb-4">{passwordError}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition"
                        >
                            확인
                        </button>
                    </form>
                    <Link href="/" className="block text-center text-gray-400 hover:text-white mt-4">
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    const handleApprove = async (paymentId: number) => {
        try {
            await api.post('/admin/payments/approve', { paymentId }, token || '');
            setPayments(payments.filter(p => p.id !== paymentId));
            setStats(prev => ({ ...prev, pendingPayments: prev.pendingPayments - 1 }));
            alert('결제가 승인되었습니다!');
        } catch (e) {
            alert('승인 실패');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">관리자 패널 로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Admin Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-2xl font-bold text-green-400">Golfing</Link>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-300 font-medium">관리자 대시보드</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">박두리 (CEO)</span>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                            className="text-sm text-gray-400 hover:text-white"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-4">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            📊 대시보드
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'payments' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            💳 결제 관리
                            {stats.pendingPayments > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {stats.pendingPayments}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            👥 회원 관리
                        </button>
                    </nav>

                    {/* Bank Info */}
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-bold text-green-400 mb-2">입금 계좌</h4>
                        <p className="text-sm text-white">카카오뱅크</p>
                        <p className="text-sm text-gray-300">7777034553512</p>
                        <p className="text-xs text-gray-400 mt-1">예금주: 박두리</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {activeTab === 'overview' && (
                        <div>
                            <h1 className="text-2xl font-bold mb-8">대시보드 개요</h1>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <StatCard title="총 회원수" value={stats.totalUsers} suffix="명" color="blue" />
                                <StatCard title="총 스윙 분석" value={stats.totalSwings} suffix="회" color="green" />
                                <StatCard title="대기 결제" value={stats.pendingPayments} suffix="건" color="yellow" />
                                <StatCard title="이번 달 매출" value={stats.revenue.toLocaleString()} suffix="원" color="purple" />
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                    <h2 className="text-lg font-bold mb-4">최근 결제 대기</h2>
                                    {payments.length === 0 ? (
                                        <p className="text-gray-500">대기 중인 결제가 없습니다</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {payments.slice(0, 5).map(p => (
                                                <li key={p.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{p.sender_name || '알 수 없음'}</p>
                                                        <p className="text-sm text-gray-400">{p.amount?.toLocaleString()}원</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleApprove(p.id)}
                                                        className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
                                                    >
                                                        승인
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                    <h2 className="text-lg font-bold mb-4">최근 가입 회원</h2>
                                    <ul className="space-y-3">
                                        {users.slice(0, 5).map(u => (
                                            <li key={u.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{u.email}</p>
                                                    <p className="text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                    {u.role}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div>
                            <h1 className="text-2xl font-bold mb-8">결제 관리</h1>
                            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="text-left p-4">ID</th>
                                            <th className="text-left p-4">입금자명</th>
                                            <th className="text-left p-4">금액</th>
                                            <th className="text-left p-4">상태</th>
                                            <th className="text-left p-4">일시</th>
                                            <th className="text-left p-4">작업</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(p => (
                                            <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                                <td className="p-4">{p.id}</td>
                                                <td className="p-4">{p.sender_name || '-'}</td>
                                                <td className="p-4">{p.amount?.toLocaleString()}원</td>
                                                <td className="p-4">
                                                    <span className="bg-yellow-600 text-xs px-2 py-1 rounded">대기중</span>
                                                </td>
                                                <td className="p-4 text-gray-400">{new Date(p.created_at).toLocaleString()}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleApprove(p.id)}
                                                        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold"
                                                    >
                                                        승인
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {payments.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                                    대기 중인 결제가 없습니다
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <h1 className="text-2xl font-bold mb-8">회원 관리</h1>
                            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="text-left p-4">ID</th>
                                            <th className="text-left p-4">이메일</th>
                                            <th className="text-left p-4">권한</th>
                                            <th className="text-left p-4">상태</th>
                                            <th className="text-left p-4">가입일</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                                <td className="p-4">{u.id}</td>
                                                <td className="p-4">{u.email}</td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                        {u.role === 'admin' ? '관리자' : '일반회원'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded ${u.is_active ? 'bg-green-600' : 'bg-red-600'}`}>
                                                        {u.is_active ? '활성' : '비활성'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function StatCard({ title, value, suffix, color }: { title: string; value: number | string; suffix: string; color: string }) {
    const colors: Record<string, string> = {
        blue: 'from-blue-600 to-blue-800',
        green: 'from-green-600 to-green-800',
        yellow: 'from-yellow-600 to-yellow-800',
        purple: 'from-purple-600 to-purple-800'
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} p-6 rounded-xl`}>
            <p className="text-sm text-white/70">{title}</p>
            <p className="text-3xl font-black mt-2">{value}<span className="text-lg font-normal ml-1">{suffix}</span></p>
        </div>
    );
}
