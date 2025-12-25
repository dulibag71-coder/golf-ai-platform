import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "GOLFING - AI Mission Control",
  description: "AI와 함께 완벽한 스윙을 만들어보세요. 스윙 분석, AI 코치, 맞춤 훈련 프로그램을 제공합니다.",
  keywords: "골프, AI, 스윙 분석, 골프 레슨, 골프 코치",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <ChatWidget />
        </QueryProvider>
      </body>
    </html>
  );
}
