'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, BarChart3, History, Check, X, MousePointer2 } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#E8E8E8] font-sans selection:bg-neon-green/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-lime-green/5 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/20 bg-neon-green/5 text-neon-green font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                >
                  <Zap size={10} className="fill-current" /> 차세대 분석 시스템
                </motion.div>
                <h1 className="font-display text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                  프로의 눈을<br />
                  <span className="text-neon-green neon-glow">당신의 폰에</span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg text-muted font-mono uppercase tracking-widest leading-relaxed max-w-md opacity-80"
              >
                Gemini AI가 분석하는 0.1초의 기적.<br />
                레슨비 30만 원 대신 주머니 속 AI 코치를 만나보세요.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <AnimatedButton className="w-full sm:w-auto h-16 px-10 text-sm font-black tracking-[0.2em]">
                    분석 프로토콜 시작 <ChevronRight className="ml-2 w-4 h-4" />
                  </AnimatedButton>
                </Link>
                <Link href="/demo">
                  <AnimatedButton variant="outline" className="w-full sm:w-auto h-16 px-10 text-sm font-black tracking-[0.2em] border-white/10 text-white hover:border-neon-green transition-all">
                    데모 실행
                  </AnimatedButton>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 pt-4 border-t border-white/5"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-neon-green/20 border-2 border-black flex items-center justify-center text-xs font-bold text-neon-green backdrop-blur-md"
                    >
                      {i}k
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted font-mono uppercase tracking-widest">
                  <span className="text-neon-green font-semibold">3,000+</span> 명의 골퍼가 분석 중
                </p>
              </motion.div>
            </motion.div>

            {/* Right Visual - Cyber Scan Aspect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-neon-green/5 rounded-3xl blur-2xl" />
              <div className="relative w-full h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group">
                {/* Simulated AI Scan Line */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-neon-green shadow-[0_0_15px_#39FF14] z-20"
                />
                <img
                  src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop"
                  alt="AI Swing Analysis"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
                />

                {/* Scan Overlay Tags */}
                <div className="absolute top-10 left-10 p-4 border border-neon-green/30 bg-black/60 rounded backdrop-blur-md font-mono text-[10px] text-neon-green">
                  <p>상태: 자세 분석 중</p>
                  <p className="mt-1">정밀도: 99.4%</p>
                </div>
                <div className="absolute bottom-10 right-10 p-4 border border-white/10 bg-black/60 rounded backdrop-blur-md font-mono text-[10px] text-white">
                  <p>지연율: 124MS</p>
                  <p className="mt-1">엔진: GEMINI_VISION_V2</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 italic">
              AI가 제공하는 세 가지 혁신
            </h2>
            <p className="text-muted text-sm font-mono uppercase tracking-widest max-w-2xl mx-auto opacity-70">
              Gemini의 고급 비전 AI 기술로 당신의 골프 스윙을 완벽하게 분석합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "초정밀 궤적 인식",
                description: "클럽과 볼의 움직임을 0.1초 단위로 추적하여 정확한 데이터를 제공합니다.",
              },
              {
                icon: BarChart3,
                title: "AI 맞춤형 처방",
                description: "당신의 스윙 데이터를 분석하여 개선할 점과 강점을 명확히 제시합니다.",
              },
              {
                icon: History,
                title: "스윙 히스토리 관리",
                description: "모든 스윙 기록을 저장하고 진행 상황을 시각적으로 추적하세요.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-neon-green/30 transition-all duration-500"
              >
                <div className="mb-8 inline-flex p-4 rounded-xl bg-neon-green/10 text-neon-green group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tighter uppercase mb-4">{feature.title}</h3>
                <p className="text-muted text-xs font-mono uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="font-display text-5xl font-black tracking-tighter uppercase mb-8 italic">
            지금 바로 시작하세요
          </h2>
          <p className="text-muted text-sm font-mono uppercase tracking-widest mb-12 opacity-70">
            이메일을 입력하고 1개월 무료 프리미엄 플랜을 받으세요.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-neon-green font-mono text-xs tracking-widest uppercase transition-all"
            />
            <AnimatedButton type="submit" className="h-14 px-8 text-xs font-black tracking-[0.2em]">
              구독하기
            </AnimatedButton>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neon-green font-mono text-[10px] mt-6 tracking-widest"
            >
              프로토콜 잠금됨: 다음 지침을 위해 받은 편지함을 확인하세요
            </motion.p>
          )}
        </div>
      </section>

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-neon-green rounded flex items-center justify-center font-black text-black italic">G</div>
            <span className="font-bold tracking-tighter uppercase">GOLFING AI [V2.1]</span>
          </div>
          <p className="text-[10px] text-muted font-mono uppercase tracking-widest">
            &copy; 2024 PROVIEW SYSTEMS. 모든 권리 보유.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[10px] text-muted hover:text-neon-green uppercase tracking-widest font-mono">개인정보 처리방침</Link>
            <Link href="#" className="text-[10px] text-muted hover:text-neon-green uppercase tracking-widest font-mono">이용약관</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
