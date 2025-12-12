'use client';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <h1 className="text-9xl font-black text-green-500">404</h1>
                <h2 className="text-2xl font-bold mt-4">페이지를 찾을 수 없습니다</h2>
                <p className="text-gray-400 mt-2 text-center">
                    요청하신 페이지가 존재하지 않거나 이동되었습니다.
                </p>
                <Link
                    href="/"
                    className="mt-8 bg-green-600 hover:bg-green-500 px-8 py-3 rounded-full font-bold transition"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
