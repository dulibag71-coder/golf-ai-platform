'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronRight } from 'lucide-react';
import AnimatedButton from './ui/AnimatedButton';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string>('user');
    const [isPaid, setIsPaid] = useState(false);
    const [isClub, setIsClub] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setUserRole('user');
                setIsPaid(false);
                setIsClub(false);
                return;
            }

            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const prevUser = JSON.parse(localStorage.getItem('user') || '{}');

                // If role changed (upgraded), show notification
                if (prevUser.role && data.role && prevUser.role !== data.role) {
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 8000);
                }

                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                setUserRole(data.role || 'user');
                setIsPaid(['pro', 'elite', 'admin'].includes(data.role));
                setIsClub(['club_starter', 'club_pro', 'club_enterprise', 'admin'].includes(data.role));
            } else {
                // If token is invalid or expired, clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setUserRole('user');
                setIsPaid(false);
                setIsClub(false);
            }
        } catch (e) {
            console.error('Navbar profile refresh failed:', e);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (storedUser.id) {
                setUser(storedUser);
                setUserRole(storedUser.role || 'user');
                setIsPaid(['pro', 'elite', 'admin'].includes(storedUser.role));
                setIsClub(['club_starter', 'club_pro', 'club_enterprise', 'admin'].includes(storedUser.role));
            }

            // Initial refresh
            refreshUser();

            // Periodic refresh every 5 minutes
            const interval = setInterval(refreshUser, 1000 * 60 * 5);

            const handleScroll = () => setScrolled(window.scrollY > 20);
            window.addEventListener('scroll', handleScroll);

            return () => {
                clearInterval(interval);
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Removed duplicate isPaid/isClub declarations. They are now state variables.

    const navLinks = [
        { name: '스윙 분석', href: '/swing-analysis' },
        { name: '성능 기록', href: '/performance' },
        { name: '훈련', href: '/training' },
        ...(isPaid ? [
            { name: '1:1 코칭', href: '/coaching', highlight: true },
            { name: 'Veo 3D', href: '/veo-3d', highlight: true },
            { name: '토너먼트', href: '/tournament', highlight: true }
        ] : []),
        ...(isClub ? [{ name: '팀 대시보드', href: '/team/dashboard', blue: true }] : []),
        ...(userRole === 'admin' ? [{ name: '시스템 관리', href: '/admin', highlight: true }] : []),
        { name: '요금제', href: '/pricing' }
    ];


    return (
        <nav className={cn(
            "fixed w-full z-50 transition-all duration-300 border-b",
            scrolled ? "bg-black/90 backdrop-blur-xl border-white/10 py-2" : "bg-transparent border-transparent py-4"
        )}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-12">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-[180deg] transition-all duration-500 shadow-[0_0_15px_var(--accent-glow)]">
                                <span className="text-black font-black text-sm italic">G</span>
                            </div>
                            <span className="text-2xl font-display font-black tracking-tighter tech-glow italic">GOLFING<span className="text-white">AI</span></span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-xs font-mono uppercase tracking-widest transition-colors hover:text-accent",
                                        link.highlight ? "text-accent" :
                                            link.blue ? "text-blue-400" : "text-muted"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {showNotification && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/40 rounded-full"
                            >
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-accent uppercase tracking-tighter italic">UPGRADED</span>
                            </motion.div>
                        )}
                        {user ? (
                            <div className="flex items-center gap-4">
                                {isPaid && (
                                    <span className="font-mono text-[10px] px-2 py-0.5 border border-accent/30 text-accent rounded uppercase">
                                        {userRole}
                                    </span>
                                )}
                                <button onClick={handleLogout} className="text-muted hover:text-white transition-colors">
                                    <LogOut size={18} />
                                </button>
                                <Link href="/profile">
                                    <AnimatedButton size="sm" variant="outline">
                                        PROFILE
                                    </AnimatedButton>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link href="/login" className="text-xs font-mono text-muted hover:text-white uppercase tracking-widest">
                                    LOGIN
                                </Link>
                                <Link href="/register">
                                    <AnimatedButton size="sm">
                                        START PROJECT
                                    </AnimatedButton>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-black border-b border-white/10 p-6 md:hidden"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between text-muted hover:text-white py-2 group"
                                >
                                    <span className="font-mono text-sm uppercase tracking-widest">{link.name}</span>
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                {user ? (
                                    <>
                                        <Link href="/profile" onClick={() => setMenuOpen(false)}>
                                            <AnimatedButton className="w-full">MY DASHBOARD</AnimatedButton>
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-center text-red-400 font-mono text-xs uppercase pt-2">
                                            DISCONNECT
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/register" onClick={() => setMenuOpen(false)}>
                                        <AnimatedButton className="w-full">INITIALIZE ACCESS</AnimatedButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}
