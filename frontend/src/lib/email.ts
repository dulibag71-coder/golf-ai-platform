// 이메일 발송 유틸리티 (Resend API 사용)
// Vercel에서 RESEND_API_KEY 환경변수 설정 필요

export async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.log('RESEND_API_KEY not set, email not sent:', { to, subject });
        return { success: false, message: 'Email API key not configured' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Golfing AI <noreply@resend.dev>',
                to: [to],
                subject: subject,
                html: html
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Email sent successfully:', data);
            return { success: true, data };
        } else {
            console.error('Email send failed:', data);
            return { success: false, error: data };
        }
    } catch (error: any) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
}

// 레슨 예약 확인 이메일 템플릿
export function getLessonConfirmationEmail(lessonType: string, date: string, time: string) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10B981;">🏌️ 레슨 예약 확인</h1>
        <p>안녕하세요! Golfing AI입니다.</p>
        <p>레슨 예약이 확정되었습니다.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p><strong>📚 레슨 주제:</strong> ${lessonType}</p>
            <p><strong>📅 날짜:</strong> ${date}</p>
            <p><strong>⏰ 시간:</strong> ${time}</p>
        </div>
        
        <p>예약 시간 10분 전에 온라인 레슨 링크가 발송됩니다.</p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            문의: 010-8632-3819<br>
            Golfing AI - 당신의 골프 파트너
        </p>
    </div>
    `;
}

// 결제 승인 이메일 템플릿
export function getPaymentApprovedEmail(planName: string, expiresAt: string) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10B981;">✅ 결제 승인 완료</h1>
        <p>안녕하세요! Golfing AI입니다.</p>
        <p>결제가 승인되어 플랜이 활성화되었습니다.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p><strong>📦 플랜:</strong> ${planName}</p>
            <p><strong>📅 만료일:</strong> ${expiresAt}</p>
        </div>
        
        <p>이제 모든 프리미엄 기능을 이용하실 수 있습니다!</p>
        
        <a href="https://frontend-mut6tj5gp-dulibag71-6261s-projects.vercel.app/dashboard" 
           style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            서비스 이용하기 →
        </a>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            문의: 010-8632-3819<br>
            Golfing AI - 당신의 골프 파트너
        </p>
    </div>
    `;
}

// 훈련 프로그램 시작 이메일 템플릿
export function getTrainingStartEmail(programName: string, weeks: number) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B5CF6;">🎯 훈련 프로그램 시작</h1>
        <p>안녕하세요! Golfing AI입니다.</p>
        <p><strong>${programName}</strong> 프로그램이 시작되었습니다!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p><strong>📚 프로그램:</strong> ${programName}</p>
            <p><strong>⏱️ 기간:</strong> ${weeks}주</p>
        </div>
        
        <h3>이번 주 훈련 목표:</h3>
        <ul>
            <li>매일 10분 스트레칭</li>
            <li>스윙 연습 30회</li>
            <li>AI 코치와 1회 상담</li>
        </ul>
        
        <a href="https://frontend-mut6tj5gp-dulibag71-6261s-projects.vercel.app/tournament" 
           style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            훈련 시작하기 →
        </a>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            Golfing AI - 당신의 골프 파트너
        </p>
    </div>
    `;
}
