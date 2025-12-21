import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ChevronRight, Zap, BarChart3, History, Check, X } from "lucide-react";
import { useState } from "react";

/**
 * ProView AI Landing Page
 * Design: Cyberpunk Minimalism
 * Color Scheme: Deep Charcoal (#121212) + Neon Green (#39FF14) + Lime Green (#7FFF00)
 * Typography: Pretentard (Display/Heading) + Inter (Body/Caption)
 * Layout: Asymmetric, minimalist with ample whitespace
 */

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

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email) {
      setSubscribed(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <img
              src="/images/logo-proview-ai.jpg"
              alt="ProView AI Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground">ProView AI</span>
          </motion.div>
          
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            <a href="#features" className="text-sm text-muted-foreground hover:text-neon-green transition-colors duration-300">
              기능
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-neon-green transition-colors duration-300">
              가격
            </a>
            <a href="#cta" className="text-sm text-muted-foreground hover:text-neon-green transition-colors duration-300">
              사전 예약
            </a>
          </motion.nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-lime-green/5 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-display text-foreground leading-tight">
                  프로의 눈을<br />
                  <span className="neon-glow text-neon-green">당신의 폰에</span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                Gemini AI가 분석하는 0.1초의 기적. 레슨비 30만 원 대신 주머니 속 AI 코치를 만나보세요.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Button
                  className="neon-button px-8 py-6 text-lg h-auto rounded-lg"
                  onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  지금 사전 예약하고 1개월 무료권 받기
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 pt-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center text-xs font-bold text-neon-green"
              >
                {i}k
              </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-neon-green font-semibold">3,000+</span> 골퍼가 이미 시작했습니다
                </p>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-80 sm:h-96 md:h-full flex items-center justify-center"
            >
              <img
                src="/images/hero-background.png"
                alt="Hero Background"
                className="w-full h-full object-cover rounded-2xl border-2 border-neon-green/30"
              />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">
              AI가 제공하는 세 가지 혁신
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gemini의 고급 비전 AI 기술로 당신의 골프 스윙을 완벽하게 분석합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-lime-green/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-8 rounded-xl border border-neon-green/20 hover:border-neon-green/50 transition-colors duration-300">
                  <div className="mb-6 inline-flex p-3 rounded-lg bg-neon-green/10 group-hover:bg-neon-green/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-subheading text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-heading text-foreground mb-4">
              합리적인 가격, 무한한 가능성
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              당신의 필요에 맞는 플랜을 선택하세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                period: "원",
                description: "기본 분석 기능",
                features: [
                  { text: "일 3회 분석", included: true },
                  { text: "기본 궤적 가이드", included: true },
                  { text: "AI 정밀 리포트", included: false },
                  { text: "우선 연산 처리", included: false },
                ],
                cta: "지금 시작",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "19,000",
                period: "원/월",
                description: "전문가 수준의 분석",
                features: [
                  { text: "무제한 분석", included: true },
                  { text: "기본 궤적 가이드", included: true },
                  { text: "AI 정밀 리포트", included: true },
                  { text: "우선 연산 처리", included: true },
                ],
                cta: "Pro 플랜 선택",
                highlighted: true,
                badge: "Best",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative rounded-xl border transition-all duration-300 ${
                  plan.highlighted
                    ? "neon-border bg-card/50"
                    : "border-border hover:border-neon-green/30"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 right-8 px-4 py-1 bg-neon-green text-background text-xs font-bold rounded-full">
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-8 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-neon-green">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-neon-green flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full py-6 text-base h-auto rounded-lg ${
                      plan.highlighted
                        ? "neon-button"
                        : "bg-secondary text-foreground hover:bg-medium-gray"
                    }`}
                    onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-heading text-foreground mb-3 sm:mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                이메일을 입력하고 1개월 무료 프리미엄 플랜을 받으세요.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-card border-neon-green/30 text-foreground placeholder:text-muted-foreground focus:border-neon-green focus:ring-neon-green/50 h-12 text-sm"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="neon-button px-6 sm:px-8 h-12 rounded-lg sm:w-auto whitespace-nowrap text-sm sm:text-base"
                >
                  {isSubmitting ? "처리 중..." : "사전 예약 완료"}
                </Button>
              </div>

              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-center text-sm"
                >
                  ✓ 사전 예약이 완료되었습니다! 곳 이메일로 연락드리게스늵니다.
                </motion.div>
              )}
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              스팸 없음. 언제든지 구독 해제할 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 relative">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 text-sm"><div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/logo-proview-ai.jpg"
                alt="ProView AI"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-foreground">ProView AI</span>
            </div>
              <p className="text-sm text-muted-foreground">
                Gemini AI로 당신의 골프 스윙을 완벽하게 분석하세요.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">기능</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">가격</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">블로그</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">연락처</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">법적</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">개인정보</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2024 ProView AI. 모든 권리 보유.</p>
            <p>Powered by Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
